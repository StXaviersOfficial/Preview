import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCode } from "@/lib/internal/system/config/runtime/credentials/.private/admin-code";
import { createAdminSession } from "@/lib/site/admin-session";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIP } from "@/lib/site/rate-limit";

export const runtime = "nodejs";

// Strict rate limit: 5 login attempts per 15 minutes per IP
// This prevents brute-force attacks on the admin code
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — apply BEFORE verifying code to prevent timing attacks
    const ip = getClientIP(req);
    const rateLimit = checkRateLimit(`admin-login:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { ok: false, error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

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

    // Log successful login
    await db.adminLog.create({
      data: { action: "login", detail: "Admin logged in", ip },
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/login] Error:", err);
    return NextResponse.json({ ok: false, error: "Login failed." }, { status: 500 });
  }
}
