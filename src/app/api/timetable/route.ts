import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const entries = await db.timetableEntry.findMany({
    orderBy: [{ day: "asc" }, { period: "asc" }],
  });
  return NextResponse.json({ ok: true, entries });
}
