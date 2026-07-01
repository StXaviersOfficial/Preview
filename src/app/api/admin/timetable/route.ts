import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { getTimetable, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry, logAdminAction } from "@/lib/firestore-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const entries = await getTimetable();
    return NextResponse.json({ ok: true, entries });
  } catch (err) {
    console.error("[/api/admin/timetable GET] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.day || !body.subject) return NextResponse.json({ ok: false, error: "Day and subject required." }, { status: 400 });
    const entry = await createTimetableEntry({
      day: String(body.day).slice(0, 20),
      period: Number(body.period) || 1,
      startTime: String(body.startTime || "").slice(0, 10),
      endTime: String(body.endTime || "").slice(0, 10),
      subject: String(body.subject).slice(0, 100),
      classGrade: String(body.classGrade || "").slice(0, 50),
      teacher: body.teacher ? String(body.teacher).slice(0, 100) : null,
      room: body.room ? String(body.room).slice(0, 50) : null,
    });
    await logAdminAction("timetable_updated", `Added: ${entry.subject} ${entry.day} P${entry.period}`);
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    console.error("[/api/admin/timetable POST] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    if (data.period !== undefined) data.period = Number(data.period);
    const entry = await updateTimetableEntry(id, data);
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    console.error("[/api/admin/timetable PUT] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    await deleteTimetableEntry(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/timetable DELETE] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}
