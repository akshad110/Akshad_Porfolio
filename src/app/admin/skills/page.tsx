import Link from "next/link";
import { getAdminSkills } from "@/lib/content/admin-queries";
import { deleteSkill } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SkillForm } from "@/components/admin/SkillForm";
import { ManageChrome } from "@/components/admin/ManageChrome";
import { StatusPill } from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

function usedInLabel(skill: { usedInCount?: number; usedInSlugs?: unknown }) {
  const count =
    typeof skill.usedInCount === "number"
      ? skill.usedInCount
      : Array.isArray(skill.usedInSlugs)
        ? skill.usedInSlugs.length
        : 0;
  if (!count) return "";
  return ` · ${count >= 5 ? "5+" : count} project${count === 1 ? "" : "s"}`;
}

export default async function AdminSkillsPage() {
  const skills = await getAdminSkills();

  return (
    <ManageChrome title="Skills" subtitle="homepage logo row" count={skills.length} addLabel="Add skill" form={<SkillForm />}>
      {skills.length ? (
        <div className="admin-record-list">
          {skills.map((skill) => (
            <article key={String(skill._id)} className="admin-record">
              <div className="flex items-center gap-3">
                {skill.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(skill.icon)} alt="" className="h-12 w-12 rounded-xl object-contain" />
                ) : null}
                <div>
                  <p className="admin-record-title">{String(skill.name)}</p>
                  <p className="admin-record-meta">
                    {Number(skill.rating ?? (Number(skill.proficiency ?? 0) / 20)).toFixed(0)} / 5 stars
                    {usedInLabel(skill)}
                  </p>
                </div>
              </div>
              <StatusPill value={String(skill.status)} />
              <div className="admin-record-actions">
                <Link href={`/admin/skills/${String(skill._id)}`} className="admin-btn-ghost h-8 px-3 text-xs">
                  Edit
                </Link>
                <DeleteButton action={deleteSkill.bind(null, String(skill._id))} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty">No skills yet. Open the composer to add one.</p>
      )}
    </ManageChrome>
  );
}
