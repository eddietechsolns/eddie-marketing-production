import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { newPassword?: string };
  const { newPassword } = body;

  if (!newPassword || newPassword.trim().length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 12);

  // Update the password (always safe — uses base columns only).
  await prisma.user.update({
    where: { id: session.userId },
    data: { password: hashed },
  });

  // Clear the mustChangePassword flag in the DB — safe to fail if column doesn't exist.
  await prisma.user.update({
    where: { id: session.userId },
    data: { mustChangePassword: false },
  }).catch(() => {});

  // Optional audit entry.
  await prisma.userActivity.create({
    data: {
      userId: session.userId,
      action: "password_changed",
      detail: "Password changed via forced change-password flow",
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    },
  }).catch(() => {});

  // Issue a new JWT without the mustChangePassword claim so the middleware
  // no longer redirects the user to the change-password page.
  const newToken = await createToken({
    userId: session.userId,
    email: session.email,
    name: session.name,
    mustChangePassword: false,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin-token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
