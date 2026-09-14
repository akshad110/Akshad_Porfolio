"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FEATURED_LIMIT, PROJECT_FEATURED_LIMIT } from "@/types";

function FeaturedSwitch({
  featured,
  featuredCount,
  limit,
  type,
  id,
}: {
  featured: boolean;
  featuredCount: number;
  limit: number;
  type: "project" | "achievement" | "certification";
  id: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const locked = featuredCount >= limit && !featured;

  return (
    <label className={`inline-flex items-center gap-2 text-xs ${locked ? "text-[#6b7180]" : "text-[#a6abb8]"}`}>
      <input
        type="checkbox"
        checked={featured}
        disabled={pending || locked}
        onChange={async (event) => {
          const next = event.target.checked;
          setPending(true);
          try {
            const response = await fetch("/api/admin/featured", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type, id, featured: next }),
            });
            const payload = (await response.json().catch(() => ({}))) as { error?: string };
            if (!response.ok) {
              event.target.checked = !next;
              window.alert(payload.error ?? "Could not update. Sign in again and retry.");
              return;
            }
            router.refresh();
          } catch {
            event.target.checked = !next;
            window.alert("Could not update. Check your connection and try again.");
          } finally {
            setPending(false);
          }
        }}
      />
      {featured ? "Featured" : locked ? "Limit reached" : "Feature"}
    </label>
  );
}

export function FeatureToggle({
  id,
  featured,
  featuredCount,
}: {
  id: string;
  featured: boolean;
  featuredCount: number;
}) {
  return (
    <FeaturedSwitch
      id={id}
      featured={featured}
      featuredCount={featuredCount}
      limit={PROJECT_FEATURED_LIMIT}
      type="project"
    />
  );
}

export function AchievementFeatureToggle({
  id,
  featured,
  featuredCount,
}: {
  id: string;
  featured: boolean;
  featuredCount: number;
}) {
  return (
    <FeaturedSwitch
      id={id}
      featured={featured}
      featuredCount={featuredCount}
      limit={FEATURED_LIMIT}
      type="achievement"
    />
  );
}

export function CertificationFeatureToggle({
  id,
  featured,
  featuredCount,
}: {
  id: string;
  featured: boolean;
  featuredCount: number;
}) {
  return (
    <FeaturedSwitch
      id={id}
      featured={featured}
      featuredCount={featuredCount}
      limit={FEATURED_LIMIT}
      type="certification"
    />
  );
}
