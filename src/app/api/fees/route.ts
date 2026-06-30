import { NextResponse } from "next/server";
import { getFees } from "@/lib/site/seed-data";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await getFees();
    return NextResponse.json({ ok: true, rows, source: "seed" });
  } catch (err) {
    console.error("[/api/fees] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load fee structure.", rows: [] },
      { status: 500 }
    );
  }
}
