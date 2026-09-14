import { NextResponse } from "next/server";
import { tryConnectDb } from "@/lib/db/connect";
import { MediaModel } from "@/models/Media";
import { Types } from "mongoose";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function toBuffer(data: unknown): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data && typeof data === "object" && "buffer" in (data as object)) {
    return Buffer.from((data as { buffer: Uint8Array }).buffer);
  }
  return Buffer.from(data as Uint8Array);
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const db = await tryConnectDb();
  if (!db) return new NextResponse("Database unavailable", { status: 503 });

  const doc = await MediaModel.findById(id).lean();
  if (!doc?.data) return new NextResponse("Not found", { status: 404 });

  let bytes = toBuffer(doc.data);
  let contentType = doc.contentType || "application/octet-stream";

  const width = Number(new URL(request.url).searchParams.get("w") || 0);
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

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.byteLength),
    },
  });
}
