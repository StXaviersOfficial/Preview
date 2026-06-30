import { NextResponse } from "next/server";
import { getFaqs } from "@/lib/site/seed-data";

export const runtime = "nodejs";

export async function GET() {
  try {
    const faqs = await getFaqs();
    return NextResponse.json({ ok: true, faqs });
  } catch (err) {
    console.error("[/api/faqs] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load FAQs.", faqs: [] },
      { status: 500 }
    );
  }
}
