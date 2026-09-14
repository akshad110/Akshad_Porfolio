"use client";

import { useState } from "react";
import { FEATURED_LIMIT } from "@/types";

type CertificationDefaults = {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
};

export function CertificationForm({
  featuredCount = 0,
  defaults,
}: {
  featuredCount?: number;
  defaults?: CertificationDefaults;
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(defaults?.image);
  const editing = Boolean(defaults?.id);
  const atLimit = featuredCount >= FEATURED_LIMIT && !defaults?.isFeatured;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData(form);
      if (defaults?.id) formData.set("id", defaults.id);

      const response = await fetch("/api/admin/certifications", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? `Save failed (${response.status}). Sign in again and retry.`);
        return;
      }

      // Full navigation avoids noisy failed RSC refresh/prefetch on Render.
      window.location.assign("/admin/certifications");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-form">
      {defaults?.image ? <input type="hidden" name="imageKeep" value={defaults.image} /> : null}

      <label className="grid gap-1.5">
        <span className="admin-label">Title</span>
        <input name="title" required defaultValue={defaults?.title ?? ""} />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Description</span>
        <textarea name="description" required defaultValue={defaults?.description ?? ""} />
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
          required={!defaults?.image}
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : defaults?.image);
          }}
        />
      </label>

      <p className="text-sm text-[#6b7180]">
        Saved items appear on the homepage Featured Certifications section ({featuredCount}/{FEATURED_LIMIT}).
        {atLimit ? " Unfeature another certification first." : null}
      </p>

      {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
      <button type="submit" disabled={saving || (atLimit && !editing)} className="admin-btn-primary w-full">
        {saving ? "Saving..." : editing ? "Update" : "Save"}
      </button>
    </form>
  );
}
