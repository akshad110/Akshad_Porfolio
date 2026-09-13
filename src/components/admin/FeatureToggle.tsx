"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FEATURED_LIMIT, PROJECT_FEATURED_LIMIT } from "@/types";
import { setAchievementFeatured, setCertificationFeatured, setProjectFeatured } from "@/lib/actions/admin";

function FeaturedSwitch({
  featured,
  featuredCount,
  limit,
  onToggle,
}: {
  featured: boolean;
  featuredCount: number;
  limit: number;
  onToggle: (next: boolean) => Promise<unknown>;
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
          setPending(true);
          await onToggle(event.target.checked);
          setPending(false);
          router.refresh();
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
      featured={featured}
      featuredCount={featuredCount}
      limit={PROJECT_FEATURED_LIMIT}
      onToggle={(next) => setProjectFeatured(id, next)}
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
      featured={featured}
      featuredCount={featuredCount}
      limit={FEATURED_LIMIT}
      onToggle={(next) => setAchievementFeatured(id, next)}
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
      featured={featured}
      featuredCount={featuredCount}
      limit={FEATURED_LIMIT}
      onToggle={(next) => setCertificationFeatured(id, next)}
    />
  );
}
