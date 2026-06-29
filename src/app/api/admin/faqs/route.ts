import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const faqs = await db.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ ok: true, faqs });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const faq = await db.faq.create({
    data: {
      question: body.question,
      answer: body.answer,
      category: body.category || "general",
      order: Number(body.order) || 0,
      active: body.active ?? true,
    },
  });
  return NextResponse.json({ ok: true, faq });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  if (data.order !== undefined) data.order = Number(data.order);
  const faq = await db.faq.update({ where: { id }, data });
  return NextResponse.json({ ok: true, faq });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  await db.faq.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
