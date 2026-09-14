import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCertification, getAdminStats } from "@/lib/content/admin-queries";
import { CertificationForm } from "@/components/admin/CertificationForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, stats] = await Promise.all([getAdminCertification(id), getAdminStats()]);
  if (!item) notFound();

  return (
    <div className="admin-manage">
      <AdminPageHeader title="Edit certification" subtitle={String(item.title)}>
        <Link href="/admin/certifications" className="admin-btn-ghost h-9 px-3 text-xs">
          Back
        </Link>
      </AdminPageHeader>
      <section className="admin-tile admin-tile-static max-w-xl p-4 md:p-5">
        <CertificationForm
          featuredCount={stats.featuredCertifications}
          defaults={{
            id: String(item._id),
            title: String(item.title),
            description: item.description ? String(item.description) : undefined,
            image: item.image ? String(item.image) : undefined,
            isFeatured: Boolean(item.isFeatured),
          }}
        />
      </section>
    </div>
  );
}
