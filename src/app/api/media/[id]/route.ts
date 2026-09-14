import { NextResponse } from "next/server";
import { tryConnectDb } from "@/lib/db/connect";
import { MediaModel } from "@/models/Media";
import { Types } from "mongoose";
import sharp from "sharp";

export const runtime = "nodejs";
// Media IDs are immutable uploads — allow CDN/browser caching between visits.
export const revalidate = 86400;

type Params = { params: Promise<{ id: string }> };

type CacheEntry = { bytes: Buffer; contentType: string };

const resizeCache = new Map<string, CacheEntry>();
const RESIZE_CACHE_MAX = 64;

function toBuffer(data: unknown): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data && typeof data === "object" && "buffer" in (data as object)) {
    return Buffer.from((data as { buffer: Uint8Array }).buffer);
  }
  return Buffer.from(data as Uint8Array);
}

function remember(key: string, entry: CacheEntry) {
  if (resizeCache.has(key)) resizeCache.delete(key);
  resizeCache.set(key, entry);
  while (resizeCache.size > RESIZE_CACHE_MAX) {
    const oldest = resizeCache.keys().next().value;
    if (oldest == null) break;
    resizeCache.delete(oldest);
  }
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const width = Number(new URL(request.url).searchParams.get("w") || 0);
  const cacheKey = `${id}:${width > 0 && width <= 1600 ? width : 0}`;
  const cached = resizeCache.get(cacheKey);
  if (cached) {
    return new NextResponse(new Uint8Array(cached.bytes), {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(cached.bytes.byteLength),
        "X-Media-Cache": "HIT",
      },
    });
  }

  const db = await tryConnectDb();
  if (!db) return new NextResponse("Database unavailable", { status: 503 });

  const doc = await MediaModel.findById(id).lean();
  if (!doc?.data) return new NextResponse("Not found", { status: 404 });

  let bytes = toBuffer(doc.data);
  let contentType = doc.contentType || "application/octet-stream";

  if (width > 0 && width <= 1600 && !contentType.includes("svg")) {
    try {
      bytes = await sharp(bytes)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer();
      contentType = "image/webp";
    } catch {
      // Fall back to original bytes if transform fails.
    }
  }

  remember(cacheKey, { bytes, contentType });

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.byteLength),
      "X-Media-Cache": "MISS",
    },
  });
}
