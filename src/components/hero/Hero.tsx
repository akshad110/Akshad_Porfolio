"use client";

import { ArrowDown } from "lucide-react";
import { heroCopy, site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "@/components/hero/HeroVideo";

export function Hero() {
  return (
    <section id="hero" className="relative z-[1] w-full bg-background">
      <div data-scroll-pin className="relative min-h-[100dvh] w-full overflow-hidden">
        <HeroVideo src={site.heroVideo} poster={site.heroVideoPoster} />
        <div
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,rgba(14,15,15,0.72)_0%,rgba(14,15,15,0.28)_24%,transparent_50%)] md:block"
          aria-hidden="true"
        />
        <div className="container-page pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-center justify-start top-[calc(100vw*9/16)] pb-24 md:inset-0 md:top-0 md:pt-24 md:pb-32">
          <div className="pointer-events-auto w-full max-w-lg text-left">
            <p className="hero-copy section-kicker text-[0.8rem]">{heroCopy.greeting}</p>
            <h1 className="hero-copy hero-name font-heading mt-2 uppercase sm:mt-3">{heroCopy.name}</h1>
            <p className="hero-copy font-heading mt-2 text-xs tracking-[0.16em] text-accent-soft uppercase sm:mt-4 sm:text-sm md:text-base">
              {heroCopy.role}
            </p>
            <p className="hero-copy mt-2 max-w-md text-sm leading-relaxed text-foreground-secondary italic sm:mt-4 sm:text-base md:text-lg">
              {heroCopy.statement}
            </p>
            <p className="hero-copy font-display mt-2 text-lg text-accent-hover sm:mt-4 sm:text-xl md:text-2xl">
              {heroCopy.aside}
            </p>
            <div className="mt-5 flex flex-wrap justify-start gap-3 sm:mt-8">
              <Button href="/projects" className="px-4 py-2.5 text-xs">
                View My Work
              </Button>
              <Button href="/resume" variant="secondary" className="px-4 py-2.5 text-xs">
                My Resume
              </Button>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute right-3 bottom-[14%] z-[3] hidden h-24 w-28 items-end justify-center sm:flex md:right-[calc(3.7%-3px)] md:bottom-[7%] md:h-40 md:w-48"
          aria-hidden="true"
        >
          <span className="absolute bottom-[21%] h-10 w-10 rounded-full bg-[#1c1814] md:h-14 md:w-14" />
          <img
            src="/images/live-chatbot.svg"
            alt=""
            className="relative h-full w-full object-contain"
          />
        </div>
        <a
          href="/about"
          className="absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 text-muted sm:bottom-2"
          aria-label="Scroll to about"
        >
          <ArrowDown className="h-5 w-5 animate-bounce sm:h-6 sm:w-6" />
        </a>
      </div>
    </section>
  );
}
