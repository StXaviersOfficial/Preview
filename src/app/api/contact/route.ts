import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/firestore-db";
import { sendEnquiryEmail } from "@/lib/site/email";
import { checkRateLimit, getClientIP } from "@/lib/site/rate-limit";

export const runtime = "nodejs";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const rateLimit = checkRateLimit(`contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { ok: false, error: "Too many enquiries. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const body = await req.json();
    const name = (body?.name || "").toString().trim();
    const email = (body?.email || "").toString().trim().toLowerCase();
    const phone = (body?.phone || "").toString().trim();
    const grade = (body?.grade || "").toString().trim();
    const message = (body?.message || "").toString().trim();

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 200) {
      return NextResponse.json({ ok: false, error: "Name must be between 2 and 200 characters." }, { status: 400 });
    }
    if (!/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Please provide a valid email address." }, { status: 400 });
    }
    if (phone && !/^[+]?[\d\s-]{6,20}$/.test(phone)) {
      return NextResponse.json({ ok: false, error: "Please provide a valid phone number." }, { status: 400 });
    }
    if (grade && (grade.length > 50 || /<[^>]+>/.test(grade))) {
      return NextResponse.json({ ok: false, error: "Invalid grade value." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ ok: false, error: "Message too long (max 5000 characters)." }, { status: 400 });
    }

    const submission = await createEnquiry({ name, email, phone, grade, message });
    await sendEnquiryEmail({ name, email, phone, grade, message });

    return NextResponse.json({ ok: true, id: submission.id, remaining: rateLimit.remaining });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or call us directly." },
      { status: 500 }
    );
  }
}
