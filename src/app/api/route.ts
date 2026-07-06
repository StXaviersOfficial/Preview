import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    name: "St. Xavier's Jr./Sr. School API",
    version: "1.0.0",
    description: "Official API for stxaviers.org — CBSE school in Muzaffarpur, Bihar",
    endpoints: {
      public: {
        "/api/fees": "GET — Fee structure for academic session",
        "/api/faqs": "GET — Frequently asked questions",
        "/api/notices": "GET — Active school notices",
        "/api/timetable": "GET — Class timetable",
        "/api/contact": "POST — Submit an admission enquiry",
      },
      admin: {
        "/api/admin/login": "POST — Authenticate with admin code",
        "/api/admin/logout": "POST — End admin session",
        "/api/admin/status": "GET — Check current admin session",
        "/api/admin/enquiries": "GET/PATCH/DELETE — Manage enquiries",
        "/api/admin/fees": "POST/PUT/DELETE — Manage fees",
        "/api/admin/faqs": "POST/PUT/DELETE — Manage FAQs",
        "/api/admin/notices": "POST/PUT/DELETE — Manage notices",
        "/api/admin/timetable": "POST/PUT/DELETE — Manage timetable",
        "/api/admin/replies": "POST — Reply to an enquiry",
      },
    },
    rateLimit: {
      contact: "5 requests per hour per IP",
      adminLogin: "5 requests per 15 minutes per IP",
    },
    documentation: "https://xavierpreview.vercel.app",
    support: "helpdesk@stxaviers.org",
  });
}
