"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

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
  capped: boolean;
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

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => {
    if (typeof window === "undefined") return defaultValue;
    const match = queries.findIndex((query) => window.matchMedia(query).matches);
    return values[match] ?? defaultValue;
  };

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const handler = () => setValue(get());
    handler();
    const media = queries.map((query) => window.matchMedia(query));
    media.forEach((entry) => entry.addEventListener("change", handler));
    return () => media.forEach((entry) => entry.removeEventListener("change", handler));
  }, [queries, values, defaultValue]);

  return value;
};

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

export function MasonryGallery({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  className,
  itemClassName,
  onItemClick,
}: MasonryGalleryProps) {
  const columns = useMedia(
    ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 768px)", "(min-width: 640px)"],
    [5, 4, 3, 2],
    1,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setImagesReady(false);

    Promise.all(
      items.map(async (item) => {
        const fallback = item.height > 0 ? item.height / 400 : 1.15;
        const ratio = await loadImageRatio(item.img, fallback);
        return [item.id, ratio] as const;
      }),
    ).then((entries) => {
      if (cancelled) return;
      setRatios(Object.fromEntries(entries));
      setImagesReady(true);
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
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  const { grid, containerHeight } = useMemo(() => {
    if (!width || !imagesReady) return { grid: [] as GridItem[], containerHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const gap = width < 640 ? 14 : 24;
    const columnWidth = (width - (columns - 1) * gap) / columns;
    const minRatio = 0.72;
    const maxRatio = width < 640 ? 1.15 : 1.35;

    const gridItems = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const natural = ratios[child.id] ?? child.height / 400;
      const capped = natural > maxRatio || natural < minRatio;
      const ratio = Math.min(Math.max(natural, minRatio), maxRatio);
      const height = columnWidth * ratio;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height, ratio: natural, capped };
    });

    return { grid: gridItems, containerHeight: Math.max(...colHeights, 0) };
  }, [columns, imagesReady, items, ratios, width]);

  useLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;

    grid.forEach((item, index) => {
      const element = containerRef.current?.querySelector(`[data-key="${item.id}"]`);
      if (!element) return;

      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          element,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(20px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 1.2,
            ease: "power3.out",
            delay: index * stagger,
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

    if (grid.length > 0) hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

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
      style={{ height: containerHeight || undefined, minHeight: imagesReady ? undefined : "320px" }}
    >
      {grid.map((item) => (
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
          <div className="relative h-full w-full bg-[#0e0f0f]">
            <img
              src={item.img.startsWith("/api/media/") ? `${item.img}${item.img.includes("?") ? "&" : "?"}w=700` : item.img}
              alt={item.title || ""}
              className={cn(
                "h-full w-full transition-transform duration-500 group-hover:scale-[1.02]",
                item.capped ? "object-contain object-center" : "object-cover object-top",
              )}
              loading="lazy"
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
