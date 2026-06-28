import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEnquiryEmail } from "@/lib/site/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    const name = (body?.name || "").toString().trim();
    const email = (body?.email || "").toString().trim().toLowerCase();
    const phone = (body?.phone || "").toString().trim();
    const grade = (body?.grade || "").toString().trim();
    const message = (body?.message || "").toString().trim();

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Name and email are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (name.length > 200 || message.length > 5000 || phone.length > 20 || email.length > 200 || grade.length > 50) {
      return NextResponse.json(
        { ok: false, error: "Input too long." },
        { status: 400 }
      );
    }

    // Save to DB (always — so nothing is lost even if email fails)
    const submission = await db.contactSubmission.create({
      data: { name, email, phone, grade, message },
    });

    // Fire-and-forget email send
    await sendEnquiryEmail({ name, email, phone, grade, message });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or call us directly." },
      { status: 500 }
    );
  }
}

// Simple in-memory rate limiter — 5 submissions per hour per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}
