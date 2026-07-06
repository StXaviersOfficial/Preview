import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { clearAdminSession } from "@/lib/site/admin-session";

export const runtime = "nodejs";

export async function POST() {
  try {
    await clearAdminSession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/logout] Error:", err);
    return NextResponse.json({ ok: false, error: "Logout failed." }, { status: 500 });
  }
}
