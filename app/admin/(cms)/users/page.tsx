import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserTable from "@/components/admin/UserTable";
import { ROLES } from "@/lib/userRoles";

export const metadata: Metadata = { title: "User Management" };

interface PageProps {
  searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string }>;
}

type UserRow = {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const q          = sp.q?.trim() ?? "";
  const roleFilter = sp.role ?? "";
  const status     = sp.status ?? "";
  const page       = Math.max(1, Number(sp.page ?? "1"));
  const pageSize   = 20;

  // Base filter — only uses columns guaranteed in the original schema.
  const baseWhere: Record<string, unknown> = {};
  if (q) {
    baseWhere.OR = [
      { name:  { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  // Extended filter — adds role/isActive only when those columns exist.
  const extendedWhere = { ...baseWhere } as Record<string, unknown>;
  if (roleFilter)              extendedWhere.role     = roleFilter;
  if (status === "active")     extendedWhere.isActive = true;
  if (status === "inactive")   extendedWhere.isActive = false;

  const pagination = {
    orderBy: { createdAt: "desc" } as const,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  let total = 0;
  let users: UserRow[] = [];

  try {
    // Attempt with extended columns (role, isActive, lastLoginAt).
    const [t, rawUsers] = await Promise.all([
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
    total = t;
    users = rawUsers.map((u) => ({
      ...u,
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      createdAt:   u.createdAt.toISOString(),
    }));
  } catch {
    // Extended columns not present — fall back to base schema and supply defaults.
    const [t, rawUsers] = await Promise.all([
      prisma.user.count({ where: baseWhere }),
      prisma.user.findMany({
        where: baseWhere,
        select: { id: true, email: true, name: true, createdAt: true },
        ...pagination,
      }),
    ]);
    total = t;
    users = rawUsers.map((u) => ({
      id:          u.id,
      email:       u.email,
      name:        u.name,
      createdAt:   u.createdAt.toISOString(),
      role:        "admin",
      isActive:    true,
      lastLoginAt: null,
    }));
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.email },
    select: { id: true },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} user{total !== 1 ? "s" : ""} total</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add User
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search name or email…"
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>

        <select
          name="role"
          defaultValue={roleFilter}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={status}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Search
        </button>

        {(q || roleFilter || status) && (
          <Link
            href="/admin/users"
            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      <UserTable
        users={users}
        total={total}
        page={page}
        pageSize={pageSize}
        q={q}
        role={roleFilter}
        status={status}
        currentUserId={currentUser?.id ?? -1}
      />
    </div>
  );
}
