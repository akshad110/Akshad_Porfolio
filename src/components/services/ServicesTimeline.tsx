"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/site";
import { cn } from "@/lib/utils";
import { ServiceVisual, visualForIndex } from "@/components/services/ServiceVisuals";

gsap.registerPlugin(ScrollTrigger);

const PHASES = services.slice(0, 5);
const LAST = PHASES.length - 1;
const ANGLE_STEP = 0.26;

function polar(cx: number, cy: number, r: number, angle: number) {
  return {
    x: Math.round(cx + r * Math.cos(angle)),
    y: Math.round(cy + r * Math.sin(angle)),
  };
}

function arcPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  r: number,
  sweep: 0 | 1,
) {
  return `M ${from.x} ${from.y} A ${Math.round(r)} ${Math.round(r)} 0 0 ${sweep} ${to.x} ${to.y}`;
}

export function ServicesTimeline() {
  const viewRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    setHydrated(true);
    const view = viewRef.current;
    if (!view) return;

    const measure = () => setSize({ w: view.clientWidth, h: view.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(view);

    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ctx: gsap.Context | null = null;

    const mount = () => {
      ctx?.revert();
      ctx = null;
      if (!desktop.matches || reduced.matches) {
        setProgress(0);
        return;
      }
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: view,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight, 1) * LAST}`,
          pin: true,
          pinType: "transform",
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress * LAST),
        });
      }, view);
      ScrollTrigger.refresh();
    };

    mount();
    desktop.addEventListener("change", mount);
    return () => {
      desktop.removeEventListener("change", mount);
      ro.disconnect();
      ctx?.revert();
    };
  }, []);

  const geometry = useMemo(() => {
    const h = size.h || 800;
    const r = h * 0.58;
    const cx = 270 - r;
    const cy = h * 0.5;
    return { r, cx, cy };
  }, [size.h]);

  const active = Math.round(progress);
  const phase = PHASES[active] ?? PHASES[0];
  const visual = visualForIndex(active);
  const copyOpacity = 1 - Math.min(0.75, Math.abs(progress - active) * 1.25);

  const start = polar(geometry.cx, geometry.cy, geometry.r, -LAST * ANGLE_STEP - 0.18);
  const end = polar(geometry.cx, geometry.cy, geometry.r, LAST * ANGLE_STEP + 0.18);
  const arc = arcPath(start, end, geometry.r, 1);
  const traveled = Math.max(progress, 0) * ANGLE_STEP;
  const doneStart = polar(geometry.cx, geometry.cy, geometry.r, traveled);
  const doneEnd = polar(geometry.cx, geometry.cy, geometry.r, 0);
  const doneArc = arcPath(doneStart, doneEnd, geometry.r, 0);

  return (
    <section id="services" data-grid-ignore className="relative">
      <div ref={viewRef} data-grid-ignore className="relative hidden h-[100dvh] overflow-hidden md:block">
        {hydrated ? (
          <>
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <path d={arc} fill="none" stroke="rgba(248,248,248,0.22)" strokeWidth="1.5" />
          {traveled > 0.012 ? (
            <path d={doneArc} fill="none" stroke="#f8f8f8" strokeWidth="2.5" strokeLinecap="round" />
          ) : null}
        </svg>

        {PHASES.map((item, index) => {
          const offset = index - progress;
          const { x, y } = polar(geometry.cx, geometry.cy, geometry.r, -offset * ANGLE_STEP);
          const isActive = index === active;
          return (
            <div
              key={item.title}
              data-grid-ignore
              className="pointer-events-auto absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full font-heading text-[13px] tracking-[0.04em]",
                  isActive
                    ? "h-16 w-16 bg-foreground text-background"
                    : "h-12 w-12 border border-white/30 bg-[#1c1e1f] text-foreground-secondary",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          );
        })}

        <div className="pointer-events-none relative z-10 flex h-full items-center justify-between gap-10 pr-[min(6vw,96px)] pl-[min(34vw,400px)] pt-16 pb-10">
          <div className="w-[min(40vw,440px)]" style={{ opacity: copyOpacity }}>
            <p className="section-kicker">Phase {String(active + 1).padStart(2, "0")}</p>
            <h2 className="font-heading mt-4 text-4xl leading-[0.95] font-semibold tracking-tight md:text-6xl lg:text-7xl">
              {phase.title}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground-secondary italic md:text-lg">
              {phase.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {phase.deliverables.map((tag) => (
                <span
                  key={tag}
                  data-grid-ignore
                  className="pointer-events-auto rounded-full bg-surface px-3.5 py-1.5 font-heading text-xs tracking-[0.08em] text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            className="relative w-[min(38vw,420px)] shrink-0"
            style={{ opacity: copyOpacity }}
            aria-hidden
          >
            <div className="absolute inset-[12%] rounded-full bg-white/5 blur-3xl" />
            <ServiceVisual id={visual} />
          </div>
        </div>
          </>
        ) : null}
      </div>

      <div className="container-page space-y-8 py-10 sm:space-y-10 sm:py-12 md:hidden">
        {PHASES.map((item, index) => (
          <article key={item.title}>
            <p className="section-kicker">Phase {String(index + 1).padStart(2, "0")}</p>
            <h3 className="font-heading mt-2 text-2xl sm:mt-3 sm:text-3xl">{item.title}</h3>
            <p className="mt-2 text-sm text-foreground-secondary italic sm:mt-3 sm:text-base">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              {item.deliverables.map((tag) => (
                <span key={tag} className="rounded-full bg-surface px-3 py-1 font-heading text-xs text-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
