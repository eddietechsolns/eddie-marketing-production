import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
    return payload as { userId: number; email: string };
  } catch {
    return null;
  }
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = Number(id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, name: true,
      role: true, isActive: true,
      lastLoginAt: true, createdAt: true, updatedAt: true,
      activities: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, action: true, detail: true, ip: true, createdAt: true },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = Number(id);

  const body = await req.json() as {
    name?: string; email?: string; role?: string;
    isActive?: boolean; password?: string;
  };

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.email && body.email !== existing.email) {
    const conflict = await prisma.user.findUnique({ where: { email: body.email } });
    if (conflict) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  if (body.isActive === false && userId === session.userId) {
    return NextResponse.json({ error: "You cannot deactivate your own account" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (body.name     !== undefined) data.name     = body.name;
  if (body.email    !== undefined) data.email    = body.email;
  if (body.role     !== undefined) data.role     = body.role;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.password) {
    if (body.password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    data.password = await bcrypt.hash(body.password, 12);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true },
  });

  const changes: string[] = [];
  if (body.name     !== undefined && body.name !== existing.name) changes.push("name updated");
  if (body.email    !== undefined && body.email !== existing.email) changes.push("email updated");
  if (body.role     !== undefined && body.role !== existing.role) changes.push(`role changed to ${body.role}`);
  if (body.isActive !== undefined && body.isActive !== existing.isActive) {
    changes.push(body.isActive ? "account activated" : "account deactivated");
  }
  if (body.password) changes.push("password changed");

  if (changes.length) {
    await prisma.userActivity.create({
      data: {
        userId,
        action: "account_updated",
        detail: `${changes.join(", ")} — by ${session.email}`,
        ip: req.headers.get("x-forwarded-for") ?? undefined,
      },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = Number(id);

  if (userId === session.userId) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
