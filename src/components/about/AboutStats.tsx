"use client";

import { CountUp } from "@/components/animations/CountUp";

const stats = [
  { label: "Years freelance", to: 1.5, decimals: 1 },
  { label: "Client projects", to: 10, decimals: 0 },
  { label: "LeetCode problems", to: 650, decimals: 0 },
] as const;

export function AboutStats() {
  return (
    <dl className="grid gap-10 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="font-heading text-[11px] tracking-[0.2em] text-muted uppercase">{stat.label}</dt>
          <dd className="font-heading mt-3 text-5xl tracking-tight text-foreground md:text-6xl">
            <CountUp to={stat.to} decimals={stat.decimals} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
