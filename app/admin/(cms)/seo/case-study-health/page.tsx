import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CaseStudyHealthPage() {
  const all = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  });

  const published = all.filter((c) => c.status === "published");
  const drafts = all.filter((c) => c.status !== "published");
  const missingSeo = all.filter((c) => !c.seoTitle || !c.seoDescription);
  const missingMetrics = all.filter(
    (c) =>
      !c.trafficIncreasePercent &&
      !c.leadIncreasePercent &&
      !c.conversionIncreasePercent &&
      !c.revenueGenerated
  );
  const missingTestimonial = all.filter((c) => !c.testimonial);
  const missingImage = all.filter((c) => !c.featuredImage);
  const missingContent = all.filter(
    (c) => !c.challenge || !c.strategy || !c.results
  );

  const tiles = [
    { label: "Total Case Studies", value: all.length, color: "bg-slate-100 text-slate-700" },
    { label: "Published", value: published.length, color: "bg-green-100 text-green-700" },
    { label: "Draft", value: drafts.length, color: "bg-yellow-100 text-yellow-700" },
    { label: "Missing SEO", value: missingSeo.length, color: missingSeo.length > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700" },
    { label: "Missing Results Metrics", value: missingMetrics.length, color: missingMetrics.length > 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700" },
    { label: "Missing Testimonial", value: missingTestimonial.length, color: missingTestimonial.length > 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700" },
    { label: "Missing Featured Image", value: missingImage.length, color: missingImage.length > 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700" },
    { label: "Incomplete Content", value: missingContent.length, color: missingContent.length > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Case Study Health
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit your case studies for SEO and content completeness.
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          + New Case Study
        </Link>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`${tile.color} rounded-xl p-4 text-center`}
          >
            <p className="text-3xl font-bold">{tile.value}</p>
            <p className="text-xs font-medium mt-1">{tile.label}</p>
          </div>
        ))}
      </div>

      {/* Detail table */}
      {all.length === 0 ? (
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Title
                </th>
                <th className="text-center px-3 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-center px-3 py-3 font-medium text-gray-600">
                  SEO
                </th>
                <th className="text-center px-3 py-3 font-medium text-gray-600">
                  Metrics
                </th>
                <th className="text-center px-3 py-3 font-medium text-gray-600">
                  Content
                </th>
                <th className="text-center px-3 py-3 font-medium text-gray-600">
                  Testimonial
                </th>
                <th className="text-center px-3 py-3 font-medium text-gray-600">
                  Image
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {all.map((cs) => {
                const hasSeo = !!(cs.seoTitle && cs.seoDescription);
                const hasMetrics = !!(
                  cs.trafficIncreasePercent ||
                  cs.leadIncreasePercent ||
                  cs.conversionIncreasePercent ||
                  cs.revenueGenerated
                );
                const hasContent = !!(
                  cs.challenge &&
                  cs.strategy &&
                  cs.results
                );
                const hasTestimonial = !!cs.testimonial;
                const hasImage = !!cs.featuredImage;

                const score = [hasSeo, hasMetrics, hasContent, hasTestimonial, hasImage].filter(Boolean).length;
                const scoreColor =
                  score === 5
                    ? "text-green-600 font-bold"
                    : score >= 3
                    ? "text-yellow-600 font-semibold"
                    : "text-red-500 font-semibold";

                return (
                  <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/case-studies/${cs.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {cs.title}
                      </Link>
                      {cs.clientName && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {cs.clientName}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          cs.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {cs.status === "published" ? "Live" : "Draft"}
                      </span>
                    </td>
                    <HealthCell ok={hasSeo} />
                    <HealthCell ok={hasMetrics} />
                    <HealthCell ok={hasContent} />
                    <HealthCell ok={hasTestimonial} />
                    <HealthCell ok={hasImage} />
                    <td className={`px-4 py-3 text-right ${scoreColor}`}>
                      {score}/5
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

function HealthCell({ ok }: { ok: boolean }) {
  return (
    <td className="px-3 py-3 text-center">
      {ok ? (
        <svg
          className="w-4 h-4 text-green-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-red-400 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </td>
  );
}
