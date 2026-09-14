"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

function useReplayReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const play = () => {
      el.classList.remove("is-in");
      void el.offsetWidth;
      requestAnimationFrame(() => {
        el.classList.add("is-in");
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else el.classList.remove("is-in");
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [ref]);
}

export function RevealBlock({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useReplayReveal(ref);

  return createElement(
    Tag,
    {
      ref,
      className: cn("about-reveal", className),
      style: { transitionDelay: `${delay}ms` },
    },
    children,
  );
}

export function LineReveal({
  lines,
  className,
  delay = 0,
  stagger = 120,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useReplayReveal(ref);

  return (
    <Tag ref={ref} className={cn("about-lines", className)}>
      {lines.map((line, index) => (
        <span key={line} className="about-line-clip">
          <span className="about-line-inner" style={{ transitionDelay: `${delay + index * stagger}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function WordReveal({
  lead,
  muted,
  className,
}: {
  lead: string;
  muted: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useReplayReveal(ref);

  const leadWords = lead.split(/\s+/).filter(Boolean);
  const mutedWords = muted.split(/\s+/).filter(Boolean);

  return (
    <p ref={ref} className={cn("about-words text-pretty", className)}>
      {leadWords.map((word, index) => (
        <span
          key={`l-${word}-${index}`}
          className={cn("about-word", /[.!?]$/.test(word) && "is-sentence-end")}
          style={{ transitionDelay: `${index * 35}ms` }}
        >
          {word}
        </span>
      ))}
      {mutedWords.map((word, index) => (
        <span
          key={`m-${word}-${index}`}
          className={cn("about-word text-muted", /[.!?]$/.test(word) && "is-sentence-end")}
          style={{ transitionDelay: `${(leadWords.length + index) * 35}ms` }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
