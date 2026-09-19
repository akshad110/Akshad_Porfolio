"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { ProjectModal } from "@/components/projects/ProjectModal";

const SPEED_PX_PER_SEC = 50;
const GAP_PX = 24;
const DRAG_THRESHOLD = 8;

function mediaSrc(src: string, width = 800) {
  if (src.startsWith("/api/media/")) {
    const joiner = src.includes("?") ? "&" : "?";
    return `${src}${joiner}w=${width}`;
  }
  return src;
}

function screenshotSrc(url: string) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800`;
}

function wrapOffset(value: number, loop: number) {
  if (loop <= 0) return value;
  let next = value % loop;
  if (next > 0) next -= loop;
  if (next <= -loop) next += loop;
  return next;
}

export function PortfolioSlider({ projects }: { projects: Project[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const draggedRef = useRef(false);
  const pressedSlugRef = useRef<string | null>(null);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);

  const [active, setActive] = useState<Project | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedRef.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    pausedRef.current = Boolean(active);
  }, [active]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const firstSet = track?.firstElementChild as HTMLElement | null;
    if (!viewport || !track || !firstSet) return;

    const measure = () => {
      loopWidthRef.current = firstSet.offsetWidth;
      offsetRef.current = wrapOffset(offsetRef.current, loopWidthRef.current);
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(firstSet);

    let frame = 0;
    const tick = (now: number) => {
      if (!draggingRef.current && !pausedRef.current && !reducedRef.current) {
        const last = lastTimeRef.current ?? now;
        offsetRef.current -= SPEED_PX_PER_SEC * ((now - last) / 1000);
      }
      lastTimeRef.current = now;
      offsetRef.current = wrapOffset(offsetRef.current, loopWidthRef.current);
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      draggingRef.current = true;
      draggedRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartYRef.current = event.clientY;
      dragStartOffsetRef.current = offsetRef.current;
      lastTimeRef.current = null;
      const card = (event.target as HTMLElement | null)?.closest("[data-project-slug]");
      pressedSlugRef.current = card?.getAttribute("data-project-slug") ?? null;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = event.clientX - dragStartXRef.current;
      const dy = event.clientY - dragStartYRef.current;
      if (Math.abs(dx) <= DRAG_THRESHOLD && Math.abs(dy) <= DRAG_THRESHOLD) return;
      draggedRef.current = true;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (!viewport.hasPointerCapture(event.pointerId)) {
        viewport.setPointerCapture(event.pointerId);
        setGrabbing(true);
      }
      offsetRef.current = wrapOffset(dragStartOffsetRef.current + dx, loopWidthRef.current);
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const resetPress = () => {
      draggingRef.current = false;
      draggedRef.current = false;
      pressedSlugRef.current = null;
      lastTimeRef.current = null;
      setGrabbing(false);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = event.clientX - dragStartXRef.current;
      const dy = event.clientY - dragStartYRef.current;
      const slug = pressedSlugRef.current;
      const wasDrag = draggedRef.current || Math.hypot(dx, dy) > DRAG_THRESHOLD;
      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      resetPress();
      if (wasDrag || !slug) return;
      const project = projects.find((item) => item.slug === slug);
      if (project) setActive(project);
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      resetPress();
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerCancel);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [projects]);

  if (!projects.length) return null;

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative touch-pan-y overflow-hidden select-none",
        grabbing ? "cursor-grabbing" : "cursor-grab",
      )}
      data-grid-ignore
      aria-label="Featured projects"
    >
      <div ref={trackRef} className="flex w-max items-stretch will-change-transform">
        {[projects, projects].map((set, setIndex) => (
          <div
            key={setIndex}
            className="flex items-stretch"
            style={{ gap: GAP_PX, paddingRight: GAP_PX }}
          >
            {set.map((project, index) => (
              <SliderCard
                key={`${setIndex}-${project.id}-${index}`}
                project={project}
                eager={setIndex === 0}
              />
            ))}
          </div>
        ))}
      </div>
      {mounted && active ? <ProjectModal project={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}

function SliderCard({
  project,
  eager,
}: {
  project: Project;
  eager?: boolean;
}) {
  const [shotFailed, setShotFailed] = useState(false);
  const preview =
    (project.thumbnail ? mediaSrc(project.thumbnail, 800) : null) ||
    (project.liveLink && !shotFailed ? screenshotSrc(project.liveLink) : null);
  const [shotReady, setShotReady] = useState(Boolean(preview));

  return (
    <button
      type="button"
      data-cursor="interactive"
      data-project-slug={project.slug}
      aria-label={`View project ${project.title}`}
      className="group relative block h-[160px] w-[min(80vw,288px)] shrink-0 cursor-inherit text-left sm:h-[220px] sm:w-[352px] lg:h-[250px] lg:w-[400px]"
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-[16px] border border-white/20 p-2 sm:rounded-[20px] sm:p-2.5"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(117,117,117,0.1) 100%)",
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[#121416] sm:rounded-[12px]">
          <ProjectSiteMock project={project} />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              draggable={false}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={eager ? "high" : "auto"}
              sizes="(max-width: 640px) 80vw, 400px"
              onLoad={() => setShotReady(true)}
              onError={() => {
                setShotFailed(true);
                setShotReady(false);
              }}
              className={cn(
                "absolute inset-0 z-[1] h-full w-full object-cover object-top transition-opacity duration-200",
                shotReady ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null}
          <div className="absolute inset-0 z-[2] hidden items-center justify-center bg-[rgba(9,8,18,0.5)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex">
            <span className="rounded-full bg-[rgba(9,8,18,0.72)] px-4 py-2.5 font-heading text-[13px] tracking-[0.04em] text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              View Project →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProjectSiteMock({ project }: { project: Project }) {
  const theme = previewTheme(project.slug);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: theme.page, color: theme.text }}
      aria-hidden
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 text-[10px]"
        style={{ background: theme.nav }}
      >
        <span className="font-heading text-[11px] font-semibold tracking-wide">{project.title}</span>
        <div className="flex items-center gap-3 text-[8px] tracking-[0.14em] uppercase" style={{ color: theme.muted }}>
          {project.skills.slice(0, 2).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="grid h-[calc(100%-36px)] grid-cols-[1.1fr_0.9fr] gap-3 px-4 pt-4">
        <div className="flex flex-col justify-center">
          <p className="font-heading text-[9px] tracking-[0.18em] uppercase" style={{ color: theme.accent }}>
            {project.category}
          </p>
          <p className="font-heading mt-1.5 text-[20px] leading-[1.05] font-semibold tracking-tight">
            {project.title}
          </p>
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed" style={{ color: theme.muted }}>
            {project.shortDescription}
          </p>
        </div>

        <div
          className="self-center rounded-xl p-2.5"
          style={{ background: theme.panel, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {project.skills.slice(0, 4).map((skill, index) => (
              <div key={skill} className="rounded-lg px-2 py-2.5" style={{ background: theme.page }}>
                <p className="font-heading text-sm leading-none">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 truncate text-[9px]" style={{ color: theme.muted }}>
                  {skill}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function previewTheme(slug: string) {
  if (slug.includes("nexume")) {
    return {
      page: "#10261c",
      text: "#f4f7f5",
      muted: "#b7c7be",
      accent: "#3ecf8e",
      panel: "#163528",
      nav: "#0c1c15",
    };
  }
  if (slug.includes("alumn") || slug.includes("hive")) {
    return {
      page: "#f3f1ec",
      text: "#161616",
      muted: "#6b6b6b",
      accent: "#111111",
      panel: "#ffffff",
      nav: "#eceae4",
    };
  }
  if (slug.includes("tasneem") || slug.includes("mukhwas")) {
    return {
      page: "#f7f1ea",
      text: "#2a2118",
      muted: "#7a6a5a",
      accent: "#c45c26",
      panel: "#fffdfa",
      nav: "#fff8f1",
    };
  }
  return {
    page: "#141618",
    text: "#f8f8f8",
    muted: "#b4b7b9",
    accent: "#22b3d7",
    panel: "#1c1e1f",
    nav: "#0e0f0f",
  };
}
