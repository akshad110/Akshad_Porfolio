import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_BYTES = 6 * 1024 * 1024;

function extFor(type: string) {
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  if (type === "image/gif") return ".gif";
  if (type === "image/svg+xml") return ".svg";
  return ".jpg";
}

export async function saveImageUpload(
  formData: FormData,
  field = "image",
  folder = "achievements",
  existing?: string,
) {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) return existing;
  if (!ALLOWED.has(file.type)) {
    throw new Error("Use JPG, PNG, WEBP, GIF, or SVG images.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Each image must be under 6MB.");
  }
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}${extFor(file.type)}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${name}`;
}

export async function saveProjectUploads(formData: FormData, existing: string[] = []) {
  const dir = path.join(process.cwd(), "public", "uploads", "projects");
  await mkdir(dir, { recursive: true });

  const images = Array.from({ length: 3 }, (_, index) => existing[index] ?? "");

  for (let index = 0; index < 3; index += 1) {
    const file = formData.get(`image${index}`);
    if (!(file instanceof File) || file.size === 0) continue;
    if (!ALLOWED.has(file.type)) {
      throw new Error("Use JPG, PNG, WEBP, GIF, or SVG images.");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Each image must be under 6MB.");
    }
    const name = `${Date.now()}-${index}${extFor(file.type)}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    images[index] = `/uploads/projects/${name}`;
  }

  return images.filter(Boolean);
}
