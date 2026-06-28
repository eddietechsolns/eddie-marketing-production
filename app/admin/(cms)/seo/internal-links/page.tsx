import type { Metadata } from "next";
import Link from "next/link";
import { getAdminClusterSummaries, contentUrl } from "@/lib/internal-links";
import { CLUSTERS } from "@/lib/cluster-analysis";

export const metadata: Metadata = { title: "Internal Links | SEO" };

// ─── Color helpers (static strings — Tailwind v4 safe) ───────────────────────

const CLUSTER_COLOR_MAP: Record<string, { dot: string; badge: string }> = {
  blue:    { dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 border-blue-200"   },
  orange:  { dot: "bg-orange-500",  badge: "bg-orange-50 text-orange-700 border-orange-200" },
  purple:  { dot: "bg-purple-500",  badge: "bg-purple-50 text-purple-700 border-purple-200" },
  teal:    { dot: "bg-teal-500",    badge: "bg-teal-50 text-teal-700 border-teal-200"   },
  green:   { dot: "bg-green-500",   badge: "bg-green-50 text-green-700 border-green-200" },
  rose:    { dot: "bg-rose-500",    badge: "bg-rose-50 text-rose-700 border-rose-200"   },
  red:     { dot: "bg-red-500",     badge: "bg-red-50 text-red-700 border-red-200"     },
  indigo:  { dot: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  pink:    { dot: "bg-pink-500",    badge: "bg-pink-50 text-pink-700 border-pink-200"   },
  yellow:  { dot: "bg-yellow-500",  badge: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  amber:   { dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default async function InternalLinksPage() {
  const { summaries, uncategorized, totalAssigned, totalUncategorized } =
    await getAdminClusterSummaries();

  const totalClusters = summaries.length;
  const totalAll = totalAssigned + totalUncategorized;
  const coveragePct =
    totalAll > 0 ? Math.round((totalAssigned / totalAll) * 100) : 0;
  const emptyClusters = CLUSTERS.filter(
    (c) => !summaries.find((s) => s.clusterId === c.id),
  );
  const singleMemberClusters = summaries.filter((s) => s.isSingleMember);

  // Pages with "no incoming links" = uncategorized + single-member clusters
  // (no cluster peer will link to them via internal link blocks)
  const noIncomingCount =
    totalUncategorized + singleMemberClusters.reduce((s, c) => s + c.total, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Internal Links</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Cluster-based internal linking coverage. Blocks are appended to pages at render time — no
          content is modified.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <Tile label="Total Indexed" value={totalAll} sub="pages + posts" color="gray" />
        <Tile
          label="Cluster Coverage"
          value={`${coveragePct}%`}
          sub={`${totalAssigned} assigned`}
          color={coveragePct >= 80 ? "emerald" : coveragePct >= 50 ? "amber" : "red"}
        />
        <Tile
          label="Active Clusters"
          value={totalClusters}
          sub={`${emptyClusters.length} empty`}
          color="blue"
        />
        <Tile
          label="Orphaned Pages"
          value={totalUncategorized}
          sub="no cluster match"
          color={totalUncategorized === 0 ? "emerald" : "orange"}
          warn
        />
        <Tile
          label="No Incoming Links"
          value={noIncomingCount}
          sub="orphaned + isolated"
          color={noIncomingCount === 0 ? "emerald" : "red"}
          warn
        />
      </div>

      {/* Template coverage note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="text-sm text-blue-800">
          <span className="font-semibold">Link blocks are applied to:</span>{" "}
          Service Category pages · Service Detail pages · Blog Detail pages · Industry Detail pages · Location Detail pages.
          Each block shows the cluster pillar, supporting pages, related blog posts, and cross-silo service links.
          No content body is modified.
        </div>
      </div>

      {/* Per-cluster table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Cluster Coverage</p>
          <p className="text-xs text-gray-400">Sorted by total content assigned</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-8" />
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Cluster</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Pillar Page</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Pages</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Posts</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="px-5 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Override</th>
                <th className="px-5 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {summaries
                .sort((a, b) => b.total - a.total)
                .map((s) => {
                  const clusterDef = CLUSTERS.find((c) => c.id === s.clusterId);
                  const colors = clusterDef
                    ? (CLUSTER_COLOR_MAP[clusterDef.color] ?? CLUSTER_COLOR_MAP.blue)
                    : CLUSTER_COLOR_MAP.blue;

                  return (
                    <tr key={s.clusterId} className="hover:bg-gray-50/60">
                      <td className="pl-5 py-3">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${colors.badge}`}>
                          {s.clusterName}
                        </span>
                      </td>
                      <td className="px-5 py-3 max-w-xs">
                        {s.pillar ? (
                          <Link
                            href={contentUrl(s.pillar)}
                            target="_blank"
                            className="text-sm text-blue-600 hover:text-blue-800 line-clamp-1"
                          >
                            {s.pillar.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic text-xs">None detected</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-600">{s.pageCount}</td>
                      <td className="px-5 py-3 text-right font-mono text-gray-600">{s.postCount}</td>
                      <td className="px-5 py-3 text-right font-mono font-semibold text-gray-800">{s.total}</td>
                      <td className="px-5 py-3 text-center">
                        {s.pillarIsOverridden ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Manual</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Auto</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {s.isSingleMember ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700" title="Only one page in this cluster — it has no cluster peers to receive links from">
                            Isolated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={5} className="px-5 py-3 font-semibold text-gray-700">Totals</td>
                <td className="px-5 py-3 text-right font-semibold font-mono text-gray-800">{totalAssigned}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Empty clusters */}
      {emptyClusters.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">
              Empty Clusters — No Content Assigned ({emptyClusters.length})
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {emptyClusters.map((c) => {
                const colors = CLUSTER_COLOR_MAP[c.color] ?? CLUSTER_COLOR_MAP.blue;
                return (
                  <span
                    key={c.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {c.name}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              These clusters have no matching content. Add pages or blog posts with relevant keywords to populate them.
            </p>
          </div>
        </div>
      )}

      {/* Isolated clusters (single-member) */}
      {singleMemberClusters.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <p className="text-sm font-semibold text-amber-800 mb-2">
            Isolated Clusters — Single Member ({singleMemberClusters.length})
          </p>
          <p className="text-xs text-amber-700 mb-3">
            These clusters have only one page or post. Their internal link blocks will show cross-silo and pillar links
            but no supporting-page links since there are no cluster peers.
          </p>
          <div className="flex flex-wrap gap-2">
            {singleMemberClusters.map((s) => (
              <span key={s.clusterId} className="inline-flex items-center px-2.5 py-1 rounded bg-amber-100 border border-amber-300 text-xs font-medium text-amber-800">
                {s.clusterName} — {s.pillar?.title ?? "no pillar"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Orphaned / uncategorized pages */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Orphaned Pages — No Cluster Match ({totalUncategorized})
          </p>
          <span className="text-xs text-gray-400">
            These pages have no internal link blocks and receive no incoming links
          </span>
        </div>
        {uncategorized.length === 0 ? (
          <p className="px-5 py-6 text-sm text-emerald-600 font-medium">
            All pages are assigned to a cluster.
          </p>
        ) : (
          <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {uncategorized.map((item) => (
              <div key={`${item.kind}-${item.id}`} className="px-5 py-2.5 flex items-center justify-between hover:bg-gray-50">
                <div className="min-w-0">
                  <Link
                    href={item.kind === "post" ? `/blog/${item.slug}` : `/${item.slug}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-800 line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-gray-400">/{item.slug}</p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.kind === "post" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                    {item.kind === "post" ? "Blog post" : "Page"}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tile sub-component ────────────────────────────────────────────────────────

function Tile({
  label,
  value,
  sub,
  color,
  warn = false,
}: {
  label: string;
  value: number | string;
  sub: string;
  color: "gray" | "emerald" | "red" | "orange" | "amber" | "blue";
  warn?: boolean;
}) {
  const COLORS = {
    gray:    { border: "border-gray-200",    bg: "bg-white",       num: "text-gray-900"    },
    emerald: { border: "border-emerald-200",  bg: "bg-emerald-50",  num: "text-emerald-700"  },
    red:     { border: "border-red-200",      bg: "bg-red-50",      num: "text-red-700"      },
    orange:  { border: "border-orange-200",   bg: "bg-orange-50",   num: "text-orange-700"   },
    amber:   { border: "border-amber-200",    bg: "bg-amber-50",    num: "text-amber-700"    },
    blue:    { border: "border-blue-200",     bg: "bg-blue-50",     num: "text-blue-700"     },
  };
  const c = COLORS[color];
  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-4`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${c.num}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
