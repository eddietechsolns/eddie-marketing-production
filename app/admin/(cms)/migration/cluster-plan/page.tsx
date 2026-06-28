import type { Metadata } from "next";
import {
  CLUSTERS,
  computeActionPlan,
  runClusterAnalysis,
  type ActionItem,
  type ActionLabel,
  type ClusterColor,
  type ClusterId,
} from "@/lib/cluster-analysis";

export const metadata: Metadata = { title: "Cluster Action Plan | Admin" };

// ─── Action styling ───────────────────────────────────────────────────────────

const ACTION_STYLES: Record<ActionLabel, { badge: string; dot: string }> = {
  "Keep as Pillar":       { badge: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
  "Keep as Supporting":   { badge: "bg-blue-100 text-blue-800",       dot: "bg-blue-500"    },
  "Merge Later":          { badge: "bg-yellow-100 text-yellow-800",   dot: "bg-yellow-400"  },
  "Expand Later":         { badge: "bg-orange-100 text-orange-800",   dot: "bg-orange-400"  },
  "Redirect Later":       { badge: "bg-red-100 text-red-800",         dot: "bg-red-500"     },
  "Needs Manual Review":  { badge: "bg-gray-100 text-gray-700",       dot: "bg-gray-400"    },
};

const ALL_ACTIONS: ActionLabel[] = [
  "Keep as Pillar", "Keep as Supporting", "Merge Later",
  "Expand Later", "Redirect Later", "Needs Manual Review",
];

const CLUSTER_COLORS: Record<ClusterColor, string> = {
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
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ClusterPlanPage() {
  const { clusterMap, uncategorized } = await runClusterAnalysis();
  const plan = computeActionPlan(clusterMap, uncategorized);

  // Action counts for summary
  const actionCounts = new Map<ActionLabel, number>();
  for (const item of plan) {
    actionCounts.set(item.action, (actionCounts.get(item.action) ?? 0) + 1);
  }

  // Group by cluster for display
  const byCluster = new Map<ClusterId | "uncategorized", ActionItem[]>();
  for (const item of plan) {
    const key = item.clusterId;
    if (!byCluster.has(key)) byCluster.set(key, []);
    byCluster.get(key)!.push(item);
  }

  const total = plan.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cluster Action Plan</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Read-only recommendations · {total} records · no content modified
          </p>
        </div>
        <a
          href="/admin/migration/cluster-plan/export"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export CSV
        </a>
      </div>

      {/* Action summary */}
      <div className="grid grid-cols-6 gap-3 mb-8">
        {ALL_ACTIONS.map(action => {
          const count = actionCounts.get(action) ?? 0;
          const { badge, dot } = ACTION_STYLES[action];
          return (
            <div key={action} className="bg-white border border-gray-200 rounded-lg px-3 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                <span className={`text-xl font-bold ${count === 0 ? "text-gray-300" : "text-gray-900"}`}>{count}</span>
              </div>
              <p className="text-xs text-gray-500 leading-tight">{action}</p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Action Labels</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          {ALL_ACTIONS.map(action => (
            <span key={action} className="flex items-center gap-2 text-xs text-gray-600">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_STYLES[action].badge}`}>{action}</span>
              <span className="text-gray-400">{ACTION_LABEL_DESCRIPTIONS[action]}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Per-cluster tables */}
      <div className="space-y-6 mb-8">
        {CLUSTERS.map(cluster => {
          const items = byCluster.get(cluster.id);
          if (!items || items.length === 0) return null;
          const borderColor = CLUSTER_COLORS[cluster.color];
          const pillar = items.find(i => i.action === "Keep as Pillar");
          const issues = items.filter(i => i.action === "Redirect Later" || i.action === "Merge Later" || i.action === "Expand Later");

          return (
            <div key={cluster.id} className={`bg-white border border-gray-200 border-l-4 ${borderColor} rounded-lg overflow-hidden`}>
              {/* Cluster header */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-gray-800">{cluster.name}</h2>
                  <span className="text-xs text-gray-400">{cluster.description}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{items.length} records</span>
                  {pillar && (
                    <span className="text-gray-600">
                      Pillar: <span className="font-medium text-gray-800">{pillar.item.title}</span>
                    </span>
                  )}
                  {issues.length > 0 && (
                    <span className="text-amber-600 font-medium">{issues.length} issue{issues.length > 1 ? "s" : ""}</span>
                  )}
                </div>
              </div>

              {/* Records table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-100">
                    <tr>
                      {["Kind", "Title & Reason", "Slug", "Action"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((ai, idx) => {
                      const { badge } = ACTION_STYLES[ai.action];
                      return (
                        <tr key={`${ai.item.kind}-${ai.item.id}`}
                          className={idx === 0 ? "bg-emerald-50/40" : "hover:bg-gray-50/60"}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <KindBadge kind={ai.item.kind} />
                          </td>
                          <td className="px-4 py-3 max-w-sm">
                            <p className={`font-medium text-xs leading-snug ${idx === 0 ? "text-emerald-800" : "text-gray-800"}`}>
                              {ai.item.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{ai.reason}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-gray-400">{ai.item.slug}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>
                              {ai.action}
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
        {(byCluster.get("uncategorized")?.length ?? 0) > 0 && (
          <div className="bg-white border border-gray-200 border-l-4 border-l-gray-400 rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Uncategorized</h2>
              <span className="text-xs text-gray-400">{byCluster.get("uncategorized")!.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {["Kind", "Title & Reason", "Slug", "Action"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {byCluster.get("uncategorized")!.map(ai => {
                    const { badge } = ACTION_STYLES[ai.action];
                    return (
                      <tr key={`${ai.item.kind}-${ai.item.id}`} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 whitespace-nowrap"><KindBadge kind={ai.item.kind} /></td>
                        <td className="px-4 py-3 max-w-sm">
                          <p className="font-medium text-xs text-gray-800 leading-snug">{ai.item.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{ai.reason}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-400">{ai.item.slug}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>
                            {ai.action}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACTION_LABEL_DESCRIPTIONS: Record<ActionLabel, string> = {
  "Keep as Pillar":      "Hub page for the cluster",
  "Keep as Supporting":  "Links to pillar; good topical fit",
  "Merge Later":         "Similar intent — consolidate",
  "Expand Later":        "Thin content — needs more depth",
  "Redirect Later":      "Near-duplicate — 301 after review",
  "Needs Manual Review": "No cluster match — review manually",
};

function KindBadge({ kind }: { kind: "page" | "post" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
      kind === "page" ? "bg-slate-100 text-slate-700" : "bg-sky-100 text-sky-700"
    }`}>
      {kind === "page" ? "Page" : "Post"}
    </span>
  );
}
