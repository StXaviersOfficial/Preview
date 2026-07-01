import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { getEnquiry, createReply, updateEnquiryStatus, logAdminAction } from "@/lib/firestore-db";
import { sendReplyEmail } from "@/lib/site/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const submissionId = (body?.submissionId || "").toString();
    const subject = (body?.subject || "").toString().trim();
    const replyBody = (body?.body || "").toString().trim();

    if (!submissionId || !subject || !replyBody) {
      return NextResponse.json({ ok: false, error: "submissionId, subject, body required" }, { status: 400 });
    }

    const submission = await getEnquiry(submissionId);
    if (!submission) return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });

    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "admin@stxaviers.org";
    const reply = await createReply({ submissionId, fromEmail, toEmail: submission.email, subject, body: replyBody });
    await updateEnquiryStatus(submissionId, "replied");

    const emailOk = await sendReplyEmail({
      to: submission.email,
      from: fromEmail,
      subject,
      body: replyBody,
      originalSubmission: {
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        grade: submission.grade,
        message: submission.message,
      },
    });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    await logAdminAction("reply_sent", `Replied to ${submission.email} (email sent: ${emailOk})`, ip);

    return NextResponse.json({ ok: true, reply, emailSent: emailOk });
  } catch (err) {
    console.error("[/api/admin/replies] Error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
