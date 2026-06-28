import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  runClusterAnalysis,
  computeActionPlan,
  type ClusterColor,
  type ClusterId,
  type ScoredItem,
  type ActionLabel,
} from "@/lib/cluster-analysis";

export const metadata: Metadata = { title: "Silo Architecture | SEO" };

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

const CLUSTER_COLORS: Record<ClusterColor, { border: string; head: string; badge: string; text: string; dot: string }> = {
  blue:   { border: "border-blue-200",   head: "bg-blue-50",   badge: "bg-blue-100 text-blue-800",   text: "text-blue-700",   dot: "bg-blue-500"   },
  orange: { border: "border-orange-200", head: "bg-orange-50", badge: "bg-orange-100 text-orange-800", text: "text-orange-700", dot: "bg-orange-500" },
  purple: { border: "border-purple-200", head: "bg-purple-50", badge: "bg-purple-100 text-purple-800", text: "text-purple-700", dot: "bg-purple-500" },
  teal:   { border: "border-teal-200",   head: "bg-teal-50",   badge: "bg-teal-100 text-teal-800",   text: "text-teal-700",   dot: "bg-teal-500"   },
  green:  { border: "border-green-200",  head: "bg-green-50",  badge: "bg-green-100 text-green-800",  text: "text-green-700",  dot: "bg-green-500"  },
  rose:   { border: "border-rose-200",   head: "bg-rose-50",   badge: "bg-rose-100 text-rose-800",   text: "text-rose-700",   dot: "bg-rose-500"   },
  red:    { border: "border-red-200",    head: "bg-red-50",    badge: "bg-red-100 text-red-800",    text: "text-red-700",    dot: "bg-red-500"    },
  indigo: { border: "border-indigo-200", head: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-800", text: "text-indigo-700", dot: "bg-indigo-500" },
  pink:   { border: "border-pink-200",   head: "bg-pink-50",   badge: "bg-pink-100 text-pink-800",   text: "text-pink-700",   dot: "bg-pink-500"   },
  yellow: { border: "border-yellow-200", head: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-800", text: "text-yellow-700", dot: "bg-yellow-500" },
  amber:  { border: "border-amber-200",  head: "bg-amber-50",  badge: "bg-amber-100 text-amber-800",  text: "text-amber-700",  dot: "bg-amber-500"  },
};

const ACTION_STYLE: Record<ActionLabel, string> = {
  "Keep as Pillar":       "bg-emerald-100 text-emerald-800",
  "Keep as Supporting":   "bg-blue-100 text-blue-800",
  "Merge Later":          "bg-yellow-100 text-yellow-800",
  "Expand Later":         "bg-orange-100 text-orange-800",
  "Redirect Later":       "bg-red-100 text-red-800",
  "Needs Manual Review":  "bg-gray-100 text-gray-700",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function currentUrl(item: ScoredItem): string {
  return item.kind === "post" ? `/blog/${item.slug}` : `/${item.slug}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SiloArchitecturePage() {
  const [{ clusterMap, uncategorized }, overrides] = await Promise.all([
    runClusterAnalysis(),
    prisma.pillarOverride.findMany(),
  ]);

  const actionItems = computeActionPlan(clusterMap, uncategorized);

  // Build action lookup: "page:42" | "post:17" → ActionLabel
  const actionMap = new Map<string, ActionLabel>();
  for (const ai of actionItems) {
    actionMap.set(`${ai.item.kind}:${ai.item.id}`, ai.action);
  }

  // Build override map
  const overrideMap = new Map<string, { contentKind: string; contentId: number }>();
  for (const o of overrides) overrideMap.set(o.clusterId, o);

  // Active clusters only
  const activeClusters = CLUSTERS.filter(c => clusterMap.has(c.id));

  // Build silo data per cluster
  type SiloData = {
    clusterId: string;
    clusterName: string;
    color: ClusterColor;
    parentPath: string;
    pillar: ScoredItem;
    isOverride: boolean;
    algorithmPillar: ScoredItem;
    supportingPages: ScoredItem[];
    supportingPosts: ScoredItem[];
    allRecords: ScoredItem[];
    isWeakPillar: boolean;
    weakReason: string;
  };

  const silos: SiloData[] = activeClusters.map(cluster => {
    const records = clusterMap.get(cluster.id as ClusterId) ?? [];
    const override = overrideMap.get(cluster.id);
    const algorithmPillar = records[0];

    let pillar = algorithmPillar;
    let isOverride = false;
    if (override) {
      const found = records.find(r => r.kind === override.contentKind && r.id === override.contentId);
      if (found) { pillar = found; isOverride = true; }
    }

    const supportingPages = records.filter(r => !(r.kind === pillar.kind && r.id === pillar.id) && r.kind === "page");
    const supportingPosts = records.filter(r => !(r.kind === pillar.kind && r.id === pillar.id) && r.kind === "post");

    // Weak pillar: blog post as pillar, or thin silo, or low score
    const isWeakPillar = pillar.kind === "post" || records.length < 3 || pillar.score < 2;
    let weakReason = "";
    if (pillar.kind === "post") weakReason = "No service page found — blog post is acting as pillar";
    else if (pillar.score < 2) weakReason = `Pillar score ${pillar.score} is low — weak topical signal`;
    else if (records.length < 3) weakReason = `Only ${records.length} item${records.length !== 1 ? "s" : ""} in silo — thin cluster`;

    return {
      clusterId: cluster.id,
      clusterName: cluster.name,
      color: cluster.color,
      parentPath: PARENT_PATH[cluster.id] ?? "/services/",
      pillar,
      isOverride,
      algorithmPillar,
      supportingPages,
      supportingPosts,
      allRecords: records,
      isWeakPillar,
      weakReason,
    };
  });

  // Global stats
  const totalContent = silos.reduce((sum, s) => sum + s.allRecords.length, 0);
  const weakSilos = silos.filter(s => s.isWeakPillar).length;
  const overrideCount = silos.filter(s => s.isOverride).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Service Silo Architecture</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Proposed information architecture using cluster analysis + manual pillar overrides.
            Planning only — no content, URLs, or redirects are modified.
          </p>
        </div>
        <a
          href="/admin/seo/silo-architecture/export"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </a>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <SummaryTile label="Active Silos" value={silos.length} sub="content clusters" />
        <SummaryTile label="Total Content" value={totalContent} sub="pages + posts" />
        <SummaryTile label="Manual Overrides" value={overrideCount} sub="pillars overridden" />
        <SummaryTile
          label="Weak Silos"
          value={weakSilos}
          sub="missing strong pillar"
          warn={weakSilos > 0}
        />
      </div>

      {/* Action label legend */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Content Actions:</span>
        {(Object.entries(ACTION_STYLE) as [ActionLabel, string][]).map(([label, cls]) => (
          <span key={label} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Silos */}
      <div className="space-y-6">
        {silos.map(silo => {
          const col = CLUSTER_COLORS[silo.color];
          const pillarActionKey = `${silo.pillar.kind}:${silo.pillar.id}`;
          const pillarAction = actionMap.get(pillarActionKey) ?? "Keep as Pillar";

          return (
            <div key={silo.clusterId}
              className={`bg-white border ${col.border} rounded-xl overflow-hidden`}>

              {/* Cluster header */}
              <div className={`px-5 py-3 ${col.head} border-b ${col.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span className={`font-bold text-sm ${col.text}`}>{silo.clusterName}</span>
                    <code className="text-xs bg-white/70 border border-gray-200 rounded px-2 py-0.5 font-mono text-gray-600">
                      {silo.parentPath}
                    </code>
                    {silo.isOverride && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                        Manual Pillar Set
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {silo.supportingPages.length} supporting page{silo.supportingPages.length !== 1 ? "s" : ""} ·{" "}
                      {silo.supportingPosts.length} blog post{silo.supportingPosts.length !== 1 ? "s" : ""} ·{" "}
                      <strong>{silo.allRecords.length} total</strong>
                    </span>
                    {silo.isWeakPillar && (
                      <span className="text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
                        ⚠ Weak Pillar
                      </span>
                    )}
                  </div>
                </div>
                {silo.isWeakPillar && (
                  <p className="text-xs text-amber-600 mt-1.5 ml-5">{silo.weakReason}</p>
                )}
              </div>

              <div className="p-5">
                {/* Three columns: Pillar | Supporting Pages | Blog Posts */}
                <div className="grid grid-cols-3 gap-5 mb-5">

                  {/* Pillar */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Pillar Page
                    </p>
                    <div className={`rounded-lg border p-3 ${silo.isOverride ? "border-blue-200 bg-blue-50" : "border-emerald-200 bg-emerald-50"}`}>
                      <div className="flex items-start gap-2">
                        <span className="text-base">🏛</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-snug break-words">
                            {silo.pillar.title}
                          </p>
                          <p className="font-mono text-xs text-gray-400 mt-0.5 break-all">
                            {currentUrl(silo.pillar)}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <KindBadge kind={silo.pillar.kind} />
                            <span className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${ACTION_STYLE[pillarAction]}`}>
                              {pillarAction}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1.5">
                            Score: {silo.pillar.score}
                            {silo.isOverride && (
                              <span className="ml-1 text-blue-500">· Override</span>
                            )}
                          </p>
                          {silo.isOverride && silo.algorithmPillar.id !== silo.pillar.id && (
                            <p className="text-xs text-gray-400 mt-1 pt-1 border-t border-blue-200">
                              Algo: {silo.algorithmPillar.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Pages */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Supporting Pages ({silo.supportingPages.length})
                    </p>
                    {silo.supportingPages.length === 0 ? (
                      <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No supporting service pages — consider creating dedicated service pages for this silo.
                      </p>
                    ) : (
                      <ol className="space-y-1.5">
                        {silo.supportingPages.map((item, i) => {
                          const action = actionMap.get(`page:${item.id}`) ?? "Keep as Supporting";
                          return (
                            <li key={item.id} className="flex items-start gap-2 text-sm">
                              <span className="shrink-0 text-xs text-gray-300 font-mono mt-0.5 w-4 text-right">{i + 1}.</span>
                              <div className="min-w-0">
                                <p className="text-gray-800 leading-snug text-xs font-medium break-words">{item.title}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <p className="font-mono text-xs text-gray-400 break-all">/{item.slug}</p>
                                  <span className={`inline-flex rounded-full px-1.5 py-0 text-xs font-medium ${ACTION_STYLE[action]}`}>
                                    {action}
                                  </span>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>

                  {/* Blog Posts */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Blog Posts ({silo.supportingPosts.length})
                    </p>
                    {silo.supportingPosts.length === 0 ? (
                      <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No blog posts assigned to this cluster.
                      </p>
                    ) : (
                      <ol className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {silo.supportingPosts.map((item, i) => {
                          const action = actionMap.get(`post:${item.id}`) ?? "Keep as Supporting";
                          return (
                            <li key={item.id} className="flex items-start gap-2 text-sm">
                              <span className="shrink-0 text-xs text-gray-300 font-mono mt-0.5 w-4 text-right">{i + 1}.</span>
                              <div className="min-w-0">
                                <p className="text-gray-800 leading-snug text-xs font-medium break-words">{item.title}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <p className="font-mono text-xs text-gray-400">/blog/{item.slug}</p>
                                  <span className={`inline-flex rounded-full px-1.5 py-0 text-xs font-medium ${ACTION_STYLE[action]}`}>
                                    {action}
                                  </span>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>
                </div>

                {/* Internal Linking Structure */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Proposed Internal Linking Structure
                  </p>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3 font-mono text-xs text-gray-600">

                    {/* Pillar row */}
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">PILLAR</span>
                      <span className="text-gray-400">→</span>
                      <div>
                        <span className="text-gray-700">{silo.pillar.title}</span>
                        <span className="text-gray-400 ml-2">
                          ({currentUrl(silo.pillar)})
                        </span>
                        <div className="mt-1 text-gray-400 pl-2 border-l-2 border-gray-200">
                          Links out to all {silo.supportingPages.length} supporting pages
                          {silo.supportingPosts.length > 0 && ` + featured blog posts`}
                        </div>
                        {silo.supportingPages.length > 0 && (
                          <div className="mt-1 text-gray-400 pl-2 border-l-2 border-gray-200">
                            Accepts inbound links from:{" "}
                            {silo.supportingPages.slice(0, 3).map(p => p.title).join(", ")}
                            {silo.supportingPages.length > 3 && ` +${silo.supportingPages.length - 3} more`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Supporting pages */}
                    {silo.supportingPages.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0">PAGES</span>
                        <span className="text-gray-400">→</span>
                        <div className="text-gray-400">
                          Each page links back to pillar: <span className="text-gray-600">{silo.pillar.title}</span>
                          <br />
                          Cross-link between related supporting pages where topically relevant
                        </div>
                      </div>
                    )}

                    {/* Blog posts */}
                    {silo.supportingPosts.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold shrink-0">POSTS</span>
                        <span className="text-gray-400">→</span>
                        <div className="text-gray-400">
                          Primary: link to pillar <span className="text-gray-600">{silo.pillar.title}</span>
                          {silo.supportingPages.length > 0 && (
                            <>
                              <br />
                              Secondary: link to most relevant service page{silo.supportingPages.length > 1 ? "s" : ""}:{" "}
                              <span className="text-gray-600">{silo.supportingPages.slice(0, 2).map(p => p.title).join(", ")}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Target path */}
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-500 font-bold shrink-0">PATH</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-700">
                        Planned URL structure: <span className="text-emerald-600">{silo.parentPath}</span>
                        <span className="text-gray-400"> (planning only — no URL changes in this phase)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryTile({
  label,
  value,
  sub,
  warn = false,
}: {
  label: string;
  value: number;
  sub: string;
  warn?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${warn && value > 0 ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-white"}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${warn && value > 0 ? "text-amber-700" : "text-gray-900"}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function KindBadge({ kind }: { kind: "page" | "post" }) {
  return (
    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${
      kind === "page" ? "bg-slate-100 text-slate-700" : "bg-sky-100 text-sky-700"
    }`}>
      {kind === "page" ? "Page" : "Post"}
    </span>
  );
}
