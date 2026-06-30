import { NextResponse } from "next/server";
import { getTimetable } from "@/lib/site/seed-data";

export const runtime = "nodejs";

export async function GET() {
  try {
    const entries = await getTimetable();
    return NextResponse.json({ ok: true, entries });
  } catch (err) {
    console.error("[/api/timetable] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load timetable.", entries: [] },
      { status: 500 }
    );
  }
}
