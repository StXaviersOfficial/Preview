import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { getAllNotices, createNotice, updateNotice, deleteNotice, logAdminAction } from "@/lib/firestore-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const notices = await getAllNotices();
    return NextResponse.json({ ok: true, notices });
  } catch (err) {
    console.error("[/api/admin/notices GET] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.text) return NextResponse.json({ ok: false, error: "Text required." }, { status: 400 });
    const notice = await createNotice({
      text: String(body.text).slice(0, 500),
      link: body.link ? String(body.link).slice(0, 500) : null,
      active: body.active ?? true,
      order: Number(body.order) || 0,
    });
    await logAdminAction("notice_updated", `Added: ${notice.text.slice(0, 50)}`);
    return NextResponse.json({ ok: true, notice });
  } catch (err) {
    console.error("[/api/admin/notices POST] Error:", err);
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
    if (data.text !== undefined) data.text = String(data.text).slice(0, 500);
    const notice = await updateNotice(id, data);
    return NextResponse.json({ ok: true, notice });
  } catch (err) {
    console.error("[/api/admin/notices PUT] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    await deleteNotice(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/notices DELETE] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}
