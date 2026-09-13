"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CursorGrid } from "@/components/animations/CursorGrid";

export function SiteCursorGrid() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled || pathname.startsWith("/admin")) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <CursorGrid
        cellSize={70}
        color="#22b3d7"
        radius={140}
        falloff="smooth"
        holdTime={400}
        fadeDuration={800}
        lineWidth={1.2}
        maxOpacity={1}
        fillOpacity={0}
        gridOpacity={0}
        cellRadius={0}
        clickPulse
        pulseSpeed={600}
        excludeSelector="#hero, #services"
      />
    </div>
  );
}
