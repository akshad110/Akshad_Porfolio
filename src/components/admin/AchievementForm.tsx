"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FEATURED_LIMIT } from "@/types";
import { saveAchievement } from "@/lib/actions/admin";

export function AchievementForm({ featuredCount = 0 }: { featuredCount?: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [preview, setPreview] = useState<string>();
  const atLimit = featuredCount >= FEATURED_LIMIT;
  const liveCount = featured ? featuredCount + 1 : featuredCount;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");
    const result = await saveAchievement(new FormData(form));
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
    setFeatured(false);
    setPreview(undefined);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-form">
      <label className="grid gap-1.5">
        <span className="admin-label">Achievement name</span>
        <input name="title" required />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Date</span>
        <input type="date" name="date" />
      </label>

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
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : undefined);
          }}
        />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Description</span>
        <textarea name="description" required />
      </label>

      <label className={`flex items-center gap-3 text-sm ${atLimit ? "text-[#6b7180]" : "text-[#a6abb8]"}`}>
        <input
          type="checkbox"
          name="isFeatured"
          checked={featured}
          disabled={atLimit}
          onChange={(event) => setFeatured(event.target.checked)}
        />
        Feature on homepage ({Math.min(liveCount, FEATURED_LIMIT)}/{FEATURED_LIMIT})
        {atLimit ? " — uncheck another achievement first" : null}
      </label>

      {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
      <button type="submit" disabled={saving} className="admin-btn-primary w-full">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
