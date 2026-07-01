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
async function isAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return false;
  try { await jwtVerify(token, getSecret()); return true; } catch { return false; }
}

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Ctx) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const email = await prisma.email.findUnique({
    where: { id: Number(id) },
    include: { attachments: true },
  });
  if (!email) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (email.status === "sent") return NextResponse.json({ error: "Already sent" }, { status: 400 });

  const wrapped = wrapInEmailTemplate(email.body, email.subject);
  const text    = htmlToText(email.body);

  const result = await sendMail({
    to: email.toEmail,
    toName: email.toName,
    fromName: email.fromName,
    subject: email.subject,
    html: wrapped,
    text,
    cc: email.cc,
    bcc: email.bcc,
    attachments: email.attachments.map((a) => ({
      filename: a.filename,
      data: a.data,
      mimeType: a.mimeType,
      size: a.size,
    })),
  });

  if (!result.ok) {
    await prisma.email.update({
      where: { id: Number(id) },
      data: { status: "failed", errorMsg: result.error },
    });
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  const updated = await prisma.email.update({
    where: { id: Number(id) },
    data: { status: "sent", folder: "sent", sentAt: new Date(), errorMsg: null },
  });

  return NextResponse.json(updated);
}
