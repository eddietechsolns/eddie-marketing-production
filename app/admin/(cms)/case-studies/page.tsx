import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleCaseStudyStatus, deleteCaseStudy } from "@/lib/actions/case-studies";

export const dynamic = "force-dynamic";

export default async function CaseStudiesListPage() {
  const caseStudies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  });

  const published = caseStudies.filter((c) => c.status === "published").length;
  const drafts = caseStudies.filter((c) => c.status !== "published").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Case Studies</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {published} published · {drafts} draft
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          + New Case Study
        </Link>
      </div>

      {caseStudies.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No case studies yet.</p>
          <Link
            href="/admin/case-studies/new"
            className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first case study →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Industry</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Metrics</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {caseStudies.map((cs) => {
                const metricCount = [
                  cs.trafficIncreasePercent,
                  cs.leadIncreasePercent,
                  cs.conversionIncreasePercent,
                  cs.revenueGenerated,
                ].filter(Boolean).length;

                return (
                  <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/case-studies/${cs.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {cs.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">/case-studies/{cs.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cs.clientName ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cs.industry ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cs.serviceType ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cs.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {cs.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          metricCount >= 3
                            ? "text-green-600"
                            : metricCount >= 1
                            ? "text-yellow-600"
                            : "text-red-400"
                        }`}
                      >
                        {metricCount}/4
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/case-studies/${cs.id}`}
                          className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          Edit
                        </Link>
                        {cs.status === "published" && (
                          <Link
                            href={`/case-studies/${cs.slug}`}
                            target="_blank"
                            className="text-xs text-gray-500 hover:text-green-600 transition-colors"
                          >
                            View ↗
                          </Link>
                        )}
                        <form
                          action={async () => {
                            "use server";
                            await toggleCaseStudyStatus(cs.id, cs.status);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-gray-500 hover:text-orange-600 transition-colors"
                          >
                            {cs.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await deleteCaseStudy(cs.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-400 hover:text-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
