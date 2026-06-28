import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const entries = await db.timetable.findMany({ orderBy: { day: "asc" } });
    return NextResponse.json({ ok: true, entries });
  } catch (error) {
    console.error("Failed to fetch timetable:", error);
    return NextResponse.json({ ok: false, entries: [], error: "Failed to fetch timetable" }, { status: 500 });
  }
}
