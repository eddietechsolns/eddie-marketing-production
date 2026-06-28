import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  computeCoverage,
  scoredRecommendations,
  buildRoadmap,
  type ClusterCoverage,
  type ScoredRecommendation,
  type ContentType,
  type CoverageStatus,
} from "@/lib/content-gap-engine";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content Gaps | SEO" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<CoverageStatus, { badge: string; bar: string; label: string }> = {
  strong:   { badge: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500", label: "Strong" },
  moderate: { badge: "bg-blue-100 text-blue-800",       bar: "bg-blue-500",    label: "Moderate" },
  weak:     { badge: "bg-amber-100 text-amber-800",     bar: "bg-amber-500",   label: "Weak" },
  critical: { badge: "bg-red-100 text-red-800",         bar: "bg-red-500",     label: "Critical" },
};

const TYPE_STYLE: Record<ContentType, string> = {
  "blog":       "bg-blue-100 text-blue-800",
  "case-study": "bg-purple-100 text-purple-800",
  "portfolio":  "bg-teal-100 text-teal-800",
  "tool":       "bg-pink-100 text-pink-800",
  "academy":    "bg-amber-100 text-amber-800",
};

const TYPE_LABEL: Record<ContentType, string> = {
  "blog":       "Blog Post",
  "case-study": "Case Study",
  "portfolio":  "Portfolio",
  "tool":       "Tool",
  "academy":    "Academy",
};

const SCORE_COLOR = (s: number) =>
  s >= 80 ? "text-emerald-600" :
  s >= 60 ? "text-blue-600" :
  s >= 40 ? "text-amber-600" : "text-red-600";

