import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const rows = await db.feeRow.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ ok: true, rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json(); if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  const row = await db.feeRow.create({
    data: {
      label: body.label,
      amount: Number(body.amount) || 0,
      frequency: body.frequency || "Yearly",
      category: body.category || "general",
      note: body.note || null,
      order: Number(body.order) || 0,
    },
  });
  await db.adminLog.create({ data: { action: "fee_updated", detail: `Added: ${row.label} (₹${row.amount})` } }).catch(() => null);
  return NextResponse.json({ ok: true, row });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json(); if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  const { id, ...data } = body; if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  if (data.amount !== undefined) data.amount = Number(data.amount);
  if (data.order !== undefined) data.order = Number(data.order);
  const row = await db.feeRow.update({ where: { id }, data });
  await db.adminLog.create({ data: { action: "fee_updated", detail: `Updated row ${id}` } }).catch(() => null);
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  await db.feeRow.delete({ where: { id } });
  await db.adminLog.create({ data: { action: "fee_updated", detail: `Deleted row ${id}` } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
