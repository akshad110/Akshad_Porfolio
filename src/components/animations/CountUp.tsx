"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CountUp({
  to,
  decimals = 0,
  suffix = "+",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const format = (value: number) => `${value.toFixed(decimals)}${suffix}`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      element.textContent = format(to);
      return;
    }

    const state = { value: 0 };
    element.textContent = format(0);

    const ctx = gsap.context(() => {
      const tween = gsap.to(state, {
        value: to,
        duration: 1.6,
        ease: "power2.out",
        paused: true,
        onUpdate: () => {
          element.textContent = format(state.value);
        },
      });

      ScrollTrigger.create({
        trigger: element,
        start: "top 92%",
        end: "bottom 8%",
        onEnter: () => {
          state.value = 0;
          element.textContent = format(0);
          tween.restart(true);
        },
        onEnterBack: () => {
          state.value = 0;
          element.textContent = format(0);
          tween.restart(true);
        },
        onLeave: () => {
          tween.pause(0);
          state.value = 0;
          element.textContent = format(0);
        },
        onLeaveBack: () => {
          tween.pause(0);
          state.value = 0;
          element.textContent = format(0);
        },
      });
    }, element);

    return () => ctx.revert();
  }, [to, decimals, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
