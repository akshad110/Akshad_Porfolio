"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Reveal({
  children,
  className,
  y = 36,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        element,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "power3.out",
          paused: true,
        },
      );

      ScrollTrigger.create({
        trigger: element,
        start: "top 88%",
        end: "bottom 8%",
        onEnter: () => tween.restart(true),
        onEnterBack: () => tween.restart(true),
        onLeave: () => {
          tween.pause(0);
          gsap.set(element, { autoAlpha: 0, y });
        },
        onLeaveBack: () => {
          tween.pause(0);
          gsap.set(element, { autoAlpha: 0, y });
        },
      });
    }, element);

    return () => ctx.revert();
  }, [y, delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
