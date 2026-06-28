import { NextResponse } from "next/server";
import { clearAdminSession, isAdmin } from "@/lib/site/admin-session";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST() {
  if (await isAdmin()) {
    await db.adminLog.create({ data: { action: "logout", detail: "Admin logged out" } }).catch(() => null);
  }
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
