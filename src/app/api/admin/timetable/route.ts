import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const entries = await db.timetableEntry.findMany({
    orderBy: [{ day: "asc" }, { period: "asc" }],
  });
  return NextResponse.json({ ok: true, entries });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const entry = await db.timetableEntry.create({
    data: {
      day: body.day,
      period: Number(body.period),
      startTime: body.startTime,
      endTime: body.endTime,
      subject: body.subject,
      classGrade: body.classGrade,
      teacher: body.teacher || null,
      room: body.room || null,
    },
  });
  await db.adminLog.create({ data: { action: "timetable_updated", detail: `Added: ${entry.subject} (${entry.day} P${entry.period})` } }).catch(() => null);
  return NextResponse.json({ ok: true, entry });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  if (data.period !== undefined) data.period = Number(data.period);
  const entry = await db.timetableEntry.update({ where: { id }, data });
  await db.adminLog.create({ data: { action: "timetable_updated", detail: `Updated entry ${id}` } }).catch(() => null);
  return NextResponse.json({ ok: true, entry });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  await db.timetableEntry.delete({ where: { id } });
  await db.adminLog.create({ data: { action: "timetable_updated", detail: `Deleted entry ${id}` } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
