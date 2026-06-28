import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteRedirect } from "@/lib/actions/redirects";

export const metadata: Metadata = { title: "Redirects" };

export default async function RedirectsPage() {
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Redirects</h1>
        <Link
          href="/admin/redirects/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Redirect
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {redirects.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-500 mb-3">No redirects configured yet.</p>
            <Link href="/admin/redirects/new" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Add your first redirect →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Source URL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Target URL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Notes</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {redirects.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-700 max-w-[200px] truncate" title={r.sourceUrl}>
                    {r.sourceUrl}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate" title={r.targetUrl}>
                    {r.targetUrl}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.statusCode === 301 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {r.statusCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px] truncate" title={r.notes ?? ""}>
                    {r.notes ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/redirects/${r.id}`} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Edit
                      </Link>
                      <form action={async () => { "use server"; await deleteRedirect(r.id); }}>
                        <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-medium">
                          Delete
                        </button>
                      </form>
                    </div>
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
