import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminStats } from "@/lib/content/admin-queries";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const stats = await getAdminStats();
  return (
    <div className="admin-manage">
      <AdminPageHeader title="Add project" subtitle={`${stats.featuredProjects}/5 featured on homepage`} />
      <ProjectEditor featuredCount={stats.featuredProjects} />
    </div>
  );
}
