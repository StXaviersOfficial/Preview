import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // optional filter
  const submissions = await db.contactSubmission.findMany({
    where: status ? { status } : undefined,
    include: { replies: { orderBy: { sentAt: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  // Log view
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  await db.adminLog.create({ data: { action: "enquiry_viewed", detail: `Listed ${submissions.length} enquiries`, ip } }).catch(() => null);

  return NextResponse.json({ ok: true, submissions });
}

// Update status (new → read → replied → archived)
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) {
    return NextResponse.json({ ok: false, error: "id and status required" }, { status: 400 });
  }
  const updated = await db.contactSubmission.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ ok: true, submission: updated });
}

// Delete
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }
  await db.contactSubmission.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
