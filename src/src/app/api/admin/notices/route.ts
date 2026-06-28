import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const notices = await db.notice.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, notices });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json(); if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  const notice = await db.notice.create({
    data: {
      text: body.text,
      link: body.link || null,
      active: body.active ?? true,
      order: Number(body.order) || 0,
    },
  });
  await db.adminLog.create({ data: { action: "notice_updated", detail: `Added: ${notice.text.slice(0, 50)}` } }).catch(() => null);
  return NextResponse.json({ ok: true, notice });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json(); if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  const { id, ...data } = body; if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  if (data.order !== undefined) data.order = Number(data.order);
  const notice = await db.notice.update({ where: { id }, data });
  return NextResponse.json({ ok: true, notice });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  await db.notice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
