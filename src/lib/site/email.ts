import "server-only";
import nodemailer from "nodemailer";

/**
 * Email service for the St. Xavier's school website contact form.
 *
 * Sends enquiry emails to amodkumardutta@gmail.com (the school's designated
 * enquiries inbox — verified by user).
 *
 * SMTP credentials are read from environment variables. For Gmail:
 *   1. Enable 2-Step Verification on the sender Gmail account.
 *   2. Generate an App Password at https://myaccount.google.com/apppasswords
 *   3. Set SMTP_USER and SMTP_PASS in .env (SMTP_PASS = the 16-char app password)
 *
 * If SMTP creds are missing, emails are silently skipped — submissions still
 * get saved to the database so nothing is lost.
 */

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const SMTP_TO = process.env.SMTP_TO || "amodkumardutta@gmail.com";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  message?: string;
};

export type ReplyPayload = {
  to: string;
  from: string;
  subject: string;
  body: string;
  originalSubmission: {
    name: string;
    email: string;
    phone?: string | null;
    grade?: string | null;
    message?: string | null;
  };
};

export async function sendEnquiryEmail(payload: EnquiryPayload): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.warn("[email] SMTP creds missing — skipping email send. Submission still saved to DB.");
    return false;
  }

  const subject = `New Admission Enquiry — ${payload.name}`;
  const text = [
    `New enquiry received from the St. Xavier's Jr./Sr. School website contact form.`,
    ``,
    `Name:    ${payload.name}`,
    `Email:   ${payload.email}`,
    `Phone:   ${payload.phone || "—"}`,
    `Grade:   ${payload.grade || "—"}`,
    ``,
    `Message:`,
    payload.message || "(no message)",
    ``,
    `—`,
    `This is an automated email from stxaviers.org contact form.`,
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1410;">
      <div style="background: linear-gradient(135deg, #6b1a2b 0%, #4a121d 100%); padding: 24px; border-radius: 12px 12px 0 0; color: #f5ebd6;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">St. Xavier's Jr./Sr. School</h1>
        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.85; letter-spacing: 0.1em; text-transform: uppercase;">New Admission Enquiry</p>
      </div>
      <div style="background: #faf7f0; padding: 24px; border: 1px solid #e8e0cf; border-top: none; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #8a7a60; width: 90px; vertical-align: top;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #1a1410;">${escapeHtml(payload.name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #8a7a60; vertical-align: top;">Email</td><td style="padding: 8px 0; color: #1a1410;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #6b1a2b;">${escapeHtml(payload.email)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #8a7a60; vertical-align: top;">Phone</td><td style="padding: 8px 0; color: #1a1410;">${escapeHtml(payload.phone || "—")}</td></tr>
          <tr><td style="padding: 8px 0; color: #8a7a60; vertical-align: top;">Class</td><td style="padding: 8px 0; color: #1a1410;">${escapeHtml(payload.grade || "—")}</td></tr>
        </table>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #d9cdb0;">
          <p style="margin: 0 0 8px; color: #8a7a60; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
          <p style="margin: 0; line-height: 1.6; color: #1a1410; white-space: pre-wrap;">${escapeHtml(payload.message || "(no message)")}</p>
        </div>
        <p style="margin: 24px 0 0; font-size: 11px; color: #8a7a60; border-top: 1px solid #e8e0cf; padding-top: 16px;">
          Automated email from the contact form at stxaviers.org
        </p>
      </div>
    </div>
  `;

  try {
    await t.sendMail({
      from: `"St. Xavier's Website" <${SMTP_FROM}>`,
      to: SMTP_TO,
      replyTo: payload.email,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] Failed to send enquiry email:", err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Send an admin reply to an enquirer.
 * Falls back silently if SMTP creds are missing (reply is still saved to DB).
 */
export async function sendReplyEmail(payload: ReplyPayload): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.warn("[email] SMTP creds missing — skipping reply email send. Reply still saved to DB.");
    return false;
  }

  const orig = payload.originalSubmission;
  const text = [
    `Dear ${orig.name},`,
    ``,
    payload.body,
    ``,
    `—`,
    `St. Xavier's Jr./Sr. School`,
    `Goshala Road, Muzaffarpur, Bihar`,
    ``,
    `------------------`,
    `Your original enquiry (for reference):`,
    `Name:    ${orig.name}`,
    `Email:   ${orig.email}`,
    `Phone:   ${orig.phone || "—"}`,
    `Grade:   ${orig.grade || "—"}`,
    `Message: ${orig.message || "(no message)"}`,
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1410;">
      <div style="background: linear-gradient(135deg, #6b1a2b 0%, #4a121d 100%); padding: 24px; border-radius: 12px 12px 0 0; color: #f5ebd6;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">St. Xavier's Jr./Sr. School</h1>
        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.85; letter-spacing: 0.1em; text-transform: uppercase;">Reply to your enquiry</p>
      </div>
      <div style="background: #faf7f0; padding: 24px; border: 1px solid #e8e0cf; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 16px; font-size: 14px;">Dear ${escapeHtml(orig.name)},</p>
        <div style="font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: #1a1410;">${escapeHtml(payload.body)}</div>
        <p style="margin: 24px 0 0; font-size: 14px; color: #1a1410;">—</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: #1a1410;">
          <strong>St. Xavier's Jr./Sr. School</strong><br>
          <span style="color: #8a7a60;">Goshala Road, Muzaffarpur, Bihar</span>
        </p>
        <div style="margin-top: 24px; padding: 16px; background: #fff; border-left: 3px solid #c9a961; border-radius: 4px; font-size: 12px; color: #8a7a60;">
          <p style="margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Your original enquiry</p>
          <p style="margin: 0; line-height: 1.6;">${escapeHtml(orig.message || "(no message)")}</p>
        </div>
      </div>
    </div>
  `;

  try {
    await t.sendMail({
      from: `"St. Xavier's School" <${payload.from}>`,
      to: payload.to,
      subject: payload.subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] Failed to send reply email:", err);
    return false;
  }
}

