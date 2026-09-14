import { getAdminAchievements, getAdminStats } from "@/lib/content/admin-queries";
import { deleteAchievement } from "@/lib/actions/admin";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { AchievementFeatureToggle } from "@/components/admin/FeatureToggle";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ManageChrome } from "@/components/admin/ManageChrome";
import { StatusPill } from "@/components/admin/StatusPill";
import { FEATURED_LIMIT } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  const [items, stats] = await Promise.all([getAdminAchievements(), getAdminStats()]);

  return (
    <ManageChrome
      title="Achievements"
      subtitle={`${stats.featuredAchievements}/${FEATURED_LIMIT} featured on homepage`}
      count={items.length}
      addLabel="Add achievement"
      form={<AchievementForm featuredCount={stats.featuredAchievements} />}
    >
      {items.length ? (
        <div className="admin-record-list">
          {items.map((item) => (
            <article key={String(item._id)} className="admin-record">
              <div>
                <p className="admin-record-title">{String(item.title)}</p>
                <p className="admin-record-meta">{item.date ? String(item.date) : "No date"}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill value={String(item.status)} />
                <AchievementFeatureToggle
                  id={String(item._id)}
                  featured={Boolean(item.isFeatured)}
                  featuredCount={stats.featuredAchievements}
                />
                <Link
                  href={`/admin/achievements/${String(item._id)}`}
                  className="admin-btn-ghost h-8 px-3 text-xs font-semibold text-[#22b3d7]"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteAchievement.bind(null, String(item._id))} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty">No achievements yet. Open the composer to add one.</p>
      )}
    </ManageChrome>
  );
}
