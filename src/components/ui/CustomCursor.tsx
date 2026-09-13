"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a, button, [data-cursor='interactive']")));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 mix-blend-difference"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-[width,height] duration-300 ${
          active ? "h-12 w-12" : "h-3 w-3 bg-white"
        }`}
      />
    </div>
  );
}
