import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import { DeleteButton, ToggleStatusButton } from "@/components/admin/ActionButtons";
import { deletePortfolio, togglePortfolioStatus } from "@/lib/actions/portfolio";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Portfolio</h1>
        <Link href="/admin/portfolio/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-sm">No projects yet. <Link href="/admin/portfolio/new" className="text-blue-600 hover:underline">Create one</Link>.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/admin/portfolio/${project.id}`} className="hover:text-blue-600">{project.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{project.client ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{project.category?.name ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/portfolio/${project.id}`} className="text-sm text-gray-600 hover:text-gray-900">Edit</Link>
                      <ToggleStatusButton status={project.status} action={togglePortfolioStatus.bind(null, project.id, project.status)} />
                      <DeleteButton action={deletePortfolio.bind(null, project.id)} />
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
