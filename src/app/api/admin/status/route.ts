import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ ok: true, admin: await isAdmin() });
  } catch (err) {
    console.error("[/api/admin/status] Error:", err);
    return NextResponse.json({ ok: false, admin: false, error: "Status check failed." }, { status: 500 });
  }
}
