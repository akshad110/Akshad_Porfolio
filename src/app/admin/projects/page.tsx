import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProjects, getAdminStats } from "@/lib/content/admin-queries";
import { deleteProject } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { FeatureToggle } from "@/components/admin/FeatureToggle";
import { StatusPill } from "@/components/admin/StatusPill";
import { PROJECT_FEATURED_LIMIT } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [projects, stats] = await Promise.all([getAdminProjects(), getAdminStats()]);

  return (
    <div className="admin-manage">
      <AdminPageHeader
        title="Projects"
        subtitle={`${projects.length} records · ${stats.featuredProjects}/${PROJECT_FEATURED_LIMIT} featured`}
      >
        <Link href="/admin/projects/new" className="admin-btn-primary">
          <Plus className="size-3.5" />
          Add project
        </Link>
      </AdminPageHeader>
      <section className="admin-tile admin-tile-static p-4 md:p-5">
        {projects.length ? (
          <div className="admin-record-list">
            {projects.map((project) => (
              <article key={String(project._id)} className="admin-record">
                <div>
                  <p className="admin-record-title">{String(project.title)}</p>
                  <p className="admin-record-meta">/{String(project.slug)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill value={String(project.status)} />
                  <FeatureToggle
                    id={String(project._id)}
                    featured={Boolean(project.isFeatured)}
                    featuredCount={stats.featuredProjects}
                  />
                </div>
                <div className="admin-record-actions">
                  <Link href={`/admin/projects/${String(project._id)}`} className="admin-btn-ghost h-8 px-3 text-xs">
                    Edit
                  </Link>
                  <Link href={`/projects/${String(project.slug)}`} target="_blank" className="admin-btn-ghost h-8 px-3 text-xs">
                    View
                  </Link>
                  <DeleteButton action={deleteProject.bind(null, String(project._id))} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-empty">No projects yet. Add the first case study.</p>
        )}
      </section>
    </div>
  );
}
