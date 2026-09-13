"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Github, X } from "lucide-react";
import type { Project } from "@/types";
import { cn, formatProjectRange } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { lockPageScroll, unlockPageScroll } from "@/lib/page-scroll";

const GALLERY_CROPS = ["object-top", "object-center", "object-[20%_40%]"] as const;

function galleryFor(project: Project) {
  const unique = [project.thumbnail, ...project.images].filter(
    (src, index, list): src is string => Boolean(src) && list.indexOf(src) === index,
  );

  if (unique.length >= 2) return unique.slice(0, 3);
  if (unique.length === 1) return [unique[0], unique[0], unique[0]];
  return [];
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [githubNote, setGithubNote] = useState(false);
  const [expanded, setExpanded] = useState<{ src: string; crop: string; alt: string } | null>(null);
  const gallery = galleryFor(project);

  useEffect(() => {
    setMounted(true);
    lockPageScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (expanded) {
        setExpanded(null);
        return;
      }
      onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      unlockPageScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        data-grid-ignore
        className="relative flex max-h-[min(92dvh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-border bg-background-secondary shadow-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          data-cursor="interactive"
          aria-label="Close project"
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-accent-bright hover:text-accent-hover"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [-webkit-overflow-scrolling:touch] sm:px-8 sm:py-7">
          <div className="pr-12">
            <p className="section-kicker">{project.category}</p>
            <h3
              id="project-modal-title"
              className="font-heading mt-2 text-2xl leading-tight font-semibold tracking-tight break-words sm:text-3xl"
            >
              {project.title}
            </h3>
            {formatProjectRange(project.startDate, project.endDate) ? (
              <p className="mt-2 text-sm text-muted">{formatProjectRange(project.startDate, project.endDate)}</p>
            ) : null}
          </div>

          {gallery.length ? (
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {gallery.map((src, index) => {
                const crop = GALLERY_CROPS[index] ?? "object-cover";
                const alt = `${project.title} preview ${index + 1}`;
                return (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    data-cursor="interactive"
                    onClick={() => setExpanded({ src, crop, alt })}
                    className={cn(
                      "overflow-hidden rounded-xl border border-border bg-surface transition-transform hover:scale-[1.02]",
                      index === 2 && "col-span-2 sm:col-span-1",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className={cn("h-[88px] w-full object-cover sm:h-[110px]", crop)} />
                  </button>
                );
              })}
            </div>
          ) : null}

          {project.liveLink ? (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="mt-4 inline-flex items-center gap-2 font-heading text-sm tracking-[0.14em] text-accent-bright uppercase hover:text-accent-hover"
            >
              Preview
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}

          <p className="mt-4 text-[15px] leading-relaxed text-foreground-secondary">{project.description}</p>

          <div className="mt-5">
            <p className="section-kicker">Skills used</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground-secondary"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-center gap-3 pb-2">
            <Button type="button" variant="secondary" onClick={() => setGithubNote(true)}>
              <Github className="h-4 w-4" />
              GitHub
            </Button>
            {githubNote ? (
              <p className="text-sm text-accent-soft">Request access for the source code.</p>
            ) : null}
          </div>
        </div>
      </div>

      {expanded ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-5"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded(null);
          }}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(null);
            }}
            data-cursor="interactive"
            aria-label="Close image"
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-background text-foreground transition-colors hover:border-accent-bright hover:text-accent-hover"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={expanded.src}
            alt={expanded.alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[82vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
