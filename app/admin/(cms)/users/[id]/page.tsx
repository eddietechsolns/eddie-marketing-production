import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserForm from "@/components/admin/forms/UserForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) }, select: { name: true, email: true } });
  return { title: user ? `Edit ${user.name ?? user.email}` : "Edit User" };
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true, email: true, name: true,
      role: true, isActive: true,
      lastLoginAt: true, createdAt: true,
      activities: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, action: true, detail: true, ip: true, createdAt: true },
      },
    },
  });

  if (!user) notFound();

  const serialized = {
    ...user,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    activities: user.activities.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/users"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {user.name ?? user.email}
          </h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <UserForm user={serialized} />
    </div>
  );
}
