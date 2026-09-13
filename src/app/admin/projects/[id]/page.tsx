import { notFound } from "next/navigation";
import { getAdminProject, getAdminStats } from "@/lib/content/admin-queries";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, stats] = await Promise.all([getAdminProject(id), getAdminStats()]);
  if (!project) notFound();

  return (
    <div className="admin-manage">
      <AdminPageHeader title="Edit project" subtitle={`${stats.featuredProjects}/5 featured on homepage`} />
      <ProjectEditor
        id={id}
        featuredCount={stats.featuredProjects}
        defaults={{
          title: String(project.title),
          slug: String(project.slug),
          category: String(project.category),
          description: String(project.description),
          skills: (project.skills as string[]).join(", "),
          liveLink: (project.liveLink as string | undefined) ?? "",
          githubLink: (project.githubLink as string | undefined) ?? "",
          images: (project.images as string[]) ?? [],
          startDate: (project.startDate as string | undefined) ?? "",
          endDate: (project.endDate as string | undefined) ?? "",
          isFeatured: Boolean(project.isFeatured),
        }}
      />
    </div>
  );
}
