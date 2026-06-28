import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Site Health | SEO" };

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelHealth = {
  label: string;
  slug: string;                // for admin link prefix
  total: number;
  missingSchema: number;       // seoTitle or seoDescription null
  missingCanonical: number;    // canonicalUrl null
  missingOg: number;           // ogTitle, ogDescription, or ogImage null
  missingLinks: number;        // content null or no href=
};

// Check if content lacks internal links
function hasLinks(content: string | null): boolean {
  if (!content) return false;
  return content.includes("href=") || content.includes("<a ");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SiteHealthPage() {
  // Fetch all published records with just the SEO fields (content trimmed)
  const [pages, posts, services, industries, locations, projects] = await Promise.all([
    prisma.page.findMany({
      where: { status: "published" },
      select: { seoTitle: true, seoDescription: true, canonicalUrl: true, ogTitle: true, ogDescription: true, ogImage: true, content: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "published" },
      select: { seoTitle: true, seoDescription: true, canonicalUrl: true, ogTitle: true, ogDescription: true, ogImage: true, content: true },
    }),
    prisma.service.findMany({
      where: { status: "published" },
      select: { seoTitle: true, seoDescription: true, canonicalUrl: true, ogTitle: true, ogDescription: true, ogImage: true, content: true },
    }),
    prisma.industry.findMany({
      where: { status: "published" },
      select: { seoTitle: true, seoDescription: true, canonicalUrl: true, ogTitle: true, ogDescription: true, ogImage: true, content: true },
    }),
    prisma.location.findMany({
      where: { status: "published" },
      select: { seoTitle: true, seoDescription: true, canonicalUrl: true, ogTitle: true, ogDescription: true, ogImage: true, content: true },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "published" },
      select: { seoTitle: true, seoDescription: true, canonicalUrl: true, ogTitle: true, ogDescription: true, ogImage: true, content: true },
    }),
  ]);

  function computeHealth(
    label: string,
    slug: string,
    records: Array<{
      seoTitle: string | null;
      seoDescription: string | null;
      canonicalUrl: string | null;
      ogTitle: string | null;
      ogDescription: string | null;
      ogImage: string | null;
      content: string | null;
    }>,
  ): ModelHealth {
    return {
      label,
      slug,
      total: records.length,
      missingSchema: records.filter(r => !r.seoTitle || !r.seoDescription).length,
      missingCanonical: records.filter(r => !r.canonicalUrl).length,
      missingOg: records.filter(r => !r.ogTitle || !r.ogDescription || !r.ogImage).length,
      missingLinks: records.filter(r => !hasLinks(r.content)).length,
    };
  }

  const models: ModelHealth[] = [
    computeHealth("Pages", "pages", pages),
    computeHealth("Blog Posts", "posts", posts),
    computeHealth("Services", "services", services),
    computeHealth("Industries", "industries", industries),
    computeHealth("Locations", "locations", locations),
    computeHealth("Portfolio", "portfolio", projects),
  ];

  const totalIndexed = models.reduce((s, m) => s + m.total, 0);
  const totalMissingSchema = models.reduce((s, m) => s + m.missingSchema, 0);
  const totalMissingCanonical = models.reduce((s, m) => s + m.missingCanonical, 0);
  const totalMissingOg = models.reduce((s, m) => s + m.missingOg, 0);
  const totalMissingLinks = models.reduce((s, m) => s + m.missingLinks, 0);

  const pctComplete = totalIndexed > 0
    ? Math.round(((totalIndexed - totalMissingSchema) / totalIndexed) * 100)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Site Health</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          SEO completeness across all published content. Read-only — no changes are made.
        </p>
      </div>

      {/* Global summary tiles */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <Tile label="Total Indexed" value={totalIndexed} sub="published records" color="gray" />
        <Tile label="Schema Complete" value={`${pctComplete}%`} sub="have seoTitle + seoDesc" color={pctComplete >= 80 ? "emerald" : pctComplete >= 50 ? "amber" : "red"} />
        <Tile label="Missing Schema" value={totalMissingSchema} sub="no seoTitle/seoDesc" color={totalMissingSchema === 0 ? "emerald" : "red"} warn />
        <Tile label="Missing Canonical" value={totalMissingCanonical} sub="no canonicalUrl set" color={totalMissingCanonical === 0 ? "emerald" : "orange"} warn />
        <Tile label="Missing OG" value={totalMissingOg} sub="no OG image/title" color={totalMissingOg === 0 ? "emerald" : "orange"} warn />
      </div>

      {/* Per-model table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Breakdown by Content Type</p>
          <p className="text-xs text-gray-400">Lower numbers = better SEO health</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Content Type</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Missing Schema</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Missing Canonical</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Missing OG</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Missing Links</th>
                <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {models.map(m => {
                const issues = m.missingSchema + m.missingCanonical + m.missingOg;
                const healthPct = m.total > 0
                  ? Math.round(((m.total - m.missingSchema) / m.total) * 100)
                  : 100;
                return (
                  <tr key={m.slug} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      <a href={`/admin/${m.slug}`} className="hover:text-blue-600 transition-colors">
                        {m.label}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600 font-mono">{m.total}</td>
                    <td className="px-5 py-3 text-right">
                      <IssueCount value={m.missingSchema} total={m.total} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <IssueCount value={m.missingCanonical} total={m.total} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <IssueCount value={m.missingOg} total={m.total} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <IssueCount value={m.missingLinks} total={m.total} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <HealthBar pct={healthPct} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="px-5 py-3 font-semibold text-gray-700">Totals</td>
                <td className="px-5 py-3 text-right font-semibold font-mono text-gray-700">{totalIndexed}</td>
                <td className="px-5 py-3 text-right font-semibold font-mono text-red-600">{totalMissingSchema}</td>
                <td className="px-5 py-3 text-right font-semibold font-mono text-orange-600">{totalMissingCanonical}</td>
                <td className="px-5 py-3 text-right font-semibold font-mono text-orange-600">{totalMissingOg}</td>
                <td className="px-5 py-3 text-right font-semibold font-mono text-gray-600">{totalMissingLinks}</td>
                <td className="px-5 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Field definitions */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Field Definitions</p>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <span className="font-semibold text-gray-700">Missing Schema</span>
            {" "} — seoTitle or seoDescription is empty. Google uses these for snippet text.
          </div>
          <div>
            <span className="font-semibold text-gray-700">Missing Canonical</span>
            {" "} — canonicalUrl is not set. Without it, Next.js generates a default but it won&apos;t match legacy URLs.
          </div>
          <div>
            <span className="font-semibold text-gray-700">Missing OG</span>
            {" "} — ogTitle, ogDescription, or ogImage is empty. Required for correct social sharing previews.
          </div>
          <div>
            <span className="font-semibold text-gray-700">Missing Links</span>
            {" "} — content field has no href= references. Signals thin content or no internal linking structure.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tile({
  label, value, sub, color, warn = false,
}: {
  label: string;
  value: number | string;
  sub: string;
  color: "gray" | "emerald" | "red" | "orange" | "amber";
  warn?: boolean;
}) {
  const COLORS = {
    gray:    { border: "border-gray-200",   bg: "bg-white",       num: "text-gray-900"   },
    emerald: { border: "border-emerald-200", bg: "bg-emerald-50",  num: "text-emerald-700" },
    red:     { border: "border-red-200",     bg: "bg-red-50",      num: "text-red-700"    },
    orange:  { border: "border-orange-200",  bg: "bg-orange-50",   num: "text-orange-700" },
    amber:   { border: "border-amber-200",   bg: "bg-amber-50",    num: "text-amber-700"  },
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

function IssueCount({ value, total }: { value: number; total: number }) {
  if (value === 0) return <span className="text-emerald-600 font-medium">0</span>;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const color = pct >= 80 ? "text-red-600" : pct >= 40 ? "text-orange-600" : "text-amber-600";
  return (
    <span className={`font-medium font-mono ${color}`}>
      {value}
      <span className="text-gray-400 text-xs ml-1">({pct}%)</span>
    </span>
  );
}

function HealthBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-medium w-8 text-right ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"}`}>
        {pct}%
      </span>
    </div>
  );
}
