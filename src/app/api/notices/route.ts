import { NextResponse } from "next/server";
import { getNotices } from "@/lib/firestore-db";

export const runtime = "nodejs";

// Cache notices for 2 minutes (shorter — notices are time-sensitive)
export const revalidate = 120;

export async function GET() {
  try {
    const notices = await getNotices();
    return NextResponse.json(
      { ok: true, notices },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("[/api/notices] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load notices.", notices: [] },
      { status: 500 }
    );
  }
}
