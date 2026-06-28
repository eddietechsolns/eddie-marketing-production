"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Source constants ─────────────────────────────────────────────────────────

export const LEAD_SOURCE = {
  JOB_APPLICATION:         "JOB_APPLICATION",
  INTERNSHIP_APPLICATION:  "INTERNSHIP_APPLICATION",
  WEBSITE_FORM:            "WEBSITE_FORM",
} as const;
export type LeadSource = (typeof LEAD_SOURCE)[keyof typeof LEAD_SOURCE];

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  // Core contact (required)
  name:             z.string().min(2, "Full name is required"),
  email:            z.string().email("A valid email is required"),

  // Core contact (optional)
  phone:            z.string().optional(),
  country:          z.string().optional(),

  // Recruitment-specific
  leadSource:       z.string().default(LEAD_SOURCE.JOB_APPLICATION),
  roleApplied:      z.string().optional(),
  department:       z.string().optional(),
  linkedin:         z.string().optional(),
  portfolio:        z.string().optional(),
  university:       z.string().optional(),
  currentPosition:  z.string().optional(),
  graduationYear:   z.string().optional(),

  // Message / cover letter
  message:          z.string().optional(),

  // Attribution
  landingPage:      z.string().optional(),
  referrer:         z.string().optional(),
  utmSource:        z.string().optional(),
  utmMedium:        z.string().optional(),
  utmCampaign:      z.string().optional(),
  utmContent:       z.string().optional(),
  utmTerm:          z.string().optional(),
});

export type SubmitApplicationState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  leadId?: number;
  roleApplied?: string;
  leadSource?: string;
} | null;

function opt(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed || undefined;
}

// ─── Email notification ───────────────────────────────────────────────────────

