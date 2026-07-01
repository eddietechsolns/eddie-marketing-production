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

  const template = await prisma.emailTemplate.findUnique({ where: { id: Number(id) } });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json() as Partial<{
    name: string; subject: string; body: string; category: string; isActive: boolean;
  }>;

  const template = await prisma.emailTemplate.findUnique({ where: { id: Number(id) } });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.emailTemplate.update({
    where: { id: Number(id) },
    data: {
      ...(body.name     !== undefined && { name: body.name }),
      ...(body.subject  !== undefined && { subject: body.subject }),
      ...(body.body     !== undefined && { body: body.body }),
      ...(body.category !== undefined && { category: body.category || null }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const template = await prisma.emailTemplate.findUnique({ where: { id: Number(id) } });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.emailTemplate.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
