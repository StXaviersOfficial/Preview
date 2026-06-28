import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, admin: await isAdmin() });
}
