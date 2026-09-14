import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveCertification } from "@/lib/actions/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = String(formData.get("id") ?? "").trim() || undefined;
    const result = await saveCertification(formData, id);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/certifications]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save certification." },
      { status: 500 },
    );
  }
}
