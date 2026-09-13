"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveTestimonial } from "@/lib/actions/admin";

export function TestimonialForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");
    const result = await saveTestimonial(new FormData(form));
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-form">
      <label className="grid gap-1.5">
        <span className="admin-label">Name</span>
        <input name="name" required />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Role</span>
        <input name="role" required />
      </label>

      <label className="grid gap-1.5">
        <span className="admin-label">Quote</span>
        <textarea name="quote" required />
      </label>

      {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
      <button type="submit" disabled={saving} className="admin-btn-primary w-full">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
