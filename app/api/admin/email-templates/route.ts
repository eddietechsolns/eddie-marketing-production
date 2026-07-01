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

export async function GET(_req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const templates = await prisma.emailTemplate.findMany({
    where: { isActive: true },
    orderBy: [{ usageCount: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    name?: string; subject?: string; body?: string; category?: string;
  };

  if (!body.name?.trim())    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!body.subject?.trim()) return NextResponse.json({ error: "Subject is required" }, { status: 400 });

  const template = await prisma.emailTemplate.create({
    data: {
      name: body.name.trim(),
      subject: body.subject.trim(),
      body: body.body ?? "",
      category: body.category?.trim() || null,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
