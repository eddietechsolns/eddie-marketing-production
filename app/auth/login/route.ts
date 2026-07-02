import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

// Bootstrap admin defaults — must match lib/bootstrap.ts.
const BOOTSTRAP_ADMIN_EMAIL = "admin@eddietechsolns.com";
const BOOTSTRAP_ADMIN_PASS  = "ChangeMe123!";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ------------------------------------------------------------------
    // Determine whether this user must change their password.
    //
    // Layer 1 — raw SQL: bypasses the Prisma ORM schema validator, which
    //   may reject new columns when the client singleton was initialised
    //   before the schema was updated.
    // Layer 2 — bcrypt fallback: if the bootstrap admin is still using
    //   the default password the answer is always "yes", zero DB overhead.
    // ------------------------------------------------------------------
    let mustChange = false;

    try {
      const rows = await prisma.$queryRawUnsafe<Array<{ mustChangePassword: boolean }>>(
        'SELECT "mustChangePassword" FROM "User" WHERE id = $1 LIMIT 1',
        user.id
      );
      if (rows.length > 0) {
        mustChange = Boolean(rows[0].mustChangePassword);
      }
    } catch {
      // Column not yet present — use bcrypt fallback below.
    }

    if (!mustChange && user.email === BOOTSTRAP_ADMIN_EMAIL) {
      mustChange = await bcrypt.compare(BOOTSTRAP_ADMIN_PASS, user.password);
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      mustChangePassword: mustChange,
    });

    // Optional enrichments — both safe to fail.
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {});

    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: "login",
        detail: "Logged in",
        ip: request.headers.get("x-forwarded-for") ?? undefined,
      },
    }).catch(() => {});

    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
