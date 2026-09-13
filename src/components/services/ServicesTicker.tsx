"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Box, Code2, Layers, Lightbulb, Search, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SENTENCE =
  "In every project, discover the problem, design the interface, build the product, and ship experiences that last.";

export function ServicesTicker() {
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const endWord = () => track.querySelector<HTMLElement>("[data-ticker-end]");
    const distance = () => {
      const word = endWord();
      const rightPad = Math.min(72, window.innerWidth * 0.06);
      if (!word) return Math.max(0, track.scrollWidth - window.innerWidth + rightPad);
      return Math.max(0, word.offsetLeft + word.offsetWidth - window.innerWidth + rightPad);
    };

    const ctx = gsap.context(() => {
      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          scrub: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.96) return;
            gsap.set("[data-wave-char], [data-wave-mark]", {
              yPercent: 0,
              rotate: 0,
              opacity: 1,
              scale: 1,
            });
          },
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-wave-char]").forEach((char, index) => {
        const wave = Math.sin(index * 0.72);
        gsap.fromTo(
          char,
          {
            yPercent: 120 + wave * 55,
            rotate: wave * 14,
            opacity: 0,
          },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: char,
              containerAnimation: scrollTween,
              start: "left 100%",
              end: "left 84%",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-wave-mark]").forEach((mark, index) => {
        const wave = Math.sin(index * 1.1 + 0.4);
        gsap.fromTo(
          mark,
          {
            yPercent: 50 + wave * 30,
            scale: 0.72,
            rotate: wave * 18,
            opacity: 0,
          },
          {
            yPercent: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: mark,
              containerAnimation: scrollTween,
              start: "left 100%",
              end: "left 84%",
              scrub: true,
            },
          },
        );
      });
    }, pin);

    const refresh = () => ScrollTrigger.refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(track);
    requestAnimationFrame(refresh);

    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={pinRef}
      data-grid-ignore
      className="relative flex h-[32dvh] items-center overflow-hidden bg-background sm:h-[42dvh] md:h-[100dvh]"
    >
      <p className="sr-only">{SENTENCE}</p>
      <div
        ref={trackRef}
        className="font-heading flex w-max items-center whitespace-nowrap py-[0.12em] pl-[6vw] pr-[6vw] text-[clamp(1.85rem,9vw,9.5rem)] leading-[1.15] font-semibold tracking-[-0.04em] will-change-transform md:py-[0.2em] md:pl-[12vw]"
        aria-hidden
      >
        <Word gap="wide">In every</Word>
        <Word>project,</Word>

        <MarkCircle>
          <Search className="h-[46%] w-[46%]" strokeWidth={2.4} />
        </MarkCircle>
        <Word accent gap="tight">
          discover
        </Word>
        <MarkCircle>
          <Lightbulb className="h-[46%] w-[46%]" strokeWidth={2.4} />
        </MarkCircle>
        <Word gap="wide">the problem,</Word>
        <MarkCard>
          <ArrowRight className="h-[48%] w-[48%]" strokeWidth={2.2} />
        </MarkCard>

        <Word gap="tight">design</Word>
        <MarkCard>
          <Layers className="h-[48%] w-[48%]" strokeWidth={2.2} />
        </MarkCard>
        <Word gap="wide">the interface,</Word>

        <MarkCircle>
          <Code2 className="h-[46%] w-[46%]" strokeWidth={2.4} />
        </MarkCircle>
        <Word accent gap="tight">
          build
        </Word>
        <Word gap="wide">the product,</Word>

        <Word gap="snug">and</Word>
        <MarkCircle>
          <Box className="h-[46%] w-[46%]" strokeWidth={2.4} />
        </MarkCircle>
        <Word accent gap="tight">
          ship
        </Word>
        <MarkCard>
          <Sparkles className="h-[46%] w-[46%]" strokeWidth={2.2} />
        </MarkCard>
        <Word gap="snug">experiences that</Word>
        <Word endMark>last.</Word>
      </div>
    </section>
  );
}

function Word({
  children,
  accent,
  gap = "normal",
  endMark,
}: {
  children: string;
  accent?: boolean;
  gap?: "tight" | "snug" | "normal" | "wide";
  endMark?: boolean;
}) {
  const space = {
    tight: "mr-[0.18em]",
    snug: "mr-[0.45em]",
    normal: "mr-[0.32em]",
    wide: "mr-[0.7em]",
  }[gap];

  return (
    <span
      data-ticker-end={endMark ? "" : undefined}
      className={`${space} ${accent ? "text-accent-bright" : "text-foreground"}`}
    >
      {children.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="inline-block overflow-hidden pt-[0.12em] pb-[0.34em] align-bottom leading-none"
        >
          <span data-wave-char className="inline-block leading-none will-change-transform">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

function MarkCircle({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-wave-mark
      className="mx-[0.22em] inline-flex size-[0.72em] shrink-0 items-center justify-center rounded-full bg-accent-bright text-background will-change-transform"
    >
      {children}
    </span>
  );
}

function MarkCard({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-wave-mark
      className="mx-[0.28em] inline-flex size-[0.64em] shrink-0 items-center justify-center rounded-[0.14em] bg-foreground text-accent will-change-transform"
    >
      {children}
    </span>
  );
}
