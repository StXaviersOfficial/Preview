import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { getAllFaqs, createFaq, updateFaq, deleteFaq, logAdminAction } from "@/lib/firestore-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const faqs = await getAllFaqs();
    return NextResponse.json({ ok: true, faqs });
  } catch (err) {
    console.error("[/api/admin/faqs GET] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.question || !body.answer) return NextResponse.json({ ok: false, error: "Question and answer required." }, { status: 400 });
    const faq = await createFaq({
      question: String(body.question).slice(0, 500),
      answer: String(body.answer).slice(0, 5000),
      category: String(body.category || "general").slice(0, 50),
      order: Number(body.order) || 0,
      active: body.active ?? true,
    });
    await logAdminAction("faq_updated", `Added: ${faq.question.slice(0, 50)}`);
    return NextResponse.json({ ok: true, faq });
  } catch (err) {
    console.error("[/api/admin/faqs POST] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    if (data.order !== undefined) data.order = Number(data.order);
    if (data.question !== undefined) data.question = String(data.question).slice(0, 500);
    if (data.answer !== undefined) data.answer = String(data.answer).slice(0, 5000);
    const faq = await updateFaq(id, data);
    return NextResponse.json({ ok: true, faq });
  } catch (err) {
    console.error("[/api/admin/faqs PUT] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    await deleteFaq(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/faqs DELETE] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}
