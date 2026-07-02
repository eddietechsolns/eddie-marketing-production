import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

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

    // Explicit select — only queries columns guaranteed to exist in the base schema.
    // This avoids "column does not exist" errors when role/isActive/lastLoginAt
    // have not yet been added to the production database.
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, name: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Optional enrichment — safe to fail if the column does not yet exist.
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {});

    // Optional audit trail — safe to fail if UserActivity does not yet exist.
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: "login",
        detail: `Logged in`,
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
