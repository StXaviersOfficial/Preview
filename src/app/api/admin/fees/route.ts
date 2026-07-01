import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { getFees, createFee, updateFee, deleteFee, logAdminAction } from "@/lib/firestore-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await getFees();
    return NextResponse.json({ ok: true, rows });
  } catch (err) {
    console.error("[/api/admin/fees GET] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const row = await createFee({
      label: String(body.label || "").slice(0, 200),
      amount: Number(body.amount) || 0,
      frequency: body.frequency || "Yearly",
      category: body.category || "general",
      note: body.note ? String(body.note).slice(0, 500) : null,
      order: Number(body.order) || 0,
    });
    await logAdminAction("fee_updated", `Added: ${row.label} (Rs.${row.amount})`);
    return NextResponse.json({ ok: true, row });
  } catch (err) {
    console.error("[/api/admin/fees POST] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    if (data.amount !== undefined) data.amount = Number(data.amount);
    if (data.order !== undefined) data.order = Number(data.order);
    if (data.label !== undefined) data.label = String(data.label).slice(0, 200);
    const row = await updateFee(id, data);
    await logAdminAction("fee_updated", `Updated row ${id}`);
    return NextResponse.json({ ok: true, row });
  } catch (err) {
    console.error("[/api/admin/fees PUT] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    await deleteFee(id);
    await logAdminAction("fee_updated", `Deleted row ${id}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/fees DELETE] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}
