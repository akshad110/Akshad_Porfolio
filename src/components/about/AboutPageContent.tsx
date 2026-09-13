"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Code2, Github, Linkedin } from "lucide-react";
import { aboutCopy, processSteps, services, site } from "@/data/site";
import { LineReveal, RevealBlock, WordReveal } from "@/components/about/AboutReveal";
import { AboutPortrait } from "@/components/about/AboutPortrait";
import { AboutTilt } from "@/components/about/AboutTilt";
import { CountUp } from "@/components/animations/CountUp";

const [INTRO_LEAD, INTRO_MUTED] = aboutCopy.intro.split(/(?<=\.)\s+/);

const PILL_STYLES = [
  "bg-background-secondary text-foreground",
  "bg-linear-to-br from-accent-hover to-accent text-background",
  "bg-foreground text-background",
  "bg-white/8 text-white/35",
] as const;

export function AboutPageContent() {
  const pathname = usePathname();

  return (
    <div key={pathname} className="overflow-x-hidden pt-20">
      <section className="flex justify-center px-4 pt-8 pb-8 sm:px-8 sm:pt-12 sm:pb-10">
        <h1 className="sr-only">{site.name}</h1>
        <AboutPortrait />
      </section>

      <section id="about" className="bg-background">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-12 sm:gap-6 sm:px-8 sm:py-16 lg:px-10">
          <WordReveal
            lead={INTRO_LEAD ?? aboutCopy.intro}
            muted={INTRO_MUTED ?? ""}
            className="font-heading text-base leading-[1.7] font-normal tracking-normal text-foreground-secondary sm:text-lg md:text-xl md:leading-[1.75]"
          />
          <RevealBlock>
            <p className="font-heading max-w-2xl text-sm leading-[1.75] font-normal text-muted sm:text-base sm:leading-[1.8]">{aboutCopy.dsa}</p>
          </RevealBlock>
          <RevealBlock delay={200} className="flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm text-white/45">Find me online</p>
              <div className="mt-3 flex gap-2">
                <SocialChip href={site.github} label="GitHub">
                  <Github className="h-4 w-4" />
                </SocialChip>
                <SocialChip href={site.linkedin} label="LinkedIn" accent>
                  <Linkedin className="h-4 w-4" />
                </SocialChip>
                <SocialChip href={site.leetcode} label="LeetCode">
                  <Code2 className="h-4 w-4" />
                </SocialChip>
              </div>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 py-1.5 pr-1.5 pl-4 text-xs break-all sm:gap-3 sm:pl-6 sm:text-sm"
            >
              <span className="min-w-0 flex-1">{site.email}</span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </RevealBlock>
        </div>
      </section>

      <section className="bg-background">
        <ul className="mx-auto flex max-w-4xl flex-col gap-2 px-5 py-6 sm:flex-row sm:gap-3 sm:px-8 lg:px-10">
          {processSteps.map((step, index) => (
            <RevealBlock key={step.title} as="li" delay={index * 120} className="flex-1">
              <AboutTilt max={8}>
                <div
                  title={step.text}
                  className={`grid h-12 place-items-center rounded-full text-sm font-medium sm:h-16 sm:text-lg ${PILL_STYLES[index]}`}
                >
                  {index === 2 ? (
                    <span className="inline-flex items-center gap-1.5">
                      {step.title}
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                  ) : (
                    step.title
                  )}
                </div>
              </AboutTilt>
            </RevealBlock>
          ))}
        </ul>
      </section>

      <section id="services" className="bg-background px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[88rem]">
          <RevealBlock>
            <p className="inline-flex items-center gap-2 text-sm text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Services
            </p>
          </RevealBlock>
          <LineReveal
            lines={["What I can build for you"]}
            delay={80}
            className="font-heading mt-4 mb-8 max-w-[16ch] text-[clamp(1.6rem,6vw,3rem)] font-semibold tracking-tight sm:mt-5 sm:mb-12"
          />
          <ul>
            {services.map((service, index) => (
              <RevealBlock key={service.title} as="li" delay={index * 80} className="border-t border-white/10 first:border-t-0">
                <a
                  href="/services"
                  className="group flex items-center gap-3 rounded-[1.25rem] px-3 py-5 transition-all duration-300 hover:bg-background-secondary hover:px-6 sm:gap-6 sm:px-6 sm:py-8"
                >
                  <span className="w-7 text-sm text-white/40 sm:w-10">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-heading min-w-0 flex-1 text-lg font-medium tracking-tight break-words sm:text-2xl md:text-3xl">{service.title}</h3>
                  <p className="hidden max-w-xs text-sm text-white/55 lg:block">{service.description}</p>
                  <span className="grid size-10 place-items-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:translate-x-1 sm:size-12">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </RevealBlock>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background px-4 pb-16 sm:px-8 lg:px-10 lg:pb-28">
        <RevealBlock className="mx-auto max-w-[88rem] rounded-[1.5rem] bg-[#0a0a0a] px-5 py-10 text-white sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-16">
          <p className="inline-flex items-center gap-2 text-sm text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            1.5+ years · 10+ projects · 650+ LeetCode
          </p>
          <LineReveal
            lines={[site.tagline]}
            delay={80}
            className="font-heading mt-4 max-w-[20ch] text-[clamp(1.5rem,5.5vw,2.5rem)] font-medium tracking-tight"
          />
          <dl className="mt-10 grid grid-cols-1 gap-8 sm:mt-14 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12">
            <div>
              <dd className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                <CountUp to={1.5} decimals={1} />
              </dd>
              <dt className="mt-3 text-sm text-white/55">Years freelance</dt>
            </div>
            <div>
              <dd className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                <CountUp to={10} />
              </dd>
              <dt className="mt-3 text-sm text-white/55">Client projects</dt>
            </div>
            <div>
              <dd className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                <CountUp to={650} />
              </dd>
              <dt className="mt-3 text-sm text-white/55">LeetCode problems</dt>
            </div>
          </dl>
        </RevealBlock>
      </section>

    </div>
  );
}

function SocialChip({
  href,
  label,
  children,
  accent,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`grid size-9 place-items-center rounded-full transition-transform duration-300 hover:scale-110 ${
        accent ? "bg-accent text-background" : "bg-background-secondary text-white/70"
      }`}
    >
      {children}
    </a>
  );
}
