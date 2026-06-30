import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {

  const entries = await db.timetableEntry.findMany({
    orderBy: [{ day: "asc" }, { period: "asc" }],
  });
  return NextResponse.json({ ok: true, entries });
  } catch (err) {
    console.error("[' + p + '] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
