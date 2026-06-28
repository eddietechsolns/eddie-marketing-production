import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import { DeleteButton, ToggleStatusButton } from "@/components/admin/ActionButtons";
import {
  deleteServiceCategory,
  toggleServiceCategoryStatus,
} from "@/lib/actions/service-categories";

export const metadata: Metadata = { title: "Service Categories" };

export default async function AdminServiceCategoriesPage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { services: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Service Categories</h1>
        <Link
          href="/admin/service-categories/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          + New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No categories yet.{" "}
          <Link href="/admin/service-categories/new" className="text-blue-600 hover:underline">
            Create one
          </Link>
          .
        </p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Services
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link
                      href={`/admin/service-categories/${cat.id}`}
                      className="hover:text-blue-600"
                    >
                      {cat.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{cat._count.services}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={cat.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/service-categories/${cat.id}`}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                      <ToggleStatusButton
                        status={cat.status}
                        action={toggleServiceCategoryStatus.bind(null, cat.id, cat.status)}
                      />
                      <DeleteButton action={deleteServiceCategory.bind(null, cat.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
