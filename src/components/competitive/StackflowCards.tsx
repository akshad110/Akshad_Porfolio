"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { CompetitiveProfile } from "@/types";

const CARD_OFFSET = 36;

const PLATFORM_STATS: Record<
  string,
  { handle: string; rating: string; focus: string; accent: string; chart: string }
> = {
  codechef: {
    handle: "akshad_06",
    rating: "1589",
    focus: "Div 3 · 2★",
    accent: "#c47c4a",
    chart: "M4 48 C40 44 58 28 96 32 C134 36 156 18 216 14",
  },
  codeforces: {
    handle: "akshad_06",
    rating: "1132",
    focus: "Newbie",
    accent: "#3b82f6",
    chart: "M4 50 C36 40 70 52 104 24 C138 0 168 36 216 18",
  },
};

export function StackflowCards({ profiles }: { profiles: CompetitiveProfile[] }) {
  return (
    <div className="pointer-events-none relative md:-mb-[28vh]">
      <div className="flex flex-col gap-5 px-4 pb-6 md:hidden">
        {profiles.map((profile) => (
          <MobileProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
      <div className="hidden md:block">
        {profiles.map((profile, index) => (
          <ProfileCard key={profile.id} index={index} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function MobileProfileCard({ profile }: { profile: CompetitiveProfile }) {
  return (
    <article
      data-grid-ignore
      className="pointer-events-auto mx-auto flex w-full max-w-md flex-col rounded-2xl bg-[#30343f] p-4 shadow-2xl"
    >
      <h3 className="font-heading mb-2 text-center text-xl font-semibold text-[#f2f2f2]">
        {profile.platform}
      </h3>
      <CardCopy profile={profile} />
      <div className="relative mt-3 h-[160px] w-full overflow-hidden rounded-lg bg-[#111111]">
        <ProfileVisual profile={profile} />
      </div>
    </article>
  );
}

function ProfileCard({ index, profile }: { index: number; profile: CompetitiveProfile }) {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      className="pointer-events-none sticky top-0 flex h-[100dvh] items-start justify-center pt-24"
    >
      <motion.div
        data-grid-ignore
        className="pointer-events-auto relative flex w-[520px] max-w-[calc(100%-40px)] flex-col rounded-2xl bg-[#30343f] p-4 shadow-2xl md:p-6"
        style={{
          top: index * CARD_OFFSET,
          zIndex: index + 1,
        }}
      >
        <h3 className="font-heading mb-2 text-center text-xl font-semibold text-[#f2f2f2] md:text-2xl">
          {profile.platform}
        </h3>
        <CardCopy profile={profile} />
        <div className="relative mt-3 h-[200px] w-full overflow-hidden rounded-lg bg-[#111111] md:mt-4 md:h-[240px]">
          <ProfileVisual profile={profile} />
        </div>
      </motion.div>
    </div>
  );
}

function CardCopy({ profile }: { profile: CompetitiveProfile }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="max-w-[40ch] text-[13px] leading-relaxed text-[#cccccc]">
        {profile.description}
      </p>
      {profile.stats || profile.link ? (
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
          {profile.stats ? <span className="text-[#22b3d7]">{profile.stats}</span> : null}
          {profile.link ? (
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f2f2f2] underline decoration-white/35 underline-offset-4 transition-colors hover:text-[#22b3d7] hover:decoration-[#22b3d7]"
            >
              View profile
            </a>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

function ProfileVisual({ profile }: { profile: CompetitiveProfile }) {
  const isPhoto = /\.(png|jpe?g|webp)$/i.test(profile.image ?? "");

  if (isPhoto && profile.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={profile.image} alt={`${profile.platform} profile`} className="h-full w-full object-cover object-top" />
    );
  }

  return <PlatformDashboard platform={profile.platform} handle={profile.handle} stats={profile.stats} />;
}

function PlatformDashboard({
  platform,
  handle,
  stats,
}: {
  platform: string;
  handle?: string;
  stats?: string;
}) {
  const key = platform.toLowerCase().includes("chef")
    ? "codechef"
    : platform.toLowerCase().includes("force")
      ? "codeforces"
      : "";
  const data = key ? PLATFORM_STATS[key] : undefined;
  const displayHandle = handle || data?.handle || "profile";
  const rating = data?.rating || stats?.split("·")[0]?.trim() || "—";
  const focus = data?.focus || "Practice";
  const accent = data?.accent || "#22b3d7";
  const chart = data?.chart || "M4 48 C40 44 58 28 96 32 C134 36 156 18 216 14";

  return (
    <div className="flex h-full w-full flex-col bg-[#111111] p-3 text-left sm:p-4">
      <div className="flex items-center justify-between gap-2 text-[10px] tracking-wide text-white/45">
        <span className="font-heading text-[11px] text-white/80">{platform}</span>
        <span className="truncate">{key === "codechef" ? "Practice · Contests" : "Contests · Problemset"}</span>
      </div>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white/5 p-2.5">
          <p className="text-[11px] leading-snug text-white/80">{displayHandle}</p>
          <p className="mt-1 text-[10px] leading-snug text-white/35">Contest track</p>
        </div>
        <div className="rounded-lg bg-white/5 p-2.5">
          <p className="pb-0.5 text-[10px] leading-snug text-white/35">RATING</p>
          <p className="font-heading text-lg leading-none text-white">{rating}</p>
          <svg viewBox="0 0 220 64" className="mt-1.5 h-8 w-full" aria-hidden>
            <path d={chart} fill="none" stroke={accent} strokeWidth="3" />
          </svg>
        </div>
        <div className="rounded-lg bg-white/5 p-2.5">
          <p className="pb-0.5 text-[10px] leading-snug text-white/35">FOCUS</p>
          <p className="mt-1 font-heading text-base leading-snug text-white">{focus}</p>
        </div>
      </div>
    </div>
  );
}
