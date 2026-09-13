import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/schemas";
import { tryConnectDb } from "@/lib/db/connect";
import { MessageModel } from "@/models/Message";
import { sendContactEmail } from "@/lib/email/resend";

const hits = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || now - current.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message." },
      { status: 400 },
    );
  }

  try {
    await sendContactEmail(parsed.data);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unable to send email.";
    console.error("[contact] Resend failed:", detail);
    return NextResponse.json(
      {
        error: process.env.RESEND_API_KEY
          ? "Unable to deliver your message right now. Please try again or email me directly."
          : "Email delivery is not configured yet. Please email me directly.",
      },
      { status: 503 },
    );
  }

  const db = await tryConnectDb();
  if (db) {
    try {
      await MessageModel.create(parsed.data);
    } catch (error) {
      console.error("[contact] Saved email but failed to store message in Mongo:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
