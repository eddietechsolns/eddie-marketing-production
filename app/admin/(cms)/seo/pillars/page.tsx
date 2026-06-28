import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  runClusterAnalysis,
  type ClusterColor,
  type ClusterId,
  type ScoredItem,
} from "@/lib/cluster-analysis";
import { saveOverride, clearOverride } from "./actions";

export const metadata: Metadata = { title: "Pillar Pages | SEO" };

// ─── Cluster color map ────────────────────────────────────────────────────────

const CLUSTER_COLORS: Record<ClusterColor, { border: string; head: string; badge: string; text: string }> = {
  blue:   { border: "border-blue-200",   head: "bg-blue-50",   badge: "bg-blue-100 text-blue-800",   text: "text-blue-700"   },
  orange: { border: "border-orange-200", head: "bg-orange-50", badge: "bg-orange-100 text-orange-800", text: "text-orange-700" },
  purple: { border: "border-purple-200", head: "bg-purple-50", badge: "bg-purple-100 text-purple-800", text: "text-purple-700" },
  teal:   { border: "border-teal-200",   head: "bg-teal-50",   badge: "bg-teal-100 text-teal-800",   text: "text-teal-700"   },
  green:  { border: "border-green-200",  head: "bg-green-50",  badge: "bg-green-100 text-green-800",  text: "text-green-700"  },
  rose:   { border: "border-rose-200",   head: "bg-rose-50",   badge: "bg-rose-100 text-rose-800",   text: "text-rose-700"   },
  red:    { border: "border-red-200",    head: "bg-red-50",    badge: "bg-red-100 text-red-800",    text: "text-red-700"    },
  indigo: { border: "border-indigo-200", head: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-800", text: "text-indigo-700" },
  pink:   { border: "border-pink-200",   head: "bg-pink-50",   badge: "bg-pink-100 text-pink-800",   text: "text-pink-700"   },
  yellow: { border: "border-yellow-200", head: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-800", text: "text-yellow-700" },
  amber:  { border: "border-amber-200",  head: "bg-amber-50",  badge: "bg-amber-100 text-amber-800",  text: "text-amber-700"  },
};

type Override = { clusterId: string; contentKind: string; contentId: number };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PillarsPage() {
  const [{ clusterMap }, overrides] = await Promise.all([
    runClusterAnalysis(),
    prisma.pillarOverride.findMany(),
  ]);

  const overrideMap = new Map<string, Override>();
  for (const o of overrides) overrideMap.set(o.clusterId, o);

  const activeClusters = CLUSTERS.filter(c => clusterMap.has(c.id));

  // Count overrides set
  const overrideCount = overrides.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pillar Page Overrides</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeClusters.length} clusters · {overrideCount} manual override{overrideCount !== 1 ? "s" : ""} set
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Suggested by algorithm</span>
          <span className="w-2 h-2 rounded-full bg-blue-500 ml-2" />
          <span>Manual override</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6 max-w-2xl">
        The cluster analysis suggests a pillar page based on keyword relevance scores. 
        Use this tool to select a different page based on business strategy — for example, 
        choosing a service page over a blog post, or selecting a page with better conversion intent.
        Overrides are stored in the database and will be used by future planning tools.
      </p>

      {/* Cluster grid */}
      <div className="space-y-4">
        {activeClusters.map(cluster => {
          const records = clusterMap.get(cluster.id as ClusterId) ?? [];
          const col = CLUSTER_COLORS[cluster.color];
          const suggestedPillar = records[0]; // highest score from algorithm
          const override = overrideMap.get(cluster.id);

          // Resolve the overridden item details
          let overriddenItem: ScoredItem | undefined;
          if (override) {
            overriddenItem = records.find(
              r => r.kind === override.contentKind && r.id === override.contentId
            );
          }

          const pages = records.filter(r => r.kind === "page");
          const posts = records.filter(r => r.kind === "post");

          // Current effective pillar (override takes precedence)
          const effectivePillar = overriddenItem ?? suggestedPillar;

          // Default select value: current override or suggestion
          const defaultValue = override
            ? `${override.contentKind}:${override.contentId}`
            : `${suggestedPillar?.kind}:${suggestedPillar?.id}`;

          return (
            <div key={cluster.id}
              className={`bg-white border ${col.border} rounded-lg overflow-hidden`}>

              {/* Cluster header */}
              <div className={`px-5 py-3 ${col.head} border-b ${col.border} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${col.text}`}>{cluster.name}</span>
                  <span className="text-xs text-gray-400">{cluster.description}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{pages.length} page{pages.length !== 1 ? "s" : ""}</span>
                  <span>·</span>
                  <span>{posts.length} post{posts.length !== 1 ? "s" : ""}</span>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-6">

                  {/* Left: Current effective pillar */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Active Pillar
                    </p>
                    <div className={`rounded-lg border p-3 ${override ? "border-blue-200 bg-blue-50" : "border-emerald-200 bg-emerald-50"}`}>
                      <div className="flex items-start gap-2">
                        <span className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${override ? "bg-blue-500" : "bg-emerald-500"}`} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-snug">
                            {effectivePillar?.title ?? "—"}
                          </p>
                          <p className="font-mono text-xs text-gray-400 mt-0.5">/{effectivePillar?.slug}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <KindBadge kind={effectivePillar?.kind ?? "page"} />
                            {override ? (
                              <span className="text-xs font-medium text-blue-600">Manual Override</span>
                            ) : (
                              <span className="text-xs font-medium text-emerald-600">Algorithm Suggestion</span>
                            )}
                            {suggestedPillar && (
                              <span className="text-xs text-gray-400">score {suggestedPillar.score}</span>
                            )}
                          </div>

                          {/* Show what the algorithm suggested if overridden */}
                          {override && suggestedPillar && overriddenItem?.id !== suggestedPillar.id && (
                            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-blue-200">
                              Algorithm suggested: <span className="font-medium text-gray-600">{suggestedPillar.title}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Clear override button */}
                    {override && (
                      <form action={clearOverride} className="mt-2">
                        <input type="hidden" name="clusterId" value={cluster.id} />
                        <button
                          type="submit"
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
                        >
                          Clear override — revert to algorithm suggestion
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Right: Override selector */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Set Manual Override
                    </p>
                    <form action={saveOverride} className="space-y-2">
                      <input type="hidden" name="clusterId" value={cluster.id} />
                      <select
                        name="pillar"
                        defaultValue={defaultValue}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {pages.length > 0 && (
                          <optgroup label="Pages">
                            {pages.map(r => (
                              <option key={r.id} value={`page:${r.id}`}>
                                {r.title} (score {r.score})
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {posts.length > 0 && (
                          <optgroup label="Blog Posts">
                            {posts.map(r => (
                              <option key={r.id} value={`post:${r.id}`}>
                                {r.title} (score {r.score})
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                      >
                        Save Override
                      </button>
                    </form>

                    {/* Supporting content summary */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        {records.length - 1} supporting content item{records.length - 1 !== 1 ? "s" : ""} in this cluster
                        {records.length - 1 > 0 && (
                          <span> — top 3: {records.slice(1, 4).map(r => r.title).join(", ")}</span>
                        )}
                      </p>
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

function KindBadge({ kind }: { kind: "page" | "post" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
      kind === "page" ? "bg-slate-100 text-slate-700" : "bg-sky-100 text-sky-700"
    }`}>
      {kind === "page" ? "Page" : "Post"}
    </span>
  );
}
