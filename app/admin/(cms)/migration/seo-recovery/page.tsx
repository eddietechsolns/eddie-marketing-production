import type { Metadata } from "next";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = { title: "SEO Recovery | Admin" };

const BRAND_SUFFIX = ` | ${SITE_NAME}`;

const CONTENT_TYPES = [
  { label: "Pages",      table: "Page",            path: "/"            },
  { label: "Blog Posts", table: "BlogPost",         path: "/blog/"       },
  { label: "Services",   table: "Service",          path: "/services/"   },
  { label: "Portfolio",  table: "PortfolioProject", path: "/portfolio/"  },
  { label: "Industries", table: "Industry",         path: "/industries/" },
  { label: "Locations",  table: "Location",         path: "/locations/"  },
] as const;

type Rec = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cs: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  canonicalUrl: string | null;
};

type FlatRec = Rec & { typeLabel: string; typePath: string };

// ─── Suggestion helpers ───────────────────────────────────────────────────────

function suggestSeoTitle(title: string): string {
  return `${title}${BRAND_SUFFIX}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function suggestMetaDesc(r: Rec): string {
  if (r.excerpt) {
    const t = stripHtml(r.excerpt);
    if (t.length > 10) return t.slice(0, 160);
  }
  if (r.cs) {
    const t = stripHtml(r.cs);
    if (t.length > 10) return t.slice(0, 160);
  }
  return "";
}

function suggestCanonical(slug: string, path: string): string {
  return `${SITE_URL}${path}${slug}`;
}

// ─── Slug classification ──────────────────────────────────────────────────────

type SlugClass = "safe" | "needs-review" | "invalid";

function classifySlug(slug: string): { cls: SlugClass; issues: string[] } {
  if (!slug) return { cls: "invalid", issues: ["Empty slug"] };

  const issues: string[] = [];

  if (/%[0-9a-fA-F]{2}/i.test(slug)) issues.push("URL-encoded chars");
  if (/[^\x00-\x7F]/.test(slug))      issues.push("Non-ASCII characters");
  if (/\s/.test(slug))                 issues.push("Contains whitespace");
  if (/[<>{}|\\^~[\]`'"()]/.test(slug)) issues.push("Invalid URL characters");
  if (/[A-Z]/.test(slug))             issues.push("Uppercase letters");
  if (issues.length > 0) return { cls: "invalid", issues };

  if (/^\d/.test(slug))    issues.push("Starts with digit");
  if (/_/.test(slug))      issues.push("Underscore (prefer hyphens)");
  if (/\./.test(slug))     issues.push("Contains dot");
  if (slug.length > 75)    issues.push(`Long (${slug.length} chars)`);
  if (issues.length > 0) return { cls: "needs-review", issues };

  return { cls: "safe", issues: [] };
}

