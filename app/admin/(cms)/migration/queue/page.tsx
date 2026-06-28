import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Content Import Queue" };

const STATUS_COLORS: Record<string, string> = {
  none: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  imported: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

type ContentType = "pages" | "posts" | "services" | "portfolio" | "industries" | "locations";

async function getItems(type: ContentType) {
  switch (type) {
    case "pages":
      return (await prisma.page.findMany({
        select: { id: true, title: true, slug: true, importStatus: true, legacyWpId: true, legacyUrl: true, migrationNotes: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })).map((r) => ({ ...r, editHref: `/admin/pages/${r.id}` }));
    case "posts":
      return (await prisma.blogPost.findMany({
        select: { id: true, title: true, slug: true, importStatus: true, legacyWpId: true, legacyUrl: true, migrationNotes: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })).map((r) => ({ ...r, editHref: `/admin/posts/${r.id}` }));
    case "services":
      return (await prisma.service.findMany({
        select: { id: true, title: true, slug: true, importStatus: true, legacyWpId: true, legacyUrl: true, migrationNotes: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })).map((r) => ({ ...r, editHref: `/admin/services/${r.id}` }));
    case "portfolio":
      return (await prisma.portfolioProject.findMany({
        select: { id: true, title: true, slug: true, importStatus: true, legacyWpId: true, legacyUrl: true, migrationNotes: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })).map((r) => ({ ...r, editHref: `/admin/portfolio/${r.id}` }));
    case "industries":
      return (await prisma.industry.findMany({
        select: { id: true, title: true, slug: true, importStatus: true, legacyWpId: true, legacyUrl: true, migrationNotes: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })).map((r) => ({ ...r, editHref: `/admin/industries/${r.id}` }));
    case "locations":
      return (await prisma.location.findMany({
        select: { id: true, title: true, slug: true, importStatus: true, legacyWpId: true, legacyUrl: true, migrationNotes: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })).map((r) => ({ ...r, editHref: `/admin/locations/${r.id}` }));
  }
}

const TYPE_LABELS: Record<ContentType, string> = {
  pages: "Pages",
  posts: "Blog Posts",
  services: "Services",
  portfolio: "Portfolio",
  industries: "Industries",
  locations: "Locations",
};

export default async function ImportQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: rawType } = await searchParams;
  const type: ContentType = (rawType as ContentType) ?? "posts";
  const items = await getItems(type);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/migration" className="text-sm text-gray-500 hover:text-gray-700">← Migration</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Content Import Queue</h1>
      </div>

      {/* Type tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {(Object.entries(TYPE_LABELS) as [ContentType, string][]).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/migration/queue?type=${key}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              type === key
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">{TYPE_LABELS[type]}</h2>
          <span className="text-xs text-gray-500">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-500">No items found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">WP ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Legacy URL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Notes</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.legacyWpId ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate" title={item.legacyUrl ?? ""}>
                    {item.legacyUrl ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[item.importStatus]}`}>
                      {item.importStatus === "none" ? "Not Started" : item.importStatus.charAt(0).toUpperCase() + item.importStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate" title={item.migrationNotes ?? ""}>
                    {item.migrationNotes ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={item.editHref} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
