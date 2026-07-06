import { NextResponse } from "next/server";
import { getFaqs } from "@/lib/firestore-db";

export const runtime = "nodejs";

// Cache FAQs for 5 minutes on Vercel's edge
export const revalidate = 300;

export async function GET() {
  try {
    const faqs = await getFaqs();
    return NextResponse.json(
      { ok: true, faqs },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("[/api/faqs] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load FAQs.", faqs: [] },
      { status: 500 }
    );
  }
}
