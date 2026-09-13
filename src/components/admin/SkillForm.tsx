"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { USED_IN_COUNTS } from "@/types";
import { saveSkill } from "@/lib/actions/admin";

export function SkillForm({
  id,
  defaults,
}: {
  id?: string;
  defaults?: {
    name: string;
    slug?: string;
    icon?: string;
    rating?: number;
    usedInCount?: number;
    category?: string;
    order?: number;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(defaults?.icon);
  const [rating, setRating] = useState(defaults?.rating ?? 4);
  const [usedInCount, setUsedInCount] = useState(defaults?.usedInCount ?? 1);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");
    const result = await saveSkill(new FormData(form), id);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (id) {
      router.push("/admin/skills");
      router.refresh();
      return;
    }
    form.reset();
    setPreview(undefined);
    setRating(4);
    setUsedInCount(1);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-form">
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="usedInCount" value={usedInCount} />
      {defaults?.icon ? <input type="hidden" name="imageKeep" value={defaults.icon} /> : null}
      {defaults?.slug ? <input type="hidden" name="slug" value={defaults.slug} /> : null}
      {defaults?.category ? <input type="hidden" name="category" value={defaults.category} /> : null}
      <input type="hidden" name="order" value={defaults?.order ?? 0} />

      <label className="admin-upload">
        <span className="admin-label">Image</span>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="admin-upload-preview" />
        ) : (
          <span className="admin-upload-empty">Upload</span>
        )}
        <input
          type="file"
          name="image"
          required={!defaults?.icon}
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : defaults?.icon);
          }}
        />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Skill name</span>
        <input name="name" required defaultValue={defaults?.name} />
      </label>

      <div className="grid gap-1.5">
        <span className="admin-label">Rating</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="p-0.5"
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
              >
                <Star
                  className={`h-6 w-6 ${value <= rating ? "fill-[#22b3d7] text-[#22b3d7]" : "text-[#3a3d46]"}`}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-[#a6abb8]">{rating}/5</span>
        </div>
      </div>

      <label className="grid gap-1.5">
        <span className="admin-label">Used in projects</span>
        <select value={usedInCount} onChange={(event) => setUsedInCount(Number(event.target.value))}>
          {USED_IN_COUNTS.map((count) => (
            <option key={count} value={count}>
              {count === 5 ? "5+" : count}
            </option>
          ))}
        </select>
      </label>

      {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
      <button type="submit" disabled={saving} className="admin-btn-primary w-full">
        {saving ? "Saving..." : id ? "Update" : "Save"}
      </button>
    </form>
  );
}
