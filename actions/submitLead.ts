"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("A valid email is required"),
  phone: z.string().optional(),
  country: z.string().optional(),
  serviceInterest: z.string().optional(),
  message: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
});

export type SubmitLeadState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  leadId?: number;
  serviceInterest?: string;
  utmCampaign?: string;
  utmSource?: string;
} | null;

function opt(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed || undefined;
}

// ── Email notification ───────────────────────────────────────────────────────
// Configure via environment variables:
//   SMTP_HOST        e.g. smtp.gmail.com or smtp.office365.com
//   SMTP_PORT        e.g. 587 (TLS) or 465 (SSL) — defaults to 587
//   SMTP_SECURE      set to "true" only for port 465
//   SMTP_USER        your email address / username
//   SMTP_PASS        your password or app-specific password
//   SMTP_FROM        "From" display address (defaults to SMTP_USER)
//   LEAD_NOTIFY_EMAIL  where to send new-lead alerts (e.g. info@eddietechsolns.com)
async function sendLeadNotification(lead: {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  serviceInterest?: string | null;
  message?: string | null;
  landingPage?: string | null;
  utmSource?: string | null;
}) {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_TO) {
    console.log(
      `[Lead #${lead.id}] Email notification skipped — SMTP not configured. ` +
        `Set SMTP_HOST, SMTP_USER, SMTP_PASS, LEAD_NOTIFY_EMAIL to enable.`
    );
    return;
  }

  try {
    const { createTransport } = await import("nodemailer");
    const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
    const SMTP_SECURE = process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;
    const FROM = process.env.SMTP_FROM ?? SMTP_USER;
    const SITE = process.env.NEXTAUTH_URL ?? "https://eddietechsolns.com";

    const transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const ref = `#${lead.id.toString().padStart(4, "0")}`;
    const subject = `New Lead ${ref}: ${lead.name}${lead.serviceInterest ? ` — ${lead.serviceInterest}` : ""}`;

    const textBody = [
      `New lead received! ${ref}`,
      ``,
      `Name:     ${lead.name}`,
      `Email:    ${lead.email}`,
      `Company:  ${lead.company ?? "—"}`,
      `Phone:    ${lead.phone ?? "—"}`,
      `Service:  ${lead.serviceInterest ?? "—"}`,
      `Country:  —`,
      `Source:   ${lead.utmSource ?? "direct"}`,
      `Page:     ${lead.landingPage ?? "—"}`,
      ``,
      `Message:`,
      lead.message ?? "(none)",
      ``,
      `View in CRM: ${SITE}/admin/leads/${lead.id}`,
    ].join("\n");

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
  .wrap { max-width: 540px; margin: 32px auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
  .header { background: #1e293b; padding: 24px 28px; }
  .header h1 { color: #fff; font-size: 18px; margin: 0; }
  .header p { color: #94a3b8; font-size: 13px; margin: 4px 0 0; }
  .body { padding: 24px 28px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  td:first-child { color: #64748b; width: 90px; font-weight: 600; }
  .msg { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px; white-space: pre-wrap; }
  .cta { display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; }
  .footer { padding: 16px 28px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <h1>New Lead — Eddie Marketing Solutions</h1>
    <p>Ref ${ref} · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
  </div>
  <div class="body">
    <table>
      <tr><td>Name</td><td><strong>${lead.name}</strong></td></tr>
      <tr><td>Email</td><td><a href="mailto:${lead.email}" style="color:#3b82f6">${lead.email}</a></td></tr>
      <tr><td>Company</td><td>${lead.company ?? "—"}</td></tr>
      <tr><td>Phone</td><td>${lead.phone ?? "—"}</td></tr>
      <tr><td>Service</td><td>${lead.serviceInterest ?? "—"}</td></tr>
      <tr><td>Source</td><td>${lead.utmSource ?? "direct"}</td></tr>
      <tr><td>Page</td><td style="font-size:12px;color:#64748b">${lead.landingPage ?? "—"}</td></tr>
    </table>
    ${
      lead.message
        ? `<p style="color:#64748b;font-size:12px;font-weight:600;margin-bottom:8px">MESSAGE</p>
    <div class="msg">${lead.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`
        : ""
    }
    <a href="${SITE}/admin/leads/${lead.id}" class="cta">View in CRM →</a>
  </div>
  <div class="footer">Eddie Marketing Solutions FZE · eddietechsolns.com</div>
</div>
</body>
</html>`.trim();

    await transporter.sendMail({
      from: `"Eddie Marketing Solutions" <${FROM}>`,
      to: NOTIFY_TO,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[Lead #${lead.id}] Email notification sent to ${NOTIFY_TO}`);
  } catch (err) {
    console.error(`[Lead #${lead.id}] Failed to send email notification:`, err);
  }
}

export async function submitLead(
  _prev: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  const raw = {
    name: opt(formData, "name") ?? "",
    company: opt(formData, "company"),
    email: opt(formData, "email") ?? "",
    phone: opt(formData, "phone"),
    country: opt(formData, "country"),
    serviceInterest: opt(formData, "serviceInterest"),
    message: opt(formData, "message"),
    landingPage: opt(formData, "landingPage"),
    referrer: opt(formData, "referrer"),
    utmSource: opt(formData, "utmSource"),
    utmMedium: opt(formData, "utmMedium"),
    utmCampaign: opt(formData, "utmCampaign"),
    utmContent: opt(formData, "utmContent"),
    utmTerm: opt(formData, "utmTerm"),
  };

  const result = schema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  try {
    const lead = await prisma.lead.create({ data: result.data });

    await prisma.leadTimeline.create({
      data: {
        leadId: lead.id,
        eventType: "Lead Created",
        eventText: `Lead submitted from ${result.data.landingPage ?? "unknown page"}${result.data.utmSource ? ` via ${result.data.utmSource}` : ""}`,
      },
    });

    await sendLeadNotification({
      id: lead.id,
      name: result.data.name,
      email: result.data.email,
      company: result.data.company,
      phone: result.data.phone,
      serviceInterest: result.data.serviceInterest,
      message: result.data.message,
      landingPage: result.data.landingPage,
      utmSource: result.data.utmSource,
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/dashboard");

    return {
      success: true,
      leadId: lead.id,
      serviceInterest: result.data.serviceInterest,
      utmCampaign: result.data.utmCampaign,
      utmSource: result.data.utmSource,
    };
  } catch {
    return { error: "Submission failed. Please try again or email us directly." };
  }
}
