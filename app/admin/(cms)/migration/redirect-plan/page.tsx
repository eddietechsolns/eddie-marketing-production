import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  computeActionPlan,
  runClusterAnalysis,
  type ActionLabel,
  type ClusterId,
} from "@/lib/cluster-analysis";

export const metadata: Metadata = { title: "Redirect Plan | Admin" };

// ─── Types ────────────────────────────────────────────────────────────────────

type RedirectRec = "Keep Current URL" | "Redirect to Pillar" | "Redirect to Supporting Page" | "Manual Review";

type PlanRow = {
  kind: "page" | "post";
  title: string;
  slug: string;
  clusterId: ClusterId | "uncategorized";
  clusterName: string;
  action: ActionLabel;
  legacyUrl: string | null;
  currentUrl: string;
  suggestedFutureUrl: string;
  redirectRec: RedirectRec;
};

// ─── URL logic ────────────────────────────────────────────────────────────────

// Only page clusters get restructured URLs; posts always stay at /blog/[slug]
const PAGE_URL_PREFIXES: Partial<Record<ClusterId, string>> = {
  "seo":               "/services/seo",
  "ppc":               "/services/google-ads",
  "social-media":      "/services/social-media",
  "web-design":        "/services/web-development",
  "content-marketing": "/services/content-marketing",
  "analytics":         "/services/analytics",
  "ecommerce":         "/services/ecommerce",
  "dubai-market":      "/locations/dubai",
};

function currentUrl(kind: "page" | "post", slug: string): string {
  return kind === "post" ? `/blog/${slug}` : `/${slug}`;
}

function suggestedUrl(
  kind: "page" | "post",
  slug: string,
  clusterId: ClusterId | "uncategorized",
): string {
  if (kind === "post") return `/blog/${slug}`;
  if (clusterId === "uncategorized") return "Manual Review";
  const prefix = PAGE_URL_PREFIXES[clusterId as ClusterId];
  return prefix ? `${prefix}/${slug}` : "Manual Review";
}

