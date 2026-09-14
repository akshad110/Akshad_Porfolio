"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { cn, optimizedMediaUrl } from "@/lib/utils";

export type MasonryItem = {
  id: string;
  img: string;
  url?: string;
  height: number;
  title?: string;
};

type GridItem = MasonryItem & {
  x: number;
  y: number;
  w: number;
  h: number;
  ratio: number;
  displaySrc: string;
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

const COLUMN_QUERIES = [
  "(min-width: 1500px)",
  "(min-width: 1000px)",
  "(min-width: 768px)",
  "(min-width: 640px)",
] as const;
const COLUMN_VALUES = [5, 4, 3, 2] as const;
const MAX_CARD_WIDTH = 280;

function readColumns() {
  const match = COLUMN_QUERIES.findIndex((query) => window.matchMedia(query).matches);
  return COLUMN_VALUES[match] ?? 1;
}

function subscribeColumns(onStoreChange: () => void) {
  const media = COLUMN_QUERIES.map((query) => window.matchMedia(query));
  media.forEach((entry) => entry.addEventListener("change", onStoreChange));
  return () => media.forEach((entry) => entry.removeEventListener("change", onStoreChange));
}

function useColumnCount() {
  // Sync with viewport immediately — old default of 1 made cards full-width/huge on first paint.
  return useSyncExternalStore(subscribeColumns, readColumns, () => 3);
}

function thumbSrc(src: string) {
  return optimizedMediaUrl(src, 700) ?? src;
}

function loadImageRatio(src: string, fallback: number) {
  return new Promise<number>((resolve) => {
    if (!src) {
      resolve(fallback);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : fallback;
      resolve(Number.isFinite(ratio) && ratio > 0 ? ratio : fallback);
    };
    img.onerror = () => resolve(fallback);
    img.src = src;
  });
}

function fallbackRatio(item: MasonryItem) {
  return item.height > 0 ? item.height / 400 : 1.15;
}

export function MasonryGallery({
  items,
  ease = "power3.out",
  duration = 0.45,
  stagger = 0.04,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = false,
  colorShiftOnHover = false,
  className,
  itemClassName,
  onItemClick,
}: MasonryGalleryProps) {
  const viewportColumns = useColumnCount();
  const columns = Math.max(1, Math.min(viewportColumns, items.length || 1));

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((item) => [item.id, fallbackRatio(item)])),
  );
  const animatedIds = useRef(new Set<string>());

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setRatios((prev) => {
      const next = { ...prev };
      for (const item of items) {
        if (next[item.id] == null) next[item.id] = fallbackRatio(item);
      }
      return next;
    });

    void Promise.all(
      items.map(async (item) => {
        const ratio = await loadImageRatio(thumbSrc(item.img), fallbackRatio(item));
        return [item.id, ratio] as const;
      }),
    ).then((entries) => {
      if (cancelled) return;
      setRatios((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    });

    return () => {
      cancelled = true;
    };
  }, [items]);

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"] as const;
      direction = dirs[Math.floor(Math.random() * dirs.length)];
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -120 };
      case "bottom":
        return { x: item.x, y: item.y + 80 };
      case "left":
        return { x: -80, y: item.y };
      case "right":
        return { x: window.innerWidth + 80, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 60 };
    }
  };

  const { grid, containerHeight } = useMemo(() => {
    if (!width) return { grid: [] as GridItem[], containerHeight: 0 };

    const gap = width < 640 ? 14 : 24;
    const fluidWidth = (width - (columns - 1) * gap) / columns;
    // Cap card size so a temporary low count never stretches tiles full-bleed.
    const columnWidth = Math.min(MAX_CARD_WIDTH, fluidWidth);
    const usedWidth = columns * columnWidth + (columns - 1) * gap;
    const offsetX = Math.max(0, (width - usedWidth) / 2);

    const colHeights = new Array(columns).fill(0);
    const minRatio = 0.56;
    const maxRatio = width < 640 ? 1.25 : 1.45;

    const gridItems = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = offsetX + col * (columnWidth + gap);
      const natural = ratios[child.id] ?? fallbackRatio(child);
      const ratio = Math.min(Math.max(natural, minRatio), maxRatio);
      const height = columnWidth * ratio;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return {
        ...child,
        x,
        y,
        w: columnWidth,
        h: height,
        ratio: natural,
        displaySrc: thumbSrc(child.img),
      };
    });

    return { grid: gridItems, containerHeight: Math.max(...colHeights, 0) };
  }, [columns, items, ratios, width]);

  useLayoutEffect(() => {
    if (!grid.length) return;

    grid.forEach((item, index) => {
      const element = containerRef.current?.querySelector(`[data-key="${item.id}"]`);
      if (!element) return;

      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!animatedIds.current.has(item.id)) {
        animatedIds.current.add(item.id);
        const start = getInitialPosition(item);
        gsap.fromTo(
          element,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(8px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.55,
            ease: "power3.out",
            delay: Math.min(index, 8) * stagger,
          },
        );
      } else {
        gsap.to(element, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });
  }, [grid, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(element, { scale: hoverScale, duration: 0.4, ease: "power2.out" });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.4 });
    }
  };

  const handleMouseLeave = (element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(element, { scale: 1, duration: 0.4, ease: "power2.out" });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.4 });
    }
  };

  return (
    <div
      ref={containerRef}
      data-grid-ignore
      className={cn("relative w-full", className)}
      style={{ height: containerHeight || undefined, minHeight: width ? undefined : "320px" }}
    >
      {grid.map((item, index) => (
        <button
          key={item.id}
          type="button"
          data-key={item.id}
          className={cn(
            "group absolute overflow-hidden rounded-xl border border-border bg-background-secondary text-left",
            itemClassName,
          )}
          style={{ willChange: "transform, width, height, opacity, filter" }}
          onClick={() => onItemClick?.(item)}
          onMouseEnter={(event) => handleMouseEnter(event.currentTarget)}
          onMouseLeave={(event) => handleMouseLeave(event.currentTarget)}
        >
          <div className="relative h-full w-full overflow-hidden bg-[#0e0f0f]">
            <img
              src={item.displaySrc}
              alt={item.title || ""}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              loading={index < 4 ? "eager" : "lazy"}
              fetchPriority={index < 2 ? "high" : "auto"}
              decoding="async"
            />
            {colorShiftOnHover ? (
              <div className="color-overlay pointer-events-none absolute inset-0 bg-linear-to-tr from-accent/40 to-accent-bright/40 opacity-0" />
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
