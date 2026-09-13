"use client";

import { useRef } from "react";
import Image from "next/image";
import { site } from "@/data/site";

export function AboutPortrait() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 11}deg) translateZ(28px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div className="relative mx-auto w-full max-w-[240px] [perspective:1400px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-background-secondary shadow-[0_24px_48px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d]"
      >
        <Image
          src={site.portrait}
          alt="Akshad Vengurlekar"
          fill
          className="object-cover object-top"
          sizes="240px"
          priority
        />
      </div>
    </div>
  );
}
