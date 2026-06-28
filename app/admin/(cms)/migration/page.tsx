import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Migration Dashboard" };

const STATUS_LABELS: Record<string, string> = {
  none: "Not Started",
  pending: "Pending",
  imported: "Imported",
  failed: "Failed",
};

const STATUS_COLORS: Record<string, string> = {
  none: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  imported: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

async function getStats() {
  const [pages, posts, services, portfolio, industries, locations, redirects] = await Promise.all([
    prisma.page.groupBy({ by: ["importStatus"], _count: { _all: true } }),
    prisma.blogPost.groupBy({ by: ["importStatus"], _count: { _all: true } }),
    prisma.service.groupBy({ by: ["importStatus"], _count: { _all: true } }),
    prisma.portfolioProject.groupBy({ by: ["importStatus"], _count: { _all: true } }),
    prisma.industry.groupBy({ by: ["importStatus"], _count: { _all: true } }),
    prisma.location.groupBy({ by: ["importStatus"], _count: { _all: true } }),
    prisma.redirect.count(),
  ]);

  return { pages, posts, services, portfolio, industries, locations, redirects };
}

function toMap(rows: { importStatus: string; _count: { _all: number } }[]) {
  const m: Record<string, number> = { none: 0, pending: 0, imported: 0, failed: 0 };
  rows.forEach((r) => { m[r.importStatus] = r._count._all; });
  return m;
}

function total(m: Record<string, number>) {
  return Object.values(m).reduce((a, b) => a + b, 0);
}

export default async function MigrationDashboardPage() {
  const stats = await getStats();

  const sections = [
    { label: "Pages", map: toMap(stats.pages), href: "/admin/migration/queue?type=pages" },
    { label: "Blog Posts", map: toMap(stats.posts), href: "/admin/migration/queue?type=posts" },
    { label: "Services", map: toMap(stats.services), href: "/admin/migration/queue?type=services" },
    { label: "Portfolio", map: toMap(stats.portfolio), href: "/admin/migration/queue?type=portfolio" },
    { label: "Industries", map: toMap(stats.industries), href: "/admin/migration/queue?type=industries" },
    { label: "Locations", map: toMap(stats.locations), href: "/admin/migration/queue?type=locations" },
  ];

  const globalTotal = sections.reduce((a, s) => a + total(s.map), 0);
  const globalImported = sections.reduce((a, s) => a + (s.map.imported ?? 0), 0);
  const globalPending = sections.reduce((a, s) => a + (s.map.pending ?? 0), 0);
  const globalFailed = sections.reduce((a, s) => a + (s.map.failed ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Migration Dashboard</h1>
        <Link
          href="/admin/migration/queue"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Import Queue
        </Link>
      </div>

      {/* Global summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Items", value: globalTotal, color: "text-gray-900" },
          { label: "Imported", value: globalImported, color: "text-green-600" },
          { label: "Pending", value: globalPending, color: "text-yellow-600" },
          { label: "Failed", value: globalFailed, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Per content-type breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">Content by Type</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Content Type</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Imported</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Pending</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Failed</th>
              <th className="text-right px-5 py-3 font-medium text-gray-600">Not Started</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sections.map((s) => (
              <tr key={s.label} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">
                  <Link href={s.href} className="hover:text-blue-600">{s.label}</Link>
                </td>
                <td className="text-right px-4 py-3 text-gray-700">{total(s.map)}</td>
                <td className="text-right px-4 py-3 text-green-600 font-medium">{s.map.imported}</td>
                <td className="text-right px-4 py-3 text-yellow-600 font-medium">{s.map.pending}</td>
                <td className="text-right px-4 py-3 text-red-600 font-medium">{s.map.failed}</td>
                <td className="text-right px-5 py-3 text-gray-500">{s.map.none}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Redirect summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Redirects Configured</p>
          <p className="text-3xl font-bold text-gray-900">{stats.redirects}</p>
        </div>
        <Link href="/admin/redirects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Manage Redirects →
        </Link>
      </div>

      {/* Status legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <span key={key} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[key]}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
