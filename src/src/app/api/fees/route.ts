import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db.fee.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    console.error("Failed to fetch fees:", error);
    return NextResponse.json({ ok: false, rows: [], error: "Failed to fetch fees" }, { status: 500 });
  }
}
