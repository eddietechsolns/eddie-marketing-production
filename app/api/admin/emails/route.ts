import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { sendMail, wrapInEmailTemplate, htmlToText } from "@/lib/mailer";

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "fallback-secret-change-me"
  );
}
async function getAuthedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { userId: number; email: string; name?: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const folder   = searchParams.get("folder") ?? "inbox";
  const leadId   = searchParams.get("leadId");
  const q        = searchParams.get("q")?.trim() ?? "";
  const page     = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "25")));

  const where: Record<string, unknown> = { folder };
  if (leadId) where.leadId = Number(leadId);
  if (q) {
    where.OR = [
      { subject:  { contains: q, mode: "insensitive" } },
      { toEmail:  { contains: q, mode: "insensitive" } },
      { fromEmail:{ contains: q, mode: "insensitive" } },
      { toName:   { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, emails] = await Promise.all([
    prisma.email.count({ where }),
    prisma.email.findMany({
      where,
      select: {
        id: true, subject: true, fromEmail: true, fromName: true,
        toEmail: true, toName: true, status: true, folder: true,
        sentAt: true, readAt: true, createdAt: true, leadId: true,
        lead: { select: { id: true, name: true } },
        _count: { select: { attachments: true } },
      },
      orderBy: folder === "sent" ? { sentAt: "desc" } : { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ emails, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    toEmail: string;
    toName?: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
    leadId?: number;
    send?: boolean;
    attachments?: Array<{ filename: string; data: string; mimeType: string; size: number }>;
  };

  const { toEmail, toName, cc, bcc, subject, body: emailBody, leadId, send = false, attachments = [] } = body;

  if (!toEmail) return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
  if (!subject) return NextResponse.json({ error: "Subject is required" }, { status: 400 });

  const SMTP_FROM = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "";
  const fromName = process.env.SMTP_FROM_NAME ?? "Eddie Marketing Solutions";

  const wrapped = wrapInEmailTemplate(emailBody, subject);
  const text    = htmlToText(emailBody);

  let status = "draft";
  let folder = "drafts";
  let sentAt: Date | null = null;
  let errorMsg: string | null = null;

  if (send) {
    const result = await sendMail({
      to: toEmail, toName,
      fromName,
      subject, html: wrapped, text,
      cc, bcc,
      attachments: attachments.map((a) => ({ filename: a.filename, data: a.data, mimeType: a.mimeType, size: a.size })),
    });

    if (result.ok) {
      status = "sent";
      folder = "sent";
      sentAt = new Date();
    } else {
      status = "failed";
      errorMsg = result.error;
    }
  }

  const email = await prisma.email.create({
    data: {
      subject, body: emailBody, bodyText: text,
      fromEmail: SMTP_FROM, fromName,
      toEmail, toName: toName ?? null,
      cc: cc ?? null, bcc: bcc ?? null,
      status, folder, leadId: leadId ?? null,
      sentAt, errorMsg,
      attachments: attachments.length > 0 ? {
        create: attachments.map((a) => ({
          filename: a.filename,
          data: a.data,
          mimeType: a.mimeType,
          size: a.size,
        })),
      } : undefined,
    },
    include: { attachments: { select: { id: true, filename: true, size: true, mimeType: true } } },
  });

  if (status === "failed") {
    return NextResponse.json({ email, error: errorMsg }, { status: 207 });
  }

  return NextResponse.json(email, { status: 201 });
}