function repairSlug(slug: string): string {
  let s = slug;
  try { s = decodeURIComponent(s); } catch { /* ignore */ }
  s = s
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "untitled";
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchRecords(table: string): Promise<Rec[]> {
  return prisma.$queryRawUnsafe<Rec[]>(`
    SELECT id, title, slug, excerpt,
           LEFT(COALESCE(content, ''), 500) AS cs,
           "seoTitle", "seoDescription", "ogTitle", "ogDescription", "canonicalUrl"
    FROM "${table}"
    ORDER BY id
  `);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SeoRecoveryPage() {
  const allData = await Promise.all(
    CONTENT_TYPES.map(async ct => ({
      ...ct,
      records: await fetchRecords(ct.table),
    }))
  );

  const all: FlatRec[] = allData.flatMap(ct =>
    ct.records.map(r => ({ ...r, typeLabel: ct.label, typePath: ct.path }))
  );

  const missingSeoTitle  = all.filter(r => !r.seoTitle);
  const missingMetaDesc  = all.filter(r => !r.seoDescription);
  const missingOgTitle   = all.filter(r => !r.ogTitle);
  const missingOgDesc    = all.filter(r => !r.ogDescription);
  const missingCanonical = all.filter(r => !r.canonicalUrl);

  // Slug classification
  type SlugEntry = {
    id: number; slug: string; typeLabel: string;
    cls: SlugClass; issues: string[]; repair: string;
  };
  const slugEntries: SlugEntry[] = allData.flatMap(ct =>
    ct.records.map(r => {
      const { cls, issues } = classifySlug(r.slug);
      return {
        id: r.id, slug: r.slug, typeLabel: ct.label, cls, issues,
        repair: cls === "invalid" ? repairSlug(r.slug) : "",
      };
    })
  );
  const safeCount       = slugEntries.filter(s => s.cls === "safe").length;
  const needsReviewList = slugEntries.filter(s => s.cls === "needs-review");
  const invalidList     = slugEntries.filter(s => s.cls === "invalid");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SEO Recovery</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Read-only preview — all suggestions must be applied manually.
          </p>
        </div>
        <nav className="flex gap-1.5 text-xs">
          <a href="#seo-fields" className="px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">SEO Fields</a>
          <a href="#url-health" className="px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">URL Health</a>
          <a href="#canonical"  className="px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Canonical</a>
        </nav>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-5 gap-3 mb-10">
        <OverviewCard label="Missing SEO Title"  value={missingSeoTitle.length}  total={all.length} />
        <OverviewCard label="Missing Meta Desc."  value={missingMetaDesc.length}  total={all.length} />
        <OverviewCard label="Missing OG Title"    value={missingOgTitle.length}   total={all.length} />
        <OverviewCard label="Missing OG Desc."    value={missingOgDesc.length}    total={all.length} />
        <OverviewCard label="Missing Canonical"   value={missingCanonical.length} total={all.length} />
      </div>

      {/* ── SEO FIELDS ─────────────────────────────────────────────────────── */}
      <section id="seo-fields" className="mb-12 scroll-mt-4">
        <SectionHeader title="Missing SEO Fields" />

        {/* Per-type summary table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Type","Total","SEO Title","Meta Desc.","OG Title","OG Desc.","Canonical"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allData.map(ct => {
                const r = ct.records;
                const t = r.length;
                return (
                  <tr key={ct.table} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-800">{ct.label}</td>
                    <td className="px-4 py-2.5 text-right text-gray-500">{t}</td>
                    <MissingTd missing={r.filter(x => !x.seoTitle).length}       total={t} />
                    <MissingTd missing={r.filter(x => !x.seoDescription).length} total={t} />
                    <MissingTd missing={r.filter(x => !x.ogTitle).length}        total={t} />
                    <MissingTd missing={r.filter(x => !x.ogDescription).length}  total={t} />
                    <MissingTd missing={r.filter(x => !x.canonicalUrl).length}   total={t} />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Missing SEO Title */}
        {missingSeoTitle.length > 0 && (
          <RecoveryTable
            title={`Missing SEO Title — ${missingSeoTitle.length} records`}
            hint={`Suggestion: Page Title + "${BRAND_SUFFIX}"`}
            headers={["Type", "Title / Slug", "Suggested SEO Title"]}
            rows={missingSeoTitle.map(r => ({
              key: `${r.typeLabel}-${r.id}`,
              cells: [
                <TypeBadge key="t" label={r.typeLabel} />,
                <TitleSlug key="ts" title={r.title} slug={r.slug} />,
                <SuggestionPill key="s" value={suggestSeoTitle(r.title)} />,
              ],
            }))}
          />
        )}

        {/* Missing Meta Description */}
        {missingMetaDesc.length > 0 && (
          <RecoveryTable
            title={`Missing Meta Description — ${missingMetaDesc.length} records`}
            hint="Suggestion: excerpt → first 160 chars of content (HTML stripped)"
            headers={["Type", "Title / Slug", "Suggested Meta Description"]}
            rows={missingMetaDesc.map(r => {
              const sugg = suggestMetaDesc(r);
              return {
                key: `${r.typeLabel}-${r.id}`,
                cells: [
                  <TypeBadge key="t" label={r.typeLabel} />,
                  <TitleSlug key="ts" title={r.title} slug={r.slug} />,
                  sugg
                    ? <SuggestionPill key="s" value={sugg} />
                    : <span key="s" className="text-xs text-gray-300 italic">No content available</span>,
                ],
              };
            })}
          />
        )}

        {/* OG Fields — summary only (near-universal gap) */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6">
          <p className="text-sm font-semibold text-blue-800 mb-1">
            OG Fields — {missingOgTitle.length.toLocaleString("en-US")} missing OG Title &nbsp;·&nbsp; {missingOgDesc.length.toLocaleString("en-US")} missing OG Description
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Open Graph fields are optional when SEO Title and Meta Description are present — platforms
            like Facebook and LinkedIn fall back to them automatically.
            Recommended bulk fix (next phase): <strong>OG Title = SEO Title</strong> and <strong>OG Description = Meta Description</strong>.
            Prioritise fixing SEO Title and Meta Description first.
          </p>
        </div>
      </section>

      {/* ── URL HEALTH ─────────────────────────────────────────────────────── */}
      <section id="url-health" className="mb-12 scroll-mt-4">
        <SectionHeader title="URL Normalization Audit" />

        {/* Classification summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Safe</p>
            <p className="text-3xl font-bold text-green-700">{safeCount}</p>
            <p className="text-xs text-green-600 mt-1 font-mono">^[a-z][a-z0-9\-]*$</p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4">
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-1">Needs Review</p>
            <p className="text-3xl font-bold text-yellow-700">{needsReviewList.length}</p>
            <p className="text-xs text-yellow-600 mt-1">Starts with digit · underscore · dot · too long</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Invalid</p>
            <p className="text-3xl font-bold text-red-700">{invalidList.length}</p>
            <p className="text-xs text-red-600 mt-1">URL-encoded · non-ASCII · uppercase · bad chars</p>
          </div>
        </div>

        {/* Invalid slugs */}
        {invalidList.length === 0 ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 mb-6">
            <p className="text-sm font-medium text-green-700">✓ No invalid slugs found across all content types.</p>
          </div>
        ) : (
          <div className="bg-white border border-red-200 rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-2.5 bg-red-50 border-b border-red-200">
              <p className="text-sm font-semibold text-red-700">Invalid Slugs — {invalidList.length} require repair</p>
              <p className="text-xs text-red-600 mt-0.5">Do not modify automatically — verify suggested fix before applying.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {["Type","ID","Current Slug","Issues","Suggested Repair"].map(h => (
                      <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invalidList.map(s => (
                    <tr key={`${s.typeLabel}-${s.id}`} className="hover:bg-red-50">
                      <td className="px-4 py-2.5"><TypeBadge label={s.typeLabel} /></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{s.id}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-red-700 max-w-48 truncate" title={s.slug}>{s.slug}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-600">{s.issues.join(" · ")}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-green-700 bg-green-50">{s.repair}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Needs review */}
        {needsReviewList.length > 0 && (
          <div className="bg-white border border-yellow-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-yellow-50 border-b border-yellow-200">
              <p className="text-sm font-semibold text-yellow-700">Needs Review — {needsReviewList.length} slugs</p>
              <p className="text-xs text-yellow-600 mt-0.5">Technically valid but may benefit from cleanup. Do not modify without SEO analysis.</p>
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                  <tr>
                    {["Type","Slug","Classification Issues"].map(h => (
                      <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {needsReviewList.map(s => (
                    <tr key={`${s.typeLabel}-${s.id}`} className="hover:bg-yellow-50">
                      <td className="px-4 py-2.5"><TypeBadge label={s.typeLabel} /></td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{s.slug}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{s.issues.join(" · ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── CANONICAL ──────────────────────────────────────────────────────── */}
      <section id="canonical" className="mb-12 scroll-mt-4">
        <SectionHeader title="Canonical Coverage Report" />

        {/* Per-type coverage table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Type","Total","Has Canonical","Missing","Coverage"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allData.map(ct => {
                const total = ct.records.length;
                const has   = ct.records.filter(r => r.canonicalUrl).length;
                const miss  = total - has;
                const pct   = total > 0 ? Math.round((has / total) * 100) : 100;
                const barColor = pct === 100 ? "bg-green-500" : pct > 80 ? "bg-yellow-400" : "bg-red-400";
                const txtColor = pct === 100 ? "text-green-600" : pct > 80 ? "text-yellow-600" : "text-red-600";
                return (
                  <tr key={ct.table} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-800">{ct.label}</td>
                    <td className="px-4 py-2.5 text-right text-gray-500">{total}</td>
                    <td className="px-4 py-2.5 text-right text-green-600 font-medium">{has}</td>
                    <td className="px-4 py-2.5 text-right">
                      {miss > 0
                        ? <span className="text-red-600 font-medium">{miss}</span>
                        : <span className="text-green-600">0</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden block">
                          <span className={`h-full rounded-full ${barColor} block`} style={{ width: `${pct}%` }} />
                        </span>
                        <span className={`text-xs font-medium ${txtColor}`}>{pct}%</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Missing canonical with suggestions */}
        {missingCanonical.length > 0 && (
          <RecoveryTable
            title={`Missing Canonical URL — ${missingCanonical.length} records`}
            hint={`Suggested from slug + content-type path. Assumes site root: ${SITE_URL}`}
            headers={["Type", "Title / Slug", "Suggested Canonical URL"]}
            rows={missingCanonical.map(r => ({
              key: `${r.typeLabel}-${r.id}`,
              cells: [
                <TypeBadge key="t" label={r.typeLabel} />,
                <TitleSlug key="ts" title={r.title} slug={r.slug} />,
                <SuggestionPill key="s" value={suggestCanonical(r.slug, r.typePath)} mono />,
              ],
            }))}
          />
        )}
      </section>
    </div>
  );
}

// ─── Shared display components ────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
      {title}
    </h2>
  );
}

function OverviewCard({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const bad = value > 0;
  return (
    <div className={`rounded-lg border px-4 py-4 ${bad ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${bad ? "text-red-500" : "text-green-600"}`}>{label}</p>
      <p className={`text-2xl font-bold ${bad ? "text-red-700" : "text-green-700"}`}>{value}</p>
      <p className={`text-xs mt-1 ${bad ? "text-red-400" : "text-green-500"}`}>{pct}% of {total}</p>
    </div>
  );
}

function MissingTd({ missing, total }: { missing: number; total: number }) {
  return (
    <td className="px-4 py-2.5 text-right text-xs">
      {missing === 0
        ? <span className="text-green-600">✓</span>
        : <span className="text-red-600 font-medium">{missing}<span className="text-red-300">/{total}</span></span>}
    </td>
  );
}

const TYPE_COLORS: Record<string, string> = {
  "Pages":      "bg-purple-100 text-purple-700",
  "Blog Posts": "bg-blue-100   text-blue-700",
  "Services":   "bg-orange-100 text-orange-700",
  "Portfolio":  "bg-pink-100   text-pink-700",
  "Industries": "bg-teal-100   text-teal-700",
  "Locations":  "bg-indigo-100 text-indigo-700",
};

function TypeBadge({ label }: { label: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[label] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}

function TitleSlug({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="min-w-0">
      <p className="font-medium text-gray-900 text-sm truncate max-w-xs" title={title}>{title}</p>
      <p className="font-mono text-xs text-gray-400 truncate max-w-xs">{slug}</p>
    </div>
  );
}

function SuggestionPill({ value, mono }: { value: string; mono?: boolean }) {
  return (
    <span className={`text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded break-all ${mono ? "font-mono" : ""}`}>
      {value}
    </span>
  );
}

type TableRow = { key: string; cells: ReactNode[] };

function RecoveryTable({ title, hint, headers, rows }: {
  title: string;
  hint: string;
  headers: string[];
  rows: TableRow[];
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      </div>
      <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 sticky top-0 bg-white z-10">
            <tr>
              {headers.map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map(row => (
              <tr key={row.key} className="hover:bg-gray-50">
                {row.cells.map((cell, i) => (
                  <td key={i} className="px-4 py-2.5">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