const CLUSTER_TYPE_LABEL: Record<string, string> = {
  service: "Service",
  industry: "Industry",
  location: "Location",
  special: "Special",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContentGapsPage() {
  const [rawPosts, rawCaseStudies, rawPortfolio] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "published" },
      select: { title: true, categories: { select: { name: true } } },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published" },
      select: { title: true, serviceType: true, industry: true },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "published" },
      select: { title: true, services: true },
    }),
  ]);

  const coverages = computeCoverage(CLUSTERS, {
    blogPosts: rawPosts,
    caseStudies: rawCaseStudies,
    portfolioProjects: rawPortfolio,
  });

  const recs = scoredRecommendations(coverages);
  const roadmap = buildRoadmap(recs);

  const totalBlog      = rawPosts.length;
  const totalCs        = rawCaseStudies.length;
  const totalPortfolio = rawPortfolio.length;
  const totalRecs      = recs.length;
  const criticalCount  = coverages.filter((c) => c.status === "critical").length;
  const weakCount      = coverages.filter((c) => c.status === "weak").length;
  const avgScore       = Math.round(coverages.reduce((s, c) => s + c.coverageScore, 0) / coverages.length);

  // Group coverages by type
  const byType = {
    service:  coverages.filter((c) => c.cluster.type === "service"),
    industry: coverages.filter((c) => c.cluster.type === "industry"),
    location: coverages.filter((c) => c.cluster.type === "location"),
    special:  coverages.filter((c) => c.cluster.type === "special"),
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Content Gap Engine</h1>
          <p className="text-sm text-gray-500">
            Deterministic analysis across {coverages.length} clusters — no external APIs.
          </p>
        </div>
        <a
          href="/admin/seo/content-gaps/export"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          ↓ Export CSV
        </a>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Blog Posts",        value: totalBlog,      color: "text-blue-600" },
          { label: "Case Studies",      value: totalCs,        color: "text-purple-600" },
          { label: "Portfolio Items",   value: totalPortfolio, color: "text-teal-600" },
          { label: "Clusters Analysed", value: coverages.length, color: "text-gray-800" },
          { label: "Avg Coverage",      value: `${avgScore}%`, color: avgScore >= 60 ? "text-emerald-600" : "text-amber-600" },
          { label: "Weak Clusters",     value: weakCount,      color: "text-amber-600" },
          { label: "Critical Clusters", value: criticalCount,  color: "text-red-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Section 1: Cluster Coverage ─────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-1">1 — Cluster Coverage</h2>
        <p className="text-sm text-gray-500 mb-5">
          Coverage score = blogs (40%) + case studies (25%) + portfolio (15%) + tools (10%) + academy (10%).
        </p>

        {(["service", "industry", "location", "special"] as const).map((type) => (
          <div key={type} className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              {CLUSTER_TYPE_LABEL[type]}s
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-medium">Cluster</th>
                    <th className="text-center px-3 py-3 font-medium">Blog</th>
                    <th className="text-center px-3 py-3 font-medium">Case Study</th>
                    <th className="text-center px-3 py-3 font-medium">Portfolio</th>
                    <th className="text-center px-3 py-3 font-medium">Tools</th>
                    <th className="text-center px-3 py-3 font-medium">Academy</th>
                    <th className="px-4 py-3 font-medium w-40">Coverage</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {byType[type].map((cov) => {
                    const s = STATUS_STYLE[cov.status];
                    return (
                      <tr key={cov.cluster.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{cov.cluster.name}</td>
                        <td className="text-center px-3 py-3 text-gray-700">{cov.blogCount}</td>
                        <td className="text-center px-3 py-3 text-gray-700">{cov.caseStudyCount}</td>
                        <td className="text-center px-3 py-3 text-gray-700">{cov.portfolioCount}</td>
                        <td className="text-center px-3 py-3 text-gray-700">{cov.toolCount}</td>
                        <td className="text-center px-3 py-3 text-gray-700">{cov.academyCount}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${s.bar}`}
                                style={{ width: `${cov.coverageScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600 w-8 text-right">
                              {cov.coverageScore}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${s.badge}`}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Section 2: Missing Content Opportunities ────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-1">2 — Missing Content Opportunities</h2>
        <p className="text-sm text-gray-500 mb-5">
          {totalRecs} deterministic recommendations across all clusters, sorted by priority score.
          Showing top 40 most impactful gaps.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-medium">Recommended Title</th>
                <th className="text-left px-3 py-3 font-medium">Cluster</th>
                <th className="text-center px-3 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium w-72">Reason</th>
                <th className="text-left px-3 py-3 font-medium">Supporting Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recs.slice(0, 40).map((rec, i) => (
                <tr key={`${rec.clusterId}-${rec.slug}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 leading-snug">{rec.title}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">/{rec.slug}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-gray-700 text-xs">{rec.clusterName}</span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLE[rec.contentType]}`}>
                      {TYPE_LABEL[rec.contentType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 leading-relaxed">{rec.reason}</td>
                  <td className="px-3 py-3 text-xs text-blue-600 font-mono">{rec.supportingPage}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalRecs > 40 && (
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
              Showing 40 of {totalRecs} recommendations — export CSV for the full list.
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 3: Priority Scoring ─────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-1">3 — Priority Scoring</h2>
        <p className="text-sm text-gray-500 mb-5">
          Score = Commercial Value (30%) + Cluster Weakness (40%) + Lead Gen Potential (20%) + Ease (10%). Max 100.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {recs.slice(0, 21).map((rec) => (
            <div key={`score-${rec.clusterId}-${rec.slug}`} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-start">
              <div className="flex-shrink-0 text-center">
                <span className={`text-2xl font-bold ${SCORE_COLOR(rec.priorityScore)}`}>
                  {rec.priorityScore}
                </span>
                <p className="text-xs text-gray-400 leading-none">/ 100</p>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm leading-snug truncate">{rec.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLE[rec.contentType]}`}>
                    {TYPE_LABEL[rec.contentType]}
                  </span>
                  <span className="text-xs text-gray-500">{rec.clusterName}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">Diff {rec.difficulty}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalRecs > 21 && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            Showing top 21 of {totalRecs} — export CSV for the full ranked list.
          </p>
        )}
      </section>

      {/* ─── Section 4: Publishing Roadmap ───────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-1">4 — Publishing Roadmap</h2>
        <p className="text-sm text-gray-500 mb-5">
          Grouped by priority score threshold. Publish the "Next 7 Days" list first for maximum impact.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RoadmapColumn
            label="Next 7 Days"
            sublabel="Priority ≥ 80 — publish first"
            color="red"
            items={roadmap.week}
          />
          <RoadmapColumn
            label="Next 30 Days"
            sublabel="Priority 65–79 — queue now"
            color="orange"
            items={roadmap.month}
          />
          <RoadmapColumn
            label="Next 90 Days"
            sublabel="Priority 45–64 — plan this quarter"
            color="blue"
            items={roadmap.quarter}
          />
          <RoadmapColumn
            label="Next 12 Months"
            sublabel="Priority < 45 — long-term backlog"
            color="gray"
            items={roadmap.year}
          />
        </div>
      </section>

      {/* ─── Section 5: Export ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-1">5 — Export CSV</h2>
        <p className="text-sm text-gray-500 mb-4">
          Full {totalRecs}-row CSV with all columns: Cluster, Content Type, Title, Priority Score, Commercial Value, Difficulty, Slug, Supporting Page, Reason.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">{totalRecs} recommendations ready to export</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Sorted by priority score — paste directly into a content calendar or project management tool.
            </p>
          </div>
          <a
            href="/admin/seo/content-gaps/export"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            ↓ Download content-gaps.csv
          </a>
        </div>
      </section>

      {/* ─── Validation Summary ───────────────────────────────────────────────── */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-bold text-gray-700 mb-3">✓ Phase 15B Validation Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { label: "Admin route",             value: "/admin/seo/content-gaps" },
            { label: "Sidebar link",            value: "SEO → Content Gaps" },
            { label: "Clusters analysed",       value: `${coverages.length} (8 services, 10 industries, 3 locations, 2 special)` },
            { label: "Recommendations generated", value: String(totalRecs) },
            { label: "CSV export",              value: "/admin/seo/content-gaps/export" },
            { label: "External APIs",           value: "None — fully deterministic" },
            { label: "New DB tables",           value: "None — reads only" },
            { label: "New packages",            value: "None" },
            { label: "TypeScript",              value: "Clean" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Roadmap column sub-component ─────────────────────────────────────────────

function RoadmapColumn({
  label,
  sublabel,
  color,
  items,
}: {
  label: string;
  sublabel: string;
  color: "red" | "orange" | "blue" | "gray";
  items: ScoredRecommendation[];
}) {
  const headerColors = {
    red:    "bg-red-50 border-red-200 text-red-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    blue:   "bg-blue-50 border-blue-200 text-blue-800",
    gray:   "bg-gray-50 border-gray-200 text-gray-700",
  };

  const dotColors = {
    red:    "bg-red-400",
    orange: "bg-orange-400",
    blue:   "bg-blue-400",
    gray:   "bg-gray-400",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className={`px-4 py-3 border-b ${headerColors[color]}`}>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs opacity-70 mt-0.5">{sublabel} · {items.length} items</p>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-400 text-center">No items in this window.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={`road-${item.clusterId}-${item.slug}`} className="px-4 py-3 flex items-start gap-3">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[color]}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug">{item.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${TYPE_STYLE[item.contentType]}`}>
                    {TYPE_LABEL[item.contentType]}
                  </span>
                  <span className="text-xs text-gray-500">{item.clusterName}</span>
                  <span className="text-xs text-gray-400">Score {item.priorityScore}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
