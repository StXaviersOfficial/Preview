import { NextResponse } from "next/server";
import { getTimetable } from "@/lib/firestore-db";

export const runtime = "nodejs";

// Cache timetable for 5 minutes on Vercel's edge
export const revalidate = 300;

export async function GET() {
  try {
    const entries = await getTimetable();
    return NextResponse.json(
      { ok: true, entries },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("[/api/timetable] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load timetable.", entries: [] },
      { status: 500 }
    );
  }
}
