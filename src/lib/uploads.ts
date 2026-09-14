import { connectDb } from "@/lib/db/connect";
import { MediaModel } from "@/models/Media";
import sharp from "sharp";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_BYTES = 6 * 1024 * 1024;

async function optimizeImage(file: File) {
  const input = Buffer.from(await file.arrayBuffer());
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return { buffer: input, contentType: file.type };
  }

  const buffer = await sharp(input)
    .rotate()
    .resize({
      width: 1400,
      height: 1400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 72, effort: 4 })
    .toBuffer();

  return { buffer, contentType: "image/webp" };
}

async function saveToMongo(file: File, folder: string) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Use JPG, PNG, WEBP, GIF, or SVG images.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Each image must be under 6MB.");
  }

  await connectDb();
  const { buffer, contentType } = await optimizeImage(file);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 40) || "image"}`;

  const doc = await MediaModel.create({
    folder,
    filename,
    contentType,
    size: buffer.byteLength,
    data: buffer,
  });

  return `/api/media/${doc._id}`;
}

export async function saveImageUpload(
  formData: FormData,
  field = "image",
  folder = "achievements",
  existing?: string,
) {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) return existing;
  return saveToMongo(file, folder);
}

export async function saveProjectUploads(formData: FormData, existing: string[] = []) {
  const images = Array.from({ length: 3 }, (_, index) => existing[index] ?? "");

  for (let index = 0; index < 3; index += 1) {
    const file = formData.get(`image${index}`);
    if (!(file instanceof File) || file.size === 0) continue;
    images[index] = await saveToMongo(file, "projects");
  }

  return images.filter(Boolean);
}
