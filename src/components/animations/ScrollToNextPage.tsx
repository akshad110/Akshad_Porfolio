"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollToNextPage({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const [from, to] = Array.from(wrap.children) as HTMLElement[];
    if (!from || !to) return;

    const pinTarget = from.querySelector<HTMLElement>("[data-scroll-pin]") ?? from;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinTarget,
        start: "top top",
        endTrigger: to,
        end: "top top",
        pin: pinTarget,
        pinSpacing: false,
        pinType: "transform",
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    }, wrap);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      {children}
    </div>
  );
}
