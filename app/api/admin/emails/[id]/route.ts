import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

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

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const email = await prisma.email.findUnique({
    where: { id: Number(id) },
    include: {
      attachments: { select: { id: true, filename: true, size: true, mimeType: true } },
      lead: { select: { id: true, name: true, email: true } },
    },
  });
  if (!email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!email.readAt && email.folder === "inbox") {
    await prisma.email.update({ where: { id: email.id }, data: { readAt: new Date() } });
  }

  return NextResponse.json(email);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json() as Partial<{
    subject: string; body: string; toEmail: string; toName: string;
    cc: string; bcc: string; folder: string;
  }>;

  const email = await prisma.email.findUnique({ where: { id: Number(id) } });
  if (!email) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (email.status === "sent") return NextResponse.json({ error: "Cannot edit a sent email" }, { status: 400 });

  const updated = await prisma.email.update({
    where: { id: Number(id) },
    data: {
      ...(body.subject !== undefined && { subject: body.subject }),
      ...(body.body    !== undefined && { body: body.body }),
      ...(body.toEmail !== undefined && { toEmail: body.toEmail }),
      ...(body.toName  !== undefined && { toName: body.toName }),
      ...(body.cc      !== undefined && { cc: body.cc }),
      ...(body.bcc     !== undefined && { bcc: body.bcc }),
      ...(body.folder  !== undefined && { folder: body.folder }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const email = await prisma.email.findUnique({ where: { id: Number(id) } });
  if (!email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (email.folder === "trash") {
    await prisma.email.delete({ where: { id: Number(id) } });
  } else {
    await prisma.email.update({ where: { id: Number(id) }, data: { folder: "trash" } });
  }

  return NextResponse.json({ ok: true });
}
