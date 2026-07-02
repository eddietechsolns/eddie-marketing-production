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

// Shape returned to the client — extended fields may be defaulted when
// the production database has not yet received the schema additions.
type UserRow = {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  role: string;
  isActive: boolean;
  lastLoginAt: Date | null;
};

void isSuperAdmin; // imported for potential guard use

export async function GET(req: NextRequest) {
  const session = await getAuthedUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q        = searchParams.get("q")?.trim() ?? "";
  const role     = searchParams.get("role") ?? "";
  const status   = searchParams.get("status") ?? "";
  const page     = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "20")));

  // Base where — only uses columns that exist in the original schema.
  const baseWhere: Record<string, unknown> = {};
  if (q) {
    baseWhere.OR = [
      { name:  { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  // Extended where — adds role / isActive filters only when columns exist.
  const extendedWhere = { ...baseWhere } as Record<string, unknown>;
  if (role)                       extendedWhere.role     = role;
  if (status === "active")        extendedWhere.isActive = true;
  if (status === "inactive")      extendedWhere.isActive = false;

  const pagination = {
    orderBy: { createdAt: "desc" } as const,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  let users: UserRow[];
  let total: number;

  try {
    // Attempt the full query with extended columns.
    [total, users] = await Promise.all([
      prisma.user.count({ where: extendedWhere }),
      prisma.user.findMany({
        where: extendedWhere,
        select: {
          id: true, email: true, name: true,
          role: true, isActive: true,
          lastLoginAt: true, createdAt: true,
        },
        ...pagination,
      }),
    ]);
  } catch {
    // Extended columns not present in the database yet — fall back to base schema.
    // role / isActive / lastLoginAt are defaulted so the UI still renders correctly.
    const [baseTotal, baseUsers] = await Promise.all([
      prisma.user.count({ where: baseWhere }),
      prisma.user.findMany({
        where: baseWhere,
        select: { id: true, email: true, name: true, createdAt: true },
        ...pagination,
      }),
    ]);
    total = baseTotal;
    users = baseUsers.map((u) => ({
      ...u,
      role: "admin",
      isActive: true,
      lastLoginAt: null,
    }));
  }

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

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  let user: UserRow;
  try {
    // Attempt to create with extended columns (role, isActive).
    user = await prisma.user.create({
      data: { name: name ?? null, email, password: hashed, role, isActive: true },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true, lastLoginAt: true },
    });
  } catch {
    // Extended columns not present — create with base fields only.
    const base = await prisma.user.create({
      data: { name: name ?? null, email, password: hashed },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    user = { ...base, role, isActive: true, lastLoginAt: null };
  }

  // Optional audit — safe to fail if UserActivity does not yet exist.
  await prisma.userActivity.create({
    data: {
      userId: user.id,
      action: "account_created",
      detail: `Account created by ${session.email}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    },
  }).catch(() => {});

  return NextResponse.json(user, { status: 201 });
}
