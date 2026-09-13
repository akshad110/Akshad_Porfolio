"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { education } from "@/data/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/Reveal";

export function Education() {
  const [openId, setOpenId] = useState<string>(education[0]?.id ?? "");

  return (
    <section className="section-space">
      <div className="container-page">
        <div
          data-grid-ignore
          className="overflow-hidden rounded-[22px] border border-border bg-background-secondary px-4 py-8 sm:px-6 sm:py-10 md:rounded-[28px] md:px-10 md:py-14"
        >
          <Reveal>
            <div className="flex flex-col gap-5 border-b border-border pb-6 sm:gap-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker mb-3 flex items-center gap-2 sm:mb-4">
                  <span className="inline-block h-2 w-2 rounded-full border border-accent-bright" />
                  Path
                </p>
                <h2 className="font-heading text-[clamp(2rem,8vw,4.5rem)] font-semibold tracking-tight uppercase">
                  Education
                </h2>
              </div>
              <p className="max-w-xs text-left text-[11px] leading-relaxed tracking-[0.14em] text-muted uppercase md:text-right">
                A focused academic path in computer science, grounded in building software.
              </p>
            </div>
          </Reveal>

          <div>
            {education.map((item, index) => {
              const open = openId === item.id;
              const number = String(index + 1).padStart(2, "0");

              return (
                <article
                  key={item.id}
                  className="border-b border-border"
                  onMouseEnter={() => setOpenId(item.id)}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 py-5 text-left sm:gap-4 sm:py-6 md:gap-8 md:py-7"
                    onClick={() => setOpenId(item.id)}
                    onFocus={() => setOpenId(item.id)}
                    aria-expanded={open}
                  >
                    <span
                      className={cn(
                        "font-heading w-7 shrink-0 text-sm tracking-[0.18em] sm:w-8",
                        open ? "text-accent-bright" : "text-muted",
                      )}
                    >
                      {number}
                    </span>
                    <h3
                      className={cn(
                        "font-heading min-w-0 flex-1 text-lg tracking-tight break-words uppercase transition-colors duration-300 sm:text-2xl md:text-4xl",
                        open ? "text-foreground" : "text-muted",
                      )}
                    >
                      {item.title}
                    </h3>
                    {open ? (
                      <ArrowUp className="h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
                    ) : (
                      <ArrowDown className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                    )}
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-in-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-6 pl-0 sm:pb-8 sm:pl-12 md:max-w-3xl md:pl-16">
                        <p className="text-foreground-secondary">
                          {item.institution}
                          <span className="text-muted"> · {item.duration}</span>
                        </p>
                        <p className="mt-1 text-sm text-muted">{item.location}</p>
                        <p className="mt-4 leading-relaxed text-foreground-secondary">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