async function sendApplicationNotification(lead: {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  leadSource: string;
  roleApplied?: string | null;
  department?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  university?: string | null;
  currentPosition?: string | null;
  graduationYear?: string | null;
  message?: string | null;
  landingPage?: string | null;
}) {
  const SMTP_HOST   = process.env.SMTP_HOST;
  const SMTP_USER   = process.env.SMTP_USER;
  const SMTP_PASS   = process.env.SMTP_PASS;
  const NOTIFY_TO   = process.env.LEAD_NOTIFY_EMAIL;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_TO) return;

  try {
    const { createTransport } = await import("nodemailer");
    const SMTP_PORT   = parseInt(process.env.SMTP_PORT ?? "587", 10);
    const SMTP_SECURE = process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;
    const FROM        = process.env.SMTP_FROM ?? SMTP_USER;
    const SITE        = process.env.NEXTAUTH_URL ?? "https://eddietechsolns.com";

    const transporter = createTransport({
      host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const ref    = `#${lead.id.toString().padStart(4, "0")}`;
    const label  = lead.leadSource === LEAD_SOURCE.INTERNSHIP_APPLICATION
      ? "Internship Application"
      : "Job Application";
    const subject = `New ${label} ${ref}: ${lead.name}${lead.roleApplied ? ` — ${lead.roleApplied}` : ""}`;

    const rows = [
      ["Name",             lead.name],
      ["Email",            lead.email],
      ["Phone",            lead.phone],
      ["Role Applied For", lead.roleApplied],
      ["Department",       lead.department],
      ["LinkedIn",         lead.linkedin],
      ["Portfolio",        lead.portfolio],
      ["University",       lead.university],
      ["Current Position", lead.currentPosition],
      ["Graduation Year",  lead.graduationYear],
    ].filter(([, v]) => !!v);

    const htmlRows = rows.map(([k, v]) =>
      `<tr><td style="color:#64748b;width:140px;font-weight:600;padding:7px 0;border-bottom:1px solid #f1f5f9;font-size:13px">${k}</td><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;font-size:13px">${v}</td></tr>`
    ).join("");

    const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;background:#f8fafc;margin:0;padding:0">
<div style="max-width:540px;margin:32px auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden">
  <div style="background:#1e293b;padding:24px 28px">
    <h1 style="color:#fff;font-size:18px;margin:0">New ${label} — Eddie Marketing Solutions</h1>
    <p style="color:#94a3b8;font-size:13px;margin:4px 0 0">Ref ${ref}</p>
  </div>
  <div style="padding:24px 28px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${htmlRows}</table>
    ${lead.message ? `<p style="color:#64748b;font-size:12px;font-weight:600;margin-bottom:8px">COVER LETTER / MESSAGE</p><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;font-size:14px;line-height:1.6;white-space:pre-wrap">${lead.message.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>` : ""}
    <a href="${SITE}/admin/leads/${lead.id}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;margin-top:16px">View in CRM →</a>
  </div>
  <div style="padding:16px 28px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8">Eddie Marketing Solutions FZE · eddietechsolns.com</div>
</div></body></html>`;

    await transporter.sendMail({
      from: `"Eddie Marketing Solutions" <${FROM}>`,
      to: NOTIFY_TO,
      subject,
      text: subject,
      html,
    });
  } catch {
    // Notification failure must never break the application submission
  }
}

// ─── Action ───────────────────────────────────────────────────────────────────

export async function submitApplication(
  _prev: SubmitApplicationState,
  formData: FormData
): Promise<SubmitApplicationState> {
  const raw = {
    name:            opt(formData, "name") ?? "",
    email:           opt(formData, "email") ?? "",
    phone:           opt(formData, "phone"),
    country:         opt(formData, "country"),
    leadSource:      opt(formData, "leadSource") ?? LEAD_SOURCE.JOB_APPLICATION,
    roleApplied:     opt(formData, "roleApplied"),
    department:      opt(formData, "department"),
    linkedin:        opt(formData, "linkedin"),
    portfolio:       opt(formData, "portfolio"),
    university:      opt(formData, "university"),
    currentPosition: opt(formData, "currentPosition"),
    graduationYear:  opt(formData, "graduationYear"),
    message:         opt(formData, "message"),
    landingPage:     opt(formData, "landingPage"),
    referrer:        opt(formData, "referrer"),
    utmSource:       opt(formData, "utmSource"),
    utmMedium:       opt(formData, "utmMedium"),
    utmCampaign:     opt(formData, "utmCampaign"),
    utmContent:      opt(formData, "utmContent"),
    utmTerm:         opt(formData, "utmTerm"),
  };

  const result = schema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const d = result.data;

  const isInternship = d.leadSource === LEAD_SOURCE.INTERNSHIP_APPLICATION;
  const sourceLabel  = isInternship ? "Internship Application" : "Job Application";
  const serviceInterestLabel = d.roleApplied
    ? `${sourceLabel}: ${d.roleApplied}`
    : sourceLabel;

  try {
    const lead = await prisma.lead.create({
      data: {
        name:            d.name,
        email:           d.email,
        phone:           d.phone,
        country:         d.country,
        serviceInterest: serviceInterestLabel,
        message:         d.message,
        leadSource:      d.leadSource,
        roleApplied:     d.roleApplied,
        department:      d.department,
        linkedin:        d.linkedin,
        portfolio:       d.portfolio,
        university:      d.university,
        currentPosition: d.currentPosition,
        graduationYear:  d.graduationYear,
        landingPage:     d.landingPage,
        referrer:        d.referrer,
        utmSource:       d.utmSource,
        utmMedium:       d.utmMedium,
        utmCampaign:     d.utmCampaign,
        utmContent:      d.utmContent,
        utmTerm:         d.utmTerm,
      },
    });

    const roleText  = d.roleApplied ? ` for "${d.roleApplied}"` : "";
    const pageText  = d.landingPage ? ` from ${d.landingPage}` : "";

    await prisma.leadTimeline.create({
      data: {
        leadId:    lead.id,
        eventType: "Application Received",
        eventText: `${sourceLabel} submitted${roleText}${pageText}`,
      },
    });

    await sendApplicationNotification({
      id:              lead.id,
      name:            d.name,
      email:           d.email,
      phone:           d.phone,
      leadSource:      d.leadSource,
      roleApplied:     d.roleApplied,
      department:      d.department,
      linkedin:        d.linkedin,
      portfolio:       d.portfolio,
      university:      d.university,
      currentPosition: d.currentPosition,
      graduationYear:  d.graduationYear,
      message:         d.message,
      landingPage:     d.landingPage,
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/dashboard");

    return {
      success:     true,
      leadId:      lead.id,
      roleApplied: d.roleApplied,
      leadSource:  d.leadSource,
    };
  } catch {
    return { error: "Submission failed. Please try again or email us directly." };
  }
}
