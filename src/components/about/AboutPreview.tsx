"use client";

import { aboutCopy, site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { CountUp } from "@/components/animations/CountUp";

const stats = [
  { label: "Freelance Experience", to: 1.5, decimals: 1 },
  { label: "Client Projects", to: 10, decimals: 0 },
  { label: "LeetCode Problems", to: 650, decimals: 0 },
] as const;

export function AboutPreview() {
  return (
    <section
      id="about"
      data-grid-ignore
      className="relative z-20 overflow-x-clip bg-background md:min-h-[100dvh] md:rounded-t-[28px] md:shadow-[0_-32px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="container-page flex flex-col justify-center py-16 md:min-h-[100dvh] md:py-28">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_220px_minmax(0,0.55fr)] lg:gap-8">
          <div>
            <Reveal>
              <h2 className="font-heading text-[clamp(2rem,8vw,4.5rem)] leading-tight font-semibold tracking-tight">
                About Me
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-3 text-base text-accent-bright sm:mt-4 sm:text-lg md:text-xl">
                Full Stack Developer shipping real products
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-foreground-secondary sm:mt-6 sm:text-base md:text-lg">
                {aboutCopy.intro}
              </p>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-6 sm:mt-8">
                <Button href="/about">Read More</Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.18} className="relative mx-auto w-full max-w-[180px] sm:max-w-[220px] lg:mx-0">
            <div className="overflow-hidden rounded-md border border-border bg-background-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.portrait}
                alt="Portrait of Akshad Vengurlekar"
                className="aspect-[4/5] h-full w-full object-cover object-top"
              />
            </div>
          </Reveal>
        </div>

        <dl className="mt-10 grid gap-4 border-t border-border pt-6 sm:mt-14 sm:grid-cols-3 sm:gap-5 sm:pt-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={0.08 * index}>
              <dt className="font-heading text-[10px] tracking-[0.2em] text-muted uppercase">
                {stat.label}
              </dt>
              <dd className="font-heading mt-1 text-xl font-semibold tracking-tight text-accent-bright md:text-2xl">
                <CountUp to={stat.to} decimals={stat.decimals} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
