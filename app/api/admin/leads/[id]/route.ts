import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "fallback-secret-change-me"
  );
}

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    await prisma.lead.delete({ where: { id: leadId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const body = await req.json();
    const allowedFields = ["status", "priority", "assignedTo", "expectedValue", "nextFollowUpAt", "notes"];
    const data: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) data[key] = body[key];
    }
    const lead = await prisma.lead.update({ where: { id: leadId }, data });
    return NextResponse.json({ success: true, lead });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
