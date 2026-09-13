"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AboutTilt({
  children,
  className,
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateY(${x * max}deg) rotateX(${-y * max * 0.7}deg) translateZ(12px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div className="[perspective:1100px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn(
          "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
