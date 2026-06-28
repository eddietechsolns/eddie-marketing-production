import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import { DeleteButton, ToggleStatusButton } from "@/components/admin/ActionButtons";
import { deleteService, toggleServiceStatus } from "@/lib/actions/services";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ title: "asc" }],
    include: { category: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Services</h1>
        <Link href="/admin/services/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          + New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-500 text-sm">No services yet. <Link href="/admin/services/new" className="text-blue-600 hover:underline">Create one</Link>.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/admin/services/${service.id}`} className="hover:text-blue-600">{service.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{service.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{service.slug}</td>
                  <td className="px-4 py-3"><StatusBadge status={service.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/services/${service.id}`} className="text-sm text-gray-600 hover:text-gray-900">Edit</Link>
                      <ToggleStatusButton status={service.status} action={toggleServiceStatus.bind(null, service.id, service.status)} />
                      <DeleteButton action={deleteService.bind(null, service.id)} />
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
