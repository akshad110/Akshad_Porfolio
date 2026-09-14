import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatProjectRange(start?: string, end?: string) {
  const from = formatDate(start);
  const to = formatDate(end);
  if (from && to) return `${from} — ${to}`;
  return from || to;
}

export function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isExternalUrl(value?: string) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

/** Resize Mongo-backed media on the fly for faster UI loads. */
export function optimizedMediaUrl(src?: string, width = 800) {
  if (!src) return src;
  if (!src.startsWith("/api/media/")) return src;
  const joiner = src.includes("?") ? "&" : "?";
  return `${src}${joiner}w=${width}`;
}
