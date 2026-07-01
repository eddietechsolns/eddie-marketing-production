import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/userRoles";

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
    return payload as { userId: number; email: string; role?: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q      = searchParams.get("q")?.trim() ?? "";
  const role   = searchParams.get("role") ?? "";
  const status = searchParams.get("status") ?? "";
  const page   = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "20")));

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { name:  { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  if (role)   where.role     = role;
  if (status === "active")   where.isActive = true;
  if (status === "inactive") where.isActive = false;

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, name: true,
        role: true, isActive: true,
        lastLoginAt: true, createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ users, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    name?: string; email?: string; password?: string; role?: string;
  };

  const { name, email, password, role = "editor" } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name: name ?? null, email, password: hashed, role, isActive: true },
    select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
  });

  await prisma.userActivity.create({
    data: {
      userId: user.id,
      action: "account_created",
      detail: `Account created by ${session.email}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
