import { getAdminCertifications, getAdminStats } from "@/lib/content/admin-queries";
import { deleteCertification } from "@/lib/actions/admin";
import { CertificationForm } from "@/components/admin/CertificationForm";
import { CertificationFeatureToggle } from "@/components/admin/FeatureToggle";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ManageChrome } from "@/components/admin/ManageChrome";
import { StatusPill } from "@/components/admin/StatusPill";
import { FEATURED_LIMIT } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const [items, stats] = await Promise.all([getAdminCertifications(), getAdminStats()]);

  return (
    <ManageChrome
      title="Certifications"
      subtitle={`${stats.featuredCertifications}/${FEATURED_LIMIT} featured on homepage`}
      count={items.length}
      addLabel="Add certification"
      form={<CertificationForm featuredCount={stats.featuredCertifications} />}
    >
      {items.length ? (
        <div className="admin-record-list">
          {items.map((item) => (
            <article key={String(item._id)} className="admin-record">
              <div>
                <p className="admin-record-title">{String(item.title)}</p>
                <p className="admin-record-meta">
                  {item.description ? String(item.description).slice(0, 80) : "No description"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill value={String(item.status)} />
                <CertificationFeatureToggle
                  id={String(item._id)}
                  featured={Boolean(item.isFeatured)}
                  featuredCount={stats.featuredCertifications}
                />
              </div>
              <div className="admin-record-actions">
                <Link href={`/admin/certifications/${String(item._id)}`} className="admin-btn-ghost h-8 px-3 text-xs">
                  Edit
                </Link>
                <DeleteButton action={deleteCertification.bind(null, String(item._id))} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty">No certifications yet. Open the composer to add one.</p>
      )}
    </ManageChrome>
  );
}
