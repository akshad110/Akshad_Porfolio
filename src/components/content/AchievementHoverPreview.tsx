"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Achievement } from "@/types";
import { cn, formatDate } from "@/lib/utils";

export function AchievementHoverPreview({ items }: { items: Achievement[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!items.length || !active) return null;

  return (
    <section id="achievements" className="section-space" data-grid-ignore>
      <div className="container-page">
        <p className="section-kicker mb-6 sm:mb-10">Recognition</p>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,440px)_minmax(0,1fr)] lg:gap-16">
          <PreviewCard item={active} />

          <div>
            <p className="max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg md:text-xl">
              Selected highlights from practice, client work, and products shipped. Hover a title to preview it.
            </p>

            <ul className="mt-6 sm:mt-10">
              {items.map((item) => {
                const activeRow = item.id === active.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveId(item.id)}
                      onFocus={() => setActiveId(item.id)}
                      className="group relative flex w-full items-center gap-3 border-b border-white/10 py-3.5 text-left sm:gap-4 sm:py-4 md:py-5"
                    >
                      <span
                        className={cn(
                          "font-heading shrink-0 text-[11px] transition-transform duration-300",
                          activeRow ? "rotate-45 text-foreground" : "text-transparent",
                        )}
                      >
                        <Plus className="h-5 w-5" />
                      </span>
                      <span
                        className={cn(
                          "font-heading min-w-0 flex-1 text-[clamp(1.35rem,5.5vw,4.5rem)] leading-[1.05] break-words tracking-tight transition-colors duration-300",
                          activeRow ? "text-foreground" : "text-white/25 group-hover:text-white/50",
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "absolute right-0 bottom-0 left-9 h-px origin-left bg-foreground transition-transform duration-500 sm:left-10",
                          activeRow ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ item }: { item: Achievement }) {
  return (
    <article className="overflow-hidden rounded-[22px] bg-[#1c1e1f] lg:sticky lg:top-28">
      <div className="aspect-[16/10] overflow-hidden bg-[#111111]">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-heading text-4xl text-white/20">
            {item.title}
          </div>
        )}
      </div>
      <div className="px-5 pt-4 pb-5">
        <h3 className="font-heading text-2xl text-foreground">{item.title}</h3>
        {item.date ? <p className="mt-1 text-xs tracking-wide text-muted">{formatDate(item.date)}</p> : null}
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </article>
  );
}
