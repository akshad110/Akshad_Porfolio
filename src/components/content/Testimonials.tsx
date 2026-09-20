"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials as fallbackQuotes } from "@/data/site";
import { cn } from "@/lib/utils";

type Quote = {
  quote: string;
  name: string;
  role: string;
};

export function Testimonials({ items }: { items?: Quote[] }) {
  const quotes = items?.length ? items : fallbackQuotes;
  const loop = [...quotes, ...quotes];
  const trackRef = useRef<HTMLUListElement>(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, origin: 0 });
  const [dragging, setDragging] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const apply = () => setIsCoarse(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isCoarse) return;

    let frame = 0;
    let last = performance.now();
    const loopWidth = () => {
      const track = trackRef.current;
      if (!track) return 1;
      return Math.max(track.scrollWidth / 2, 1);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!dragRef.current.active) {
        offsetRef.current -= 28 * dt;
        const width = loopWidth();
        if (offsetRef.current <= -width) offsetRef.current += width;
        if (offsetRef.current > 0) offsetRef.current -= width;
        setTick((value) => value + 1);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isCoarse]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      offsetRef.current = dragRef.current.origin + (event.clientX - dragRef.current.startX);
      setTick((value) => value + 1);
    };
    const onUp = () => {
      dragRef.current.active = false;
      setDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging]);

  return (
    <section className="relative overflow-hidden bg-background pt-6 pb-14 sm:pt-8 md:pb-28">
      <div className="container-page text-center">
        <h2 className="font-heading text-[clamp(1.6rem,6vw,3rem)] font-semibold tracking-tight">What People Are Saying</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:mt-4 md:text-base">
          Feedback from clients I&apos;ve worked with on real freelance projects.
        </p>
      </div>

      <div
        data-grid-ignore
        className={cn(
          "group mt-8 overflow-hidden sm:mt-14",
          !isCoarse && "testimonial-marquee",
          isCoarse && "cursor-grab active:cursor-grabbing",
        )}
        style={{ touchAction: isCoarse ? "none" : undefined }}
        onPointerDown={(event) => {
          if (!isCoarse || event.button !== 0) return;
          event.preventDefault();
          dragRef.current = {
            active: true,
            startX: event.clientX,
            origin: offsetRef.current,
          };
          setDragging(true);
        }}
      >
        <ul
          ref={trackRef}
          className={cn(
            "flex w-max gap-3 px-3 py-2 sm:gap-4 sm:px-4",
            !isCoarse && "testimonial-marquee-track",
          )}
          style={
            isCoarse
              ? {
                  transform: `translate3d(${offsetRef.current}px, 0, 0)`,
                  willChange: "transform",
                }
              : undefined
          }
        >
          {loop.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex w-[min(15.25rem,72vw)] shrink-0 flex-col rounded-xl border border-border bg-background-secondary px-3.5 py-4 select-none sm:w-[min(22rem,80vw)] sm:rounded-2xl sm:px-6 sm:py-7"
            >
              <span aria-hidden className="font-heading text-2xl leading-none text-accent-bright sm:text-4xl">
                ”
              </span>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-foreground-secondary sm:mt-4 sm:text-[15px]">
                {item.quote}
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-3 sm:mt-6 sm:gap-3 sm:pt-5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-[10px] font-medium tracking-wide text-accent-soft sm:size-9 sm:text-[11px]">
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground sm:text-sm">{item.name}</p>
                  <p className="text-[11px] text-muted sm:text-xs">{item.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
