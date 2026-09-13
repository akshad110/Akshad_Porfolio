"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROJECT_FEATURED_LIMIT } from "@/types";
import { saveProject } from "@/lib/actions/admin";

export type ProjectEditorValues = {
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  skills?: string;
  liveLink?: string;
  githubLink?: string;
  images?: string[];
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
};

export function ProjectEditor({
  id,
  defaults,
  featuredCount = 0,
}: {
  id?: string;
  defaults?: ProjectEditorValues;
  featuredCount?: number;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [featured, setFeatured] = useState(Boolean(defaults?.isFeatured));
  const initialImages = defaults?.images ?? [];
  const [previews, setPreviews] = useState<(string | undefined)[]>([
    initialImages[0],
    initialImages[1],
    initialImages[2],
  ]);

  const atLimit = featuredCount >= PROJECT_FEATURED_LIMIT && !defaults?.isFeatured;
  const liveCount = featured
    ? defaults?.isFeatured
      ? featuredCount
      : featuredCount + 1
    : defaults?.isFeatured
      ? Math.max(0, featuredCount - 1)
      : featuredCount;

  const slots = useMemo(() => [0, 1, 2], []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const result = await saveProject(new FormData(event.currentTarget), id);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-form mx-auto max-w-[820px]">
      {defaults?.slug ? <input type="hidden" name="slug" value={defaults.slug} /> : null}
      <input type="hidden" name="category" value={defaults?.category ?? "Other"} />

      <div className="admin-upload-grid">
        {slots.map((index) => (
          <label key={index} className="admin-upload">
            <span className="admin-label">Image {index + 1}</span>
            {previews[index] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previews[index]} alt="" className="admin-upload-preview" />
            ) : (
              <span className="admin-upload-empty">Upload</span>
            )}
            <input
              type="file"
              name={`image${index}`}
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPreviews((current) => {
                  const next = [...current];
                  next[index] = file ? URL.createObjectURL(file) : current[index];
                  return next;
                });
              }}
            />
            {initialImages[index] ? <input type="hidden" name={`imageKeep${index}`} value={initialImages[index]} /> : null}
          </label>
        ))}
      </div>

      <label className="grid gap-1.5">
        <span className="admin-label">Project name</span>
        <input name="title" defaultValue={defaults?.title} required />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Project description</span>
        <textarea name="description" rows={5} required defaultValue={defaults?.description} />
      </label>

      <div className="admin-form-grid">
        <label className="grid gap-1.5">
          <span className="admin-label">Start date</span>
          <input type="date" name="startDate" defaultValue={defaults?.startDate} />
        </label>
        <label className="grid gap-1.5">
          <span className="admin-label">End date</span>
          <input type="date" name="endDate" defaultValue={defaults?.endDate} />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="admin-label">Skills used</span>
        <input name="skills" defaultValue={defaults?.skills} required placeholder="React, Node.js, MongoDB" />
      </label>

      <div className="admin-form-grid">
        <label className="grid gap-1.5">
          <span className="admin-label">Live link</span>
          <input name="liveLink" type="url" defaultValue={defaults?.liveLink} placeholder="https://" />
        </label>
        <label className="grid gap-1.5">
          <span className="admin-label">GitHub link</span>
          <input name="githubLink" type="url" defaultValue={defaults?.githubLink} placeholder="https://github.com/..." />
          <span className="text-xs text-[#6b7180]">Visitors see “Request access for the source code”.</span>
        </label>
      </div>

      <label className={`flex items-center gap-3 text-sm ${atLimit ? "text-[#6b7180]" : "text-[#a6abb8]"}`}>
        <input
          type="checkbox"
          name="isFeatured"
          checked={featured}
          disabled={atLimit}
          onChange={(event) => setFeatured(event.target.checked)}
        />
        Feature on homepage ({liveCount}/{PROJECT_FEATURED_LIMIT})
        {atLimit ? " — uncheck another project first" : null}
      </label>

      {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? "Saving..." : id ? "Update project" : "Save project"}
        </button>
        <Link href="/admin/projects" className="admin-btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
