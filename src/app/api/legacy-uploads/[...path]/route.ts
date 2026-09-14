import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ path: string[] }> };

function contentTypeFromExt(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "image/jpeg";
}

/** Serves legacy `/uploads/...` files from disk when still present. */
export async function GET(_request: Request, { params }: Params) {
  const { path: parts } = await params;
  const relative = path.join("uploads", ...parts);
  if (relative.includes("..")) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", relative);
  try {
    const bytes = await readFile(filePath);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": contentTypeFromExt(filePath),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Missing upload — re-upload in admin (images now persist in MongoDB).", {
      status: 404,
    });
  }
}
