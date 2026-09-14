"use client";

import { useSyncExternalStore } from "react";
import { cn, optimizedMediaUrl } from "@/lib/utils";

export type MasonryItem = {
  id: string;
  img: string;
  url?: string;
  height: number;
  title?: string;
};

export type MasonryGalleryProps = {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: MasonryItem) => void;
};

function thumbSrc(src: string) {
  return optimizedMediaUrl(src, 700) ?? src;
}

function subscribeCoarse(onChange: () => void) {
  const media = window.matchMedia("(pointer: coarse)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function useCoarsePointer() {
  return useSyncExternalStore(
    subscribeCoarse,
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );
}

export function MasonryGallery({
  items,
  scaleOnHover = true,
  colorShiftOnHover = false,
  className,
  itemClassName,
  onItemClick,
}: MasonryGalleryProps) {
  const coarse = useCoarsePointer();

  return (
    <div
      data-grid-ignore
      className={cn(
        "grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            "group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-background-secondary text-left",
            !coarse && scaleOnHover && "transition-transform duration-300 hover:scale-[0.98]",
            itemClassName,
          )}
          onClick={() => onItemClick?.(item)}
        >
          <div className="absolute inset-0 overflow-hidden bg-[#0e0f0f]">
            <img
              src={thumbSrc(item.img)}
              alt={item.title || ""}
              className="h-full w-full object-cover object-top"
              loading={index < 4 ? "eager" : "lazy"}
              fetchPriority={index < 2 ? "high" : "auto"}
              decoding="async"
              draggable={false}
            />
            {colorShiftOnHover ? (
              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-accent/40 to-accent-bright/40 opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
            ) : null}
          </div>
          {item.title ? (
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="font-heading text-xs tracking-wider text-white uppercase">{item.title}</p>
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
