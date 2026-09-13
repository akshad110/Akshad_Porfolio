import { getAdminTestimonials } from "@/lib/content/admin-queries";
import { deleteTestimonial } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { ManageChrome } from "@/components/admin/ManageChrome";
import { StatusPill } from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await getAdminTestimonials();

  return (
    <ManageChrome
      title="Testimonials"
      subtitle="homepage quotes"
      count={items.length}
      addLabel="Add testimonial"
      form={<TestimonialForm />}
    >
      {items.length ? (
        <div className="admin-record-list">
          {items.map((item) => (
            <article key={String(item._id)} className="admin-record">
              <div>
                <p className="admin-record-title">{String(item.name)}</p>
                <p className="admin-record-meta">
                  {String(item.role)} · order {String(item.order ?? 0)}
                </p>
              </div>
              <StatusPill value={String(item.status)} />
              <div className="admin-record-actions">
                <DeleteButton action={deleteTestimonial.bind(null, String(item._id))} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty">No saved testimonials yet. Homepage still uses the fallback quotes.</p>
      )}
    </ManageChrome>
  );
}