function redirectRec(action: ActionLabel, futureUrl: string): RedirectRec {
  if (action === "Keep as Pillar")     return "Keep Current URL";
  if (action === "Redirect Later")     return "Redirect to Pillar";
  if (action === "Merge Later")        return "Redirect to Pillar";
  if (action === "Needs Manual Review" || futureUrl === "Manual Review") return "Manual Review";
  // Keep as Supporting or Expand Later: legacy/current URL should redirect to the (new) supporting page
  return "Redirect to Supporting Page";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const REC_STYLES: Record<RedirectRec, { badge: string; dot: string }> = {
  "Keep Current URL":          { badge: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
  "Redirect to Supporting Page": { badge: "bg-blue-100 text-blue-800",    dot: "bg-blue-500"    },
  "Redirect to Pillar":        { badge: "bg-amber-100 text-amber-800",    dot: "bg-amber-500"   },
  "Manual Review":             { badge: "bg-gray-100 text-gray-600",      dot: "bg-gray-400"    },
};

const ACTION_BADGE: Record<ActionLabel, string> = {
  "Keep as Pillar":      "bg-emerald-100 text-emerald-800",
  "Keep as Supporting":  "bg-sky-100 text-sky-800",
  "Merge Later":         "bg-yellow-100 text-yellow-800",
  "Expand Later":        "bg-orange-100 text-orange-800",
  "Redirect Later":      "bg-red-100 text-red-800",
  "Needs Manual Review": "bg-gray-100 text-gray-600",
};

const CLUSTER_BORDER: Record<string, string> = {
  blue:   "border-l-blue-500",
  orange: "border-l-orange-500",
  purple: "border-l-purple-500",
  teal:   "border-l-teal-500",
  green:  "border-l-green-500",
  rose:   "border-l-rose-500",
  red:    "border-l-red-500",
  indigo: "border-l-indigo-500",
  pink:   "border-l-pink-500",
  yellow: "border-l-yellow-500",
  amber:  "border-l-amber-500",
  gray:   "border-l-gray-400",
};

const ALL_RECS: RedirectRec[] = [
  "Keep Current URL", "Redirect to Supporting Page", "Redirect to Pillar", "Manual Review",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RedirectPlanPage() {
  // 1. Cluster analysis
  const { clusterMap, uncategorized } = await runClusterAnalysis();
  const actionPlan = computeActionPlan(clusterMap, uncategorized);

  // 2. Fetch legacy URLs (lightweight join)
  const [pageLegacy, postLegacy] = await Promise.all([
    prisma.$queryRawUnsafe<{ id: number; legacyUrl: string | null }[]>(
      `SELECT id, "legacyUrl" FROM "Page"`
    ),
    prisma.$queryRawUnsafe<{ id: number; legacyUrl: string | null }[]>(
      `SELECT id, "legacyUrl" FROM "BlogPost"`
    ),
  ]);

  const legacyMap = new Map<string, string | null>();
  for (const r of pageLegacy) legacyMap.set(`page-${r.id}`, r.legacyUrl);
  for (const r of postLegacy) legacyMap.set(`post-${r.id}`, r.legacyUrl);

  // 3. Build plan rows
  const rows: PlanRow[] = actionPlan.map(ai => {
    const item = ai.item;
    const legUrl = legacyMap.get(`${item.kind}-${item.id}`) ?? null;
    const currUrl = currentUrl(item.kind, item.slug);
    const futureUrl = suggestedUrl(item.kind, item.slug, ai.clusterId);
    const rec = redirectRec(ai.action, futureUrl);
    return {
      kind: item.kind,
      title: item.title,
      slug: item.slug,
      clusterId: ai.clusterId,
      clusterName: ai.clusterName,
      action: ai.action,
      legacyUrl: legUrl,
      currentUrl: currUrl,
      suggestedFutureUrl: futureUrl,
      redirectRec: rec,
    };
  });

  // 4. Summary counts
  const recCounts = new Map<RedirectRec, number>();
  for (const r of rows) recCounts.set(r.redirectRec, (recCounts.get(r.redirectRec) ?? 0) + 1);

  // 5. Group by cluster for display
  const byCluster = new Map<string, PlanRow[]>();
  for (const row of rows) {
    const key = row.clusterId;
    if (!byCluster.has(key)) byCluster.set(key, []);
    byCluster.get(key)!.push(row);
  }

  const redirectsNeeded = rows.filter(r => r.legacyUrl && r.legacyUrl !== r.currentUrl).length;
  const urlChanges = rows.filter(r => r.suggestedFutureUrl !== "Manual Review" && r.suggestedFutureUrl !== r.currentUrl).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Redirect Planning Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Read-only · {rows.length} records · {redirectsNeeded} legacy URLs need redirects · {urlChanges} URL structure changes planned
          </p>
        </div>
        <a
          href="/admin/migration/redirect-plan/export"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export CSV
        </a>
      </div>

      {/* Redirect recommendation summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ALL_RECS.map(rec => {
          const count = recCounts.get(rec) ?? 0;
          const { badge, dot } = REC_STYLES[rec];
          const subtext: Record<RedirectRec, string> = {
            "Keep Current URL":            "No URL change needed",
            "Redirect to Supporting Page": "Legacy URL → new URL",
            "Redirect to Pillar":          "Merge or remove — redirect out",
            "Manual Review":               "Needs human decision",
          };
          return (
            <div key={rec} className="bg-white border border-gray-200 rounded-lg px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${badge}`}>{rec}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{count}</p>
              <p className="text-xs text-gray-400">{subtext[rec]}</p>
            </div>
          );
        })}
      </div>

      {/* URL mapping legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Planned URL Structure (Pages Only)</p>
        <div className="grid grid-cols-4 gap-x-6 gap-y-1">
          {Object.entries(PAGE_URL_PREFIXES).map(([clusterId, prefix]) => {
            const cluster = CLUSTERS.find(c => c.id === clusterId);
            return cluster ? (
              <div key={clusterId} className="flex items-center gap-2 text-xs">
                <span className="font-medium text-gray-600 whitespace-nowrap">{cluster.name}</span>
                <span className="text-gray-400">→</span>
                <span className="font-mono text-gray-500">{prefix}/[slug]</span>
              </div>
            ) : null;
          })}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-gray-600">Blog Posts</span>
            <span className="text-gray-400">→</span>
            <span className="font-mono text-gray-500">/blog/[slug]</span>
          </div>
        </div>
      </div>

      {/* Per-cluster sections */}
      <div className="space-y-6">
        {CLUSTERS.map(cluster => {
          const items = byCluster.get(cluster.id);
          if (!items || items.length === 0) return null;
          const borderColor = CLUSTER_BORDER[cluster.color] ?? "border-l-gray-400";
          const redirectToPlanner = items.filter(r => r.redirectRec === "Redirect to Pillar").length;
          const manualReview = items.filter(r => r.redirectRec === "Manual Review").length;

          return (
            <div key={cluster.id}
              className={`bg-white border border-gray-200 border-l-4 ${borderColor} rounded-lg overflow-hidden`}>
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-gray-800">{cluster.name}</h2>
                  <span className="text-xs text-gray-400">{items.length} records</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-400">
                  {redirectToPlanner > 0 && (
                    <span className="text-amber-600 font-medium">{redirectToPlanner} redirect to pillar</span>
                  )}
                  {manualReview > 0 && (
                    <span className="text-gray-500">{manualReview} manual review</span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-gray-100 bg-white">
                    <tr>
                      {["Kind", "Title", "Legacy URL", "Current URL", "Suggested Future URL", "Action", "Redirect"].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map(row => {
                      const urlChanged = row.suggestedFutureUrl !== "Manual Review" && row.suggestedFutureUrl !== row.currentUrl;
                      return (
                        <tr key={`${row.kind}-${row.slug}`}
                          className={row.action === "Keep as Pillar" ? "bg-emerald-50/40" : "hover:bg-gray-50/50"}>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <KindBadge kind={row.kind} />
                          </td>
                          <td className="px-3 py-2.5 max-w-[200px]">
                            <p className="font-medium text-gray-800 truncate" title={row.title}>{row.title}</p>
                          </td>
                          <td className="px-3 py-2.5 max-w-[180px]">
                            {row.legacyUrl ? (
                              <span className="font-mono text-gray-400 truncate block" title={row.legacyUrl}>
                                {row.legacyUrl}
                              </span>
                            ) : (
                              <span className="text-gray-300 italic">none</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 max-w-[160px]">
                            <span className="font-mono text-gray-500 truncate block" title={row.currentUrl}>
                              {row.currentUrl}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 max-w-[180px]">
                            {row.suggestedFutureUrl === "Manual Review" ? (
                              <span className="text-gray-400 italic">Manual Review</span>
                            ) : (
                              <span
                                className={`font-mono truncate block ${urlChanged ? "text-blue-600 font-semibold" : "text-gray-400"}`}
                                title={row.suggestedFutureUrl}
                              >
                                {row.suggestedFutureUrl}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_BADGE[row.action]}`}>
                              {row.action}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${REC_STYLES[row.redirectRec].badge}`}>
                              {row.redirectRec}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Uncategorized */}
        {(byCluster.get("uncategorized")?.length ?? 0) > 0 && (() => {
          const items = byCluster.get("uncategorized")!;
          return (
            <div className="bg-white border border-gray-200 border-l-4 border-l-gray-400 rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800">Uncategorized</h2>
                <span className="text-xs text-gray-400">{items.length} records — all need manual review</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-gray-100 bg-white">
                    <tr>
                      {["Kind", "Title", "Legacy URL", "Current URL", "Suggested Future URL", "Redirect"].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map(row => (
                      <tr key={`${row.kind}-${row.slug}`} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2.5 whitespace-nowrap"><KindBadge kind={row.kind} /></td>
                        <td className="px-3 py-2.5 max-w-[220px]">
                          <p className="font-medium text-gray-800 truncate" title={row.title}>{row.title}</p>
                        </td>
                        <td className="px-3 py-2.5 max-w-[180px]">
                          {row.legacyUrl
                            ? <span className="font-mono text-gray-400 truncate block" title={row.legacyUrl}>{row.legacyUrl}</span>
                            : <span className="text-gray-300 italic">none</span>}
                        </td>
                        <td className="px-3 py-2.5 max-w-[160px]">
                          <span className="font-mono text-gray-500 truncate block" title={row.currentUrl}>{row.currentUrl}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-gray-400 italic">Manual Review</span>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${REC_STYLES["Manual Review"].badge}`}>
                            Manual Review
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function KindBadge({ kind }: { kind: "page" | "post" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
      kind === "page" ? "bg-slate-100 text-slate-700" : "bg-sky-100 text-sky-700"
    }`}>
      {kind === "page" ? "Page" : "Post"}
    </span>
  );
}
