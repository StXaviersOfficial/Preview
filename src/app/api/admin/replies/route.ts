import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/site/admin-session";
import { db } from "@/lib/db";
import { sendReplyEmail } from "@/lib/site/email";

export const runtime = "nodejs";

/**
 * POST /api/admin/replies
 * Body: { submissionId, subject, body }
 * Saves reply to DB and emails it to the enquirer.
 */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const submissionId = (body?.submissionId || "").toString();
    const subject = (body?.subject || "").toString().trim();
    const replyBody = (body?.body || "").toString().trim();

    if (!submissionId || !subject || !replyBody) {
      return NextResponse.json({ ok: false, error: "submissionId, subject, body required" }, { status: 400 });
    }

    const submission = await db.contactSubmission.findUnique({ where: { id: submissionId } });
    if (!submission) {
      return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });
    }

    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "admin@stxaviers.org";

    // Save reply record
    const reply = await db.reply.create({
      data: {
        submissionId,
        fromEmail,
        toEmail: submission.email,
        subject,
        body: replyBody,
      },
    });

    // Mark enquiry as replied
    await db.contactSubmission.update({
      where: { id: submissionId },
      data: { status: "replied" },
    });

    // Send the email (best-effort, log if fails)
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

    // Log
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    await db.adminLog.create({
      data: {
        action: "reply_sent",
        detail: `Replied to ${submission.email} (email sent: ${emailOk})`,
        ip,
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, reply, emailSent: emailOk });
  } catch (err) {
    console.error("[/api/admin/replies] Error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
