import { NextResponse } from "next/server";
import { getNotices } from "@/lib/firestore-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const notices = await getNotices();
    return NextResponse.json({ ok: true, notices });
  } catch (err) {
    console.error("[/api/notices] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load notices.", notices: [] },
      { status: 500 }
    );
  }
}
