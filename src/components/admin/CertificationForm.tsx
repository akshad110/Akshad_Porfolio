"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FEATURED_LIMIT } from "@/types";
import { saveCertification } from "@/lib/actions/admin";

export function CertificationForm({ featuredCount = 0 }: { featuredCount?: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string>();
  const atLimit = featuredCount >= FEATURED_LIMIT;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");
    const result = await saveCertification(new FormData(form));
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
    setPreview(undefined);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-form">
      <label className="grid gap-1.5">
        <span className="admin-label">Title</span>
        <input name="title" required />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Description</span>
        <textarea name="description" required />
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
          required
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : undefined);
          }}
        />
      </label>

      <p className="text-sm text-[#6b7180]">
        Saved items appear on the homepage Featured Certifications section ({featuredCount}/{FEATURED_LIMIT}).
        {atLimit ? " Unfeature another certification first." : null}
      </p>

      {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
      <button type="submit" disabled={saving || atLimit} className="admin-btn-primary w-full">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
