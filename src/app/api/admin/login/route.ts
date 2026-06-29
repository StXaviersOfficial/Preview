import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCode } from "@/lib/internal/system/config/runtime/credentials/.private/admin-code";
import { createAdminSession } from "@/lib/site/admin-session";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = (body?.code || "").toString();

    if (!code) {
      return NextResponse.json({ ok: false, error: "Code is required." }, { status: 400 });
    }

    const valid = await verifyAdminCode(code);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid admin code." }, { status: 401 });
    }

    await createAdminSession();

    // Log
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    await db.adminLog.create({
      data: { action: "login", detail: "Admin logged in", ip },
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/login] Error:", err);
    return NextResponse.json({ ok: false, error: "Login failed." }, { status: 500 });
  }
}
