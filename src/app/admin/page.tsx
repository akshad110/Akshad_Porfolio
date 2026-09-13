import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminPageHeader, BentoTile } from "@/components/admin/AdminPageHeader";
import {
  getAdminMessages,
  getAdminProjects,
  getAdminSkills,
  getAdminStats,
} from "@/lib/content/admin-queries";
import { tryConnectDb } from "@/lib/db/connect";

function relativeTime(value: Date) {
  const delta = Date.now() - value.getTime();
  const mins = Math.max(0, Math.round(delta / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function weekLabel(index: number, weeks = 5) {
  const date = new Date();
  date.setDate(date.getDate() - (weeks - 1 - index) * 7);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function bucketDates(dates: Date[], weeks = 5) {
  const week = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const buckets = Array.from({ length: weeks }, () => 0);
  for (const date of dates) {
    const i = Math.floor((now - date.getTime()) / week);
    if (i >= 0 && i < weeks) buckets[weeks - 1 - i] += 1;
  }
  return buckets;
}

function messageKind(status: string) {
  if (status === "REPLIED") return "upgrade" as const;
  if (status === "UNREAD") return "signup" as const;
  if (status === "ARCHIVED") return "downgrade" as const;
  return "workspace" as const;
}

export default async function AdminDashboardPage() {
  const db = await tryConnectDb();
  if (!db) {
    return (
      <>
        <AdminPageHeader title="Overview" subtitle="MongoDB is offline" />
        <BentoTile>
          <p className="max-w-xl text-sm leading-relaxed text-[#a6abb8]">
            Start MongoDB or run `docker compose up mongo`, then `npm run seed`. Public pages still use fallback seed
            content.
          </p>
        </BentoTile>
      </>
    );
  }

  const [stats, projects, skills, messages] = await Promise.all([
    getAdminStats(),
    getAdminProjects(),
    getAdminSkills(),
    getAdminMessages(),
  ]);

  const activityDates = [
    ...projects.map((item) => new Date(item.updatedAt as Date)),
    ...messages.map((item) => new Date(item.createdAt as Date)),
  ];
  const series = bucketDates(activityDates);
  const labels = series.map((_, index) => weekLabel(index));
  const skillSpark = skills.slice(0, 12).map((item) => Number(item.proficiency ?? 50));
  const certBars = [stats.certifications, stats.achievements, stats.skills, stats.projects, stats.testimonials, stats.messages, stats.featuredProjects];

  const activity = messages.slice(0, 6).map((item) => ({
    id: String(item._id),
    name: String(item.name),
    title: String(item.subject),
    time: relativeTime(new Date(item.createdAt as Date)),
    kind: messageKind(String(item.status)),
  }));

  const rows = projects.slice(0, 5).map((item) => ({
    id: String(item._id),
    title: String(item.title),
    slug: String(item.slug),
    views: String(item.status),
    conv: item.isFeatured ? "feat" : "std",
    rising: String(item.status) === "PUBLISHED",
  }));

  return (
    <AdminDashboard
      stats={stats}
      series={series}
      labels={labels}
      skillSpark={skillSpark}
      certBars={certBars}
      activity={activity}
      projects={rows}
    />
  );
}
