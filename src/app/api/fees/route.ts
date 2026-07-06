import { NextResponse } from "next/server";
import { getFees } from "@/lib/firestore-db";

export const runtime = "nodejs";

// Cache public fee data for 5 minutes on Vercel's edge
export const revalidate = 300;

export async function GET() {
  try {
    const rows = await getFees();
    return NextResponse.json(
      { ok: true, rows },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("[/api/fees] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load fee structure.", rows: [] },
      { status: 500 }
    );
  }
}
