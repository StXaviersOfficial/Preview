import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const notices = await db.notice.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ ok: true, notices });
  } catch (error) {
    console.error("Failed to fetch notices:", error);
    return NextResponse.json({ ok: false, notices: [], error: "Failed to fetch notices" }, { status: 500 });
  }
}
