import { NextResponse } from "next/server";
import { tryConnectDb } from "@/lib/db/connect";
import { MediaModel } from "@/models/Media";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const db = await tryConnectDb();
  if (!db) return new NextResponse("Database unavailable", { status: 503 });

  const doc = await MediaModel.findById(id).lean();
  if (!doc?.data) return new NextResponse("Not found", { status: 404 });

  const raw = doc.data as unknown;
  let bytes: Buffer;
  if (Buffer.isBuffer(raw)) {
    bytes = raw;
  } else if (raw && typeof raw === "object" && "buffer" in (raw as object)) {
    bytes = Buffer.from((raw as { buffer: Uint8Array }).buffer);
  } else {
    bytes = Buffer.from(raw as Uint8Array);
  }
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": doc.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.byteLength),
    },
  });
}
