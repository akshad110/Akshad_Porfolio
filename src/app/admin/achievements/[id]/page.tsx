import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAchievement, getAdminStats } from "@/lib/content/admin-queries";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, stats] = await Promise.all([getAdminAchievement(id), getAdminStats()]);
  if (!item) notFound();

  return (
    <div className="admin-manage">
      <AdminPageHeader title="Edit achievement" subtitle={String(item.title)}>
        <Link href="/admin/achievements" className="admin-btn-ghost h-9 px-3 text-xs">
          Back
        </Link>
      </AdminPageHeader>
      <section className="admin-tile admin-tile-static max-w-xl p-4 md:p-5">
        <AchievementForm
          featuredCount={stats.featuredAchievements}
          defaults={{
            id: String(item._id),
            title: String(item.title),
            date: item.date ? String(item.date) : undefined,
            description: String(item.description ?? ""),
            image: item.image ? String(item.image) : undefined,
            isFeatured: Boolean(item.isFeatured),
          }}
        />
      </section>
    </div>
  );
}
