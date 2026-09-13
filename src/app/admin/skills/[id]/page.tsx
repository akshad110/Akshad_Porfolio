import { notFound } from "next/navigation";
import { getAdminSkill } from "@/lib/content/admin-queries";
import { SkillForm } from "@/components/admin/SkillForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getAdminSkill(id);
  if (!skill) notFound();

  const rating = Number(skill.rating ?? (Number(skill.proficiency ?? 80) / 20));
  const storedCount = Number(skill.usedInCount);
  const usedInCount =
    Number.isFinite(storedCount) && storedCount > 0
      ? Math.min(5, storedCount)
      : Array.isArray(skill.usedInSlugs) && skill.usedInSlugs.length
        ? Math.min(5, skill.usedInSlugs.length)
        : 1;

  return (
    <div className="admin-manage">
      <AdminPageHeader title="Edit skill" subtitle={String(skill.name)} />
      <section className="admin-tile admin-tile-static max-w-xl p-4 md:p-5">
        <SkillForm
          key={id}
          id={id}
          defaults={{
            name: String(skill.name),
            slug: String(skill.slug),
            icon: skill.icon ? String(skill.icon) : undefined,
            rating: Math.max(1, Math.min(5, Math.round(rating))),
            usedInCount,
            category: String(skill.category ?? "Tools"),
            order: Number(skill.order ?? 0),
          }}
        />
      </section>
    </div>
  );
}
