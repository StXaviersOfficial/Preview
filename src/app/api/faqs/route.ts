import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const faqs = await db.faq.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ ok: true, faqs });
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return NextResponse.json({ ok: false, faqs: [], error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
