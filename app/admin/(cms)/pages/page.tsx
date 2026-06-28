import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import { DeleteButton, ToggleStatusButton } from "@/components/admin/ActionButtons";
import { deletePage, togglePageStatus } from "@/lib/actions/pages";

export const metadata: Metadata = { title: "Pages" };

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Pages</h1>
        <Link href="/admin/pages/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          + New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <p className="text-gray-500 text-sm">No pages yet. <Link href="/admin/pages/new" className="text-blue-600 hover:underline">Create one</Link>.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/admin/pages/${page.id}`} className="hover:text-blue-600">{page.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{page.slug}</td>
                  <td className="px-4 py-3"><StatusBadge status={page.status} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{page.updatedAt.toLocaleDateString("en-US")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/pages/${page.id}`} className="text-sm text-gray-600 hover:text-gray-900">Edit</Link>
                      <ToggleStatusButton status={page.status} action={togglePageStatus.bind(null, page.id, page.status)} />
                      <DeleteButton action={deletePage.bind(null, page.id)} />
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
