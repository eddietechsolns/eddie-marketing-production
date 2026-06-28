import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import { DeleteButton, ToggleStatusButton } from "@/components/admin/ActionButtons";
import { deleteLocation, toggleLocationStatus } from "@/lib/actions/locations";

export const metadata: Metadata = { title: "Locations" };

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({ orderBy: [{ state: "asc" }, { city: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Locations</h1>
        <Link href="/admin/locations/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          + New Location
        </Link>
      </div>

      {locations.length === 0 ? (
        <p className="text-gray-500 text-sm">No locations yet. <Link href="/admin/locations/new" className="text-blue-600 hover:underline">Create one</Link>.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">City, State</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/admin/locations/${loc.id}`} className="hover:text-blue-600">{loc.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {[loc.city, loc.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={loc.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/locations/${loc.id}`} className="text-sm text-gray-600 hover:text-gray-900">Edit</Link>
                      <ToggleStatusButton status={loc.status} action={toggleLocationStatus.bind(null, loc.id, loc.status)} />
                      <DeleteButton action={deleteLocation.bind(null, loc.id)} />
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
