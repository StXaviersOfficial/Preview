import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { getEnquiries, getEnquiry, updateEnquiryStatus, getReplies, logAdminAction } from "@/lib/firestore-db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (id) {
      const enquiry = await getEnquiry(id);
      if (!enquiry) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      const replies = await getReplies(id);
      return NextResponse.json({ ok: true, enquiry: { ...enquiry, replies } });
    }
    
    const enquiries = await getEnquiries(100);
    return NextResponse.json({ ok: true, enquiries });
  } catch (err) {
    console.error("[/api/admin/enquiries GET] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ ok: false, error: "id and status required" }, { status: 400 });
    await updateEnquiryStatus(id, status);
    await logAdminAction("enquiry_viewed", `Status: ${id} -> ${status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/enquiries PUT] Error:", err);
    return NextResponse.json({ ok: false, error: "Failed." }, { status: 500 });
  }
}
