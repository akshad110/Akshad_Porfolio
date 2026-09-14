import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  setAchievementFeatured,
  setCertificationFeatured,
  setProjectFeatured,
} from "@/lib/actions/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type?: "project" | "achievement" | "certification";
      id?: string;
      featured?: boolean;
    };

    const id = String(body.id ?? "").trim();
    const featured = Boolean(body.featured);
    if (!id || !body.type) {
      return NextResponse.json({ error: "Missing type or id." }, { status: 400 });
    }

    let result: { ok?: boolean; error?: string };
    if (body.type === "project") result = await setProjectFeatured(id, featured);
    else if (body.type === "achievement") result = await setAchievementFeatured(id, featured);
    else result = await setCertificationFeatured(id, featured);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/featured]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update featured state." },
      { status: 500 },
    );
  }
}
