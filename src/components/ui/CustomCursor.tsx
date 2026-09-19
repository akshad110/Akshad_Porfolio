"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type CursorTheme = {
  from: string;
  to: string;
  fill: string;
};

const IDLE: CursorTheme = { from: "#f8f8f8", to: "#22b3d7", fill: "transparent" };
const CYAN: CursorTheme = { from: "#22b3d7", to: "#8edaed", fill: "rgba(34,179,215,0.16)" };
const INK: CursorTheme = { from: "#0e0f0f", to: "#1985a1", fill: "rgba(14,15,15,0.12)" };
const LIGHT: CursorTheme = { from: "#f8f8f8", to: "#56c8e5", fill: "rgba(248,248,248,0.12)" };

function parseRgb(value: string) {
  const match = value.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])] as const;
}

function luminance(color: string) {
  const rgb = parseRgb(color);
  if (!rgb) return 0;
  return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

function isCyan(color: string) {
  const rgb = parseRgb(color);
  if (!rgb) return false;
  const [r, g, b] = rgb;
  return b > 140 && g > 90 && b > r + 20;
}

function themeFromTarget(node: EventTarget | null): { hover: boolean; hide: boolean; theme: CursorTheme } {
  const el = node instanceof Element ? (node as HTMLElement) : null;
  if (!el) return { hover: false, hide: false, theme: IDLE };

  if (el.closest("input, textarea, select, [contenteditable='true']")) {
    return { hover: false, hide: true, theme: IDLE };
  }

  const hit = el.closest("a, button, [data-cursor='interactive'], [role='button'], label") as HTMLElement | null;
  if (!hit) return { hover: false, hide: false, theme: IDLE };

  const named = hit.getAttribute("data-cursor-theme");
  if (named === "ink") return { hover: true, hide: false, theme: INK };
  if (named === "light") return { hover: true, hide: false, theme: LIGHT };
  if (named === "accent") return { hover: true, hide: false, theme: CYAN };

  const styles = getComputedStyle(hit);
  const className = typeof hit.className === "string" ? hit.className : "";

  if (luminance(styles.backgroundColor) > 0.72 || className.includes("bg-foreground")) {
    return { hover: true, hide: false, theme: INK };
  }
  if (isCyan(styles.color) || className.includes("accent")) {
    return { hover: true, hide: false, theme: CYAN };
  }
  return { hover: true, hide: false, theme: LIGHT };
}

export function CustomCursor() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const startRef = useRef<SVGStopElement>(null);
  const endRef = useRef<SVGStopElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -80, y: -80 });
  const target = useRef({ x: -80, y: -80 });
  const hover = useRef(false);
  const hidden = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!fine || reduced || !root || pathname.startsWith("/admin")) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");
    let frame = 0;

    const paint = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.24;
      pos.current.y += (target.current.y - pos.current.y) * 0.24;
      root.style.opacity = hidden.current ? "0" : "1";
      root.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      const svg = root.querySelector("svg");
      if (svg) {
        svg.style.transform = hover.current
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(0.28)";
      }
      if (coreRef.current) {
        coreRef.current.style.transform = hover.current
          ? "translate(-50%, -50%) scale(0.35)"
          : "translate(-50%, -50%) scale(1)";
      }
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);

    const applyTheme = (theme: CursorTheme) => {
      startRef.current?.setAttribute("stop-color", theme.from);
      endRef.current?.setAttribute("stop-color", theme.to);
      ringRef.current?.setAttribute("fill", theme.fill);
    };

    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      const next = themeFromTarget(event.target);
      hover.current = next.hover;
      hidden.current = next.hide;
      applyTheme(next.theme);
    };

    window.addEventListener("pointermove", move, { passive: true });
    applyTheme(IDLE);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[90] hidden md:block">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        className="absolute top-0 left-0 origin-center"
        style={{ transform: "translate(-50%, -50%) scale(0.28)" }}
      >
        <defs>
          <linearGradient id="cursor-theme-grad" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop ref={startRef} offset="0%" stopColor="#f8f8f8" />
            <stop ref={endRef} offset="100%" stopColor="#22b3d7" />
          </linearGradient>
        </defs>
        <circle
          ref={ringRef}
          cx="36"
          cy="36"
          r="33"
          fill="transparent"
          stroke="url(#cursor-theme-grad)"
          strokeWidth="2.2"
        />
      </svg>
      <div
        ref={coreRef}
        className="absolute top-0 left-0 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(34,179,215,0.45)]"
        style={{ transform: "translate(-50%, -50%) scale(1)" }}
      />
    </div>
  );
}
