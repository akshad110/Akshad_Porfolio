"use client";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SiteCursorGrid } from "@/components/animations/SiteCursorGrid";
import { FloatingActions } from "@/components/ui/FloatingActions";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="site-grain" aria-hidden="true" />
      <CustomCursor />
      <SiteCursorGrid />
      <SmoothScroll>{children}</SmoothScroll>
      <FloatingActions />
    </>
  );
}
