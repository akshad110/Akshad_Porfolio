"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid credentials.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <form onSubmit={onSubmit} className="admin-tile w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="admin-logo" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 10.5 6.2 7.2 8.4 9.4 13 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="13" cy="4.5" r="1.3" fill="white" />
            </svg>
          </span>
          <span className="admin-heading text-lg">Studio</span>
        </div>
        <p className="admin-eyebrow">Admin</p>
        <h1 className="admin-heading mt-2 text-4xl">Sign in</h1>
        <label className="mt-8 grid gap-2">
          <span className="admin-label">Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="mt-4 grid gap-2">
          <span className="admin-label">Password</span>
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {error ? <p className="mt-4 text-sm text-[#fb7185]">{error}</p> : null}
        <button type="submit" disabled={loading} className="admin-btn-primary mt-6 w-full">
          {loading ? "Signing in..." : "Enter console"}
        </button>
      </form>
    </div>
  );
}
