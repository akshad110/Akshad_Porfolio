"use client";

import { useRef, type PointerEvent } from "react";

const MOVE_PX = 12;

/** Ignore taps that were actually a scroll or drag. */
export function useTapNotScroll() {
  const start = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  return {
    onPointerDown: (event: PointerEvent) => {
      start.current = { x: event.clientX, y: event.clientY };
      moved.current = false;
    },
    onPointerMove: (event: PointerEvent) => {
      if (moved.current) return;
      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;
      if (dx * dx + dy * dy > MOVE_PX * MOVE_PX) moved.current = true;
    },
    onPointerCancel: () => {
      moved.current = true;
    },
    wasTap: () => !moved.current,
  };
}
