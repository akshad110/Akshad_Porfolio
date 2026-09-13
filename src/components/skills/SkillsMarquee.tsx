"use client";

import { useMemo, useState } from "react";
import type { Skill } from "@/types";

export function SkillsMarquee({ skills }: { skills: Skill[] }) {
  const [active, setActive] = useState<Skill | null>(null);
  const rows = useMemo(() => {
    const midpoint = Math.ceil(skills.length / 2);
    return [skills.slice(0, midpoint), skills.slice(midpoint)];
  }, [skills]);

  if (!skills.length) return null;

  return (
    <div>
      <div className="overflow-hidden border-y border-border py-6">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`flex w-max gap-10 py-3 ${index === 1 ? "marquee-reverse" : "marquee"}`}
          >
            {[...row, ...row].map((skill, skillIndex) => (
              <button
                key={`${skill.id}-${skillIndex}`}
                type="button"
                data-cursor="interactive"
                onClick={() => setActive(skill)}
                className="font-heading text-4xl tracking-tight text-foreground/80 uppercase transition-colors hover:text-accent-hover md:text-6xl"
              >
                {skill.name}
              </button>
            ))}
          </div>
        ))}
      </div>
      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-title"
            className="w-full max-w-md rounded-lg border border-border bg-background-secondary p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="section-kicker">{active.category}</p>
            <h3 id="skill-title" className="font-heading mt-2 text-3xl">
              {active.name}
            </h3>
            <p className="mt-4 text-sm tracking-widest text-muted uppercase">Proficiency</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-accent-bright" style={{ width: `${active.proficiency}%` }} />
            </div>
            {active.usedInCount ? (
              <p className="mt-5 text-foreground-secondary">
                Used in {active.usedInCount >= 5 ? "5+" : active.usedInCount} project
                {active.usedInCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
