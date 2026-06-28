import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  runClusterAnalysis,
  computeActionPlan,
  type ClusterColor,
  type ClusterId,
  type ScoredItem,
  type ContentItem,
  type ActionLabel,
} from "@/lib/cluster-analysis";

export const metadata: Metadata = { title: "URL Mapping | SEO" };

// ─── Static maps ──────────────────────────────────────────────────────────────

const PARENT_PATH: Record<string, string> = {
  "seo":               "/services/seo/",
  "ppc":               "/services/google-ads/",
  "social-media":      "/services/social-media/",
  "web-design":        "/services/web-development/",
  "content-marketing": "/services/content-marketing/",
  "video-creative":    "/services/video-marketing/",
  "analytics":         "/services/analytics/",
  "email-influencer":  "/services/email-marketing/",
  "ecommerce":         "/services/ecommerce/",
  "local-geo":         "/services/local-seo/",
  "dubai-market":      "/locations/dubai/",
};

const CLUSTER_COLORS: Record<ClusterColor, { border: string; head: string; text: string; dot: string }> = {
  blue:   { border: "border-blue-200",   head: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  orange: { border: "border-orange-200", head: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  purple: { border: "border-purple-200", head: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  teal:   { border: "border-teal-200",   head: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500"   },
  green:  { border: "border-green-200",  head: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  rose:   { border: "border-rose-200",   head: "bg-rose-50",   text: "text-rose-700",   dot: "bg-rose-500"   },
  red:    { border: "border-red-200",    head: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
  indigo: { border: "border-indigo-200", head: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  pink:   { border: "border-pink-200",   head: "bg-pink-50",   text: "text-pink-700",   dot: "bg-pink-500"   },
  yellow: { border: "border-yellow-200", head: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  amber:  { border: "border-amber-200",  head: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type UrlAction = "Keep URL" | "Move URL" | "Manual Review";
type ContentRole = "Pillar" | "Supporting Page" | "Blog Post";

type UrlRecord = {
  id: number;
  kind: "page" | "post";
  title: string;
  slug: string;
  clusterId: string;
  clusterName: string;
  color: ClusterColor;
  role: ContentRole;
  contentAction: ActionLabel | "—";
  currentUrl: string;
  proposedUrl: string;
  urlAction: UrlAction;
  redirectRequired: boolean;
};

// ─── URL derivation ───────────────────────────────────────────────────────────

function mkCurrentUrl(item: { kind: string; slug: string }): string {
  return item.kind === "post" ? `/blog/${item.slug}` : `/${item.slug}`;
}

function mkProposedUrl(
  item: ScoredItem | ContentItem,
  clusterId: string,
  role: ContentRole,
): string {
  if (item.kind === "post") return `/blog/${item.slug}`;
  if (clusterId === "uncategorized") return `/${item.slug}`;
  const parent = PARENT_PATH[clusterId] ?? "/services/";
  if (role === "Pillar") return parent;
  return `${parent}${item.slug}`;
}

function mkUrlAction(current: string, proposed: string, clusterId: string): UrlAction {
  if (clusterId === "uncategorized") return "Manual Review";
  if (current === proposed) return "Keep URL";
  return "Move URL";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UrlMappingPage() {
  const [{ clusterMap, uncategorized }, overrides] = await Promise.all([
    runClusterAnalysis(),
    prisma.pillarOverride.findMany(),
  ]);

  const actionItems = computeActionPlan(clusterMap, uncategorized);
  const actionMap = new Map<string, ActionLabel>();
  for (const ai of actionItems) actionMap.set(`${ai.item.kind}:${ai.item.id}`, ai.action);

  const overrideMap = new Map<string, { contentKind: string; contentId: number }>();
  for (const o of overrides) overrideMap.set(o.clusterId, o);

  const activeClusters = CLUSTERS.filter(c => clusterMap.has(c.id));

  // ── Build all URL records ──────────────────────────────────────────────────

  const allRecords: UrlRecord[] = [];

  for (const cluster of activeClusters) {
    const records = clusterMap.get(cluster.id as ClusterId) ?? [];
    const override = overrideMap.get(cluster.id);

    // Determine which item is the pillar
    let pillarKind = records[0]?.kind;
    let pillarId = records[0]?.id;
    if (override) {
      const found = records.find(r => r.kind === override.contentKind && r.id === override.contentId);
      if (found) { pillarKind = found.kind; pillarId = found.id; }
    }

    for (const item of records) {
      const isPillar = item.kind === pillarKind && item.id === pillarId;
      const role: ContentRole = item.kind === "post" ? "Blog Post" : isPillar ? "Pillar" : "Supporting Page";
      const current = mkCurrentUrl(item);
      const proposed = mkProposedUrl(item, cluster.id, role);
      const urlAction = mkUrlAction(current, proposed, cluster.id);

      allRecords.push({
        id: item.id,
        kind: item.kind,
        title: item.title,
        slug: item.slug,
        clusterId: cluster.id,
        clusterName: cluster.name,
        color: cluster.color,
        role,
        contentAction: actionMap.get(`${item.kind}:${item.id}`) ?? "—",
        currentUrl: current,
        proposedUrl: proposed,
        urlAction,
        redirectRequired: urlAction === "Move URL",
      });
    }
  }

  // Uncategorized
  for (const item of uncategorized) {
    const current = mkCurrentUrl(item);
    allRecords.push({
      id: item.id,
      kind: item.kind,
      title: item.title,
      slug: item.slug,
      clusterId: "uncategorized",
      clusterName: "Uncategorized",
      color: "yellow",
      role: item.kind === "post" ? "Blog Post" : "Supporting Page",
      contentAction: "Needs Manual Review",
      currentUrl: current,
      proposedUrl: current,
      urlAction: "Manual Review",
      redirectRequired: false,
    });
  }

  // ── Summary stats ──────────────────────────────────────────────────────────

  const total = allRecords.length;
  const keepCount = allRecords.filter(r => r.urlAction === "Keep URL").length;
  const moveCount = allRecords.filter(r => r.urlAction === "Move URL").length;
  const redirectCount = allRecords.filter(r => r.redirectRequired).length;
  const reviewCount = allRecords.filter(r => r.urlAction === "Manual Review").length;

  // ── Per-cluster summary ────────────────────────────────────────────────────

  type ClusterSummary = {
    clusterId: string;
    clusterName: string;
    color: ClusterColor;
    keep: number;
    move: number;
    review: number;
    total: number;
  };

  const clusterSummaries: ClusterSummary[] = activeClusters.map(cluster => {
    const rows = allRecords.filter(r => r.clusterId === cluster.id);
    return {
      clusterId: cluster.id,
      clusterName: cluster.name,
      color: cluster.color,
      keep: rows.filter(r => r.urlAction === "Keep URL").length,
      move: rows.filter(r => r.urlAction === "Move URL").length,
      review: rows.filter(r => r.urlAction === "Manual Review").length,
      total: rows.length,
    };
  });

  // Also add uncategorized to summaries if any
  const uncatRows = allRecords.filter(r => r.clusterId === "uncategorized");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">URL Mapping & Redirect Simulation</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Simulated final URL architecture for all pages and posts.
            Simulation only — no redirects created, no content or URLs modified.
          </p>
        </div>
        <a
          href="/admin/seo/url-mapping/export"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </a>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <SummaryCard label="Total URLs" value={total} sub="pages + posts" color="gray" />
        <SummaryCard label="Keep URL" value={keepCount} sub="no change needed" color="emerald" />
        <SummaryCard label="Move URL" value={moveCount} sub="URL will change" color="blue" />
        <SummaryCard label="Redirects Required" value={redirectCount} sub="old → new URL" color="orange" />
        <SummaryCard label="Manual Review" value={reviewCount} sub="needs decision" color="amber" />
      </div>

      {/* Per-cluster breakdown summary */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700">Per-Cluster Breakdown</p>
        </div>
        <div className="divide-y divide-gray-100">
          {clusterSummaries.map(cs => {
            const col = CLUSTER_COLORS[cs.color];
            const pctMove = cs.total > 0 ? Math.round((cs.move / cs.total) * 100) : 0;
            return (
              <div key={cs.clusterId} className="flex items-center gap-4 px-5 py-2.5">
                <div className="flex items-center gap-2 w-44 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className={`text-xs font-semibold ${col.text}`}>{cs.clusterName}</span>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${pctMove}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs shrink-0">
                  <span className="text-emerald-600 font-medium w-16 text-right">{cs.keep} keep</span>
                  <span className="text-blue-600 font-medium w-16 text-right">{cs.move} move</span>
                  <span className="text-amber-600 font-medium w-20 text-right">{cs.review} review</span>
                  <span className="text-gray-400 font-medium w-14 text-right">{cs.total} total</span>
                </div>
              </div>
            );
          })}
          {uncatRows.length > 0 && (
            <div className="flex items-center gap-4 px-5 py-2.5">
              <div className="flex items-center gap-2 w-44 shrink-0">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Uncategorized</span>
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-300 rounded-full w-full" />
              </div>
              <div className="flex items-center gap-4 text-xs shrink-0">
                <span className="text-emerald-600 font-medium w-16 text-right">0 keep</span>
                <span className="text-blue-600 font-medium w-16 text-right">0 move</span>
                <span className="text-amber-600 font-medium w-20 text-right">{uncatRows.length} review</span>
                <span className="text-gray-400 font-medium w-14 text-right">{uncatRows.length} total</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Per-cluster detailed tables */}
      <div className="space-y-5">
        {activeClusters.map(cluster => {
          const col = CLUSTER_COLORS[cluster.color];
          const rows = allRecords.filter(r => r.clusterId === cluster.id);
          const keep = rows.filter(r => r.urlAction === "Keep URL").length;
          const move = rows.filter(r => r.urlAction === "Move URL").length;

          return (
            <div key={cluster.id} className={`bg-white border ${col.border} rounded-xl overflow-hidden`}>
              <div className={`px-5 py-3 ${col.head} border-b ${col.border} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className={`text-sm font-bold ${col.text}`}>{cluster.name}</span>
                  <code className="text-xs bg-white/70 border border-gray-200 rounded px-2 py-0.5 font-mono text-gray-600">
                    {PARENT_PATH[cluster.id] ?? "/services/"}
                  </code>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-600 font-medium">{keep} keep</span>
                  <span className="text-blue-600 font-medium">{move} move</span>
                  <span className="text-gray-400">{rows.length} total</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide w-8">#</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Title</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide w-28">Role</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Current URL</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Proposed URL</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide w-28">URL Action</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide w-24">Redirect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map((row, i) => (
                      <tr key={`${row.kind}-${row.id}`}
                        className={`hover:bg-gray-50/60 ${row.role === "Pillar" ? "bg-emerald-50/30" : ""}`}>
                        <td className="px-4 py-2 text-gray-300 font-mono">{i + 1}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1.5">
                            <KindDot kind={row.kind} />
                            <span className="text-gray-800 font-medium leading-snug">{row.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <RoleBadge role={row.role} />
                        </td>
                        <td className="px-4 py-2 font-mono text-gray-500 break-all">{row.currentUrl}</td>
                        <td className="px-4 py-2 font-mono break-all">
                          {row.urlAction === "Move URL" ? (
                            <span className="text-blue-600 font-semibold">{row.proposedUrl}</span>
                          ) : row.urlAction === "Manual Review" ? (
                            <span className="text-amber-500 italic">Manual Review</span>
                          ) : (
                            <span className="text-gray-400">{row.proposedUrl}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <UrlActionBadge action={row.urlAction} />
                        </td>
                        <td className="px-4 py-2">
                          <RedirectBadge required={row.redirectRequired} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Uncategorized */}
        {uncatRows.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-sm font-bold text-gray-600">Uncategorized</span>
                <span className="text-xs text-gray-400">— no cluster assigned</span>
              </div>
              <span className="text-xs text-amber-600 font-medium">{uncatRows.length} manual review</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide w-8">#</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Title</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Current URL</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide w-28">URL Action</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide w-24">Redirect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {uncatRows.map((row, i) => (
                    <tr key={`${row.kind}-${row.id}`} className="hover:bg-gray-50/60">
                      <td className="px-4 py-2 text-gray-300 font-mono">{i + 1}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          <KindDot kind={row.kind} />
                          <span className="text-gray-800 font-medium">{row.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-mono text-gray-500">{row.currentUrl}</td>
                      <td className="px-4 py-2"><UrlActionBadge action="Manual Review" /></td>
                      <td className="px-4 py-2"><RedirectBadge required={false} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({
  label, value, sub, color,
}: {
  label: string; value: number; sub: string;
  color: "gray" | "emerald" | "blue" | "orange" | "amber";
}) {
  const COLORS = {
    gray:    { border: "border-gray-200",   bg: "bg-white",        num: "text-gray-900"   },
    emerald: { border: "border-emerald-200", bg: "bg-emerald-50",   num: "text-emerald-700" },
    blue:    { border: "border-blue-200",    bg: "bg-blue-50",      num: "text-blue-700"   },
    orange:  { border: "border-orange-200",  bg: "bg-orange-50",    num: "text-orange-700" },
    amber:   { border: "border-amber-200",   bg: "bg-amber-50",     num: "text-amber-700"  },
  };
  const c = COLORS[color];
  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-4`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${c.num}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function KindDot({ kind }: { kind: "page" | "post" }) {
  return (
    <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${kind === "page" ? "bg-slate-400" : "bg-sky-400"}`} />
  );
}

function RoleBadge({ role }: { role: ContentRole }) {
  const STYLES: Record<ContentRole, string> = {
    "Pillar":         "bg-emerald-100 text-emerald-800",
    "Supporting Page": "bg-blue-100 text-blue-800",
    "Blog Post":      "bg-sky-100 text-sky-800",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[role]}`}>
      {role}
    </span>
  );
}

function UrlActionBadge({ action }: { action: UrlAction }) {
  const STYLES: Record<UrlAction, string> = {
    "Keep URL":      "bg-emerald-100 text-emerald-800",
    "Move URL":      "bg-blue-100 text-blue-800",
    "Manual Review": "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[action]}`}>
      {action}
    </span>
  );
}

function RedirectBadge({ required }: { required: boolean }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
      required ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-600"
    }`}>
      {required ? "Yes" : "No"}
    </span>
  );
}
