import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Content Audit | Admin" };

const n = (v: unknown): number => Number(v ?? 0);

type TableStats = {
  total: number;
  published: number;
  draft: number;
  missing_content: number;
  missing_image: number;
  missing_title: number;
  missing_slug: number;
  has_seo_title: number;
  has_seo_desc: number;
  has_og_title: number;
  has_og_desc: number;
  has_canonical: number;
  cnt_imported: number;
  cnt_pending: number;
  cnt_failed: number;
  cnt_none: number;
};

type SlugIssue = { id: number; slug: string };
type DupSlug = { slug: string; cnt: number };
type DupUrl = { url: string; cnt: number };

type UrlHealth = {
  dupSlugs: DupSlug[];
  dupUrls: DupUrl[];
  startsWithNumber: SlugIssue[];
  invalidChars: SlugIssue[];
};

async function queryStats(table: string): Promise<TableStats> {
  const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(`
    SELECT
      count(*)::int                                                                       AS total,
      count(*) FILTER (WHERE status = 'published')::int                                  AS published,
      count(*) FILTER (WHERE status = 'draft')::int                                      AS draft,
      count(*) FILTER (WHERE content IS NULL OR content = '')::int                       AS missing_content,
      count(*) FILTER (WHERE "featuredImage" IS NULL)::int                               AS missing_image,
      count(*) FILTER (WHERE title IS NULL OR title = '')::int                           AS missing_title,
      count(*) FILTER (WHERE slug IS NULL OR slug = '')::int                             AS missing_slug,
      count(*) FILTER (WHERE "seoTitle" IS NOT NULL AND "seoTitle" != '')::int           AS has_seo_title,
      count(*) FILTER (WHERE "seoDescription" IS NOT NULL AND "seoDescription" != '')::int AS has_seo_desc,
      count(*) FILTER (WHERE "ogTitle" IS NOT NULL AND "ogTitle" != '')::int             AS has_og_title,
      count(*) FILTER (WHERE "ogDescription" IS NOT NULL AND "ogDescription" != '')::int AS has_og_desc,
      count(*) FILTER (WHERE "canonicalUrl" IS NOT NULL AND "canonicalUrl" != '')::int   AS has_canonical,
      count(*) FILTER (WHERE "importStatus" = 'imported')::int                           AS cnt_imported,
      count(*) FILTER (WHERE "importStatus" = 'pending')::int                            AS cnt_pending,
      count(*) FILTER (WHERE "importStatus" = 'failed')::int                             AS cnt_failed,
      count(*) FILTER (WHERE "importStatus" = 'none')::int                               AS cnt_none
    FROM "${table}"
  `);
  const r = rows[0] ?? {};
  return {
    total: n(r.total), published: n(r.published), draft: n(r.draft),
    missing_content: n(r.missing_content), missing_image: n(r.missing_image),
    missing_title: n(r.missing_title), missing_slug: n(r.missing_slug),
    has_seo_title: n(r.has_seo_title), has_seo_desc: n(r.has_seo_desc),
    has_og_title: n(r.has_og_title), has_og_desc: n(r.has_og_desc),
    has_canonical: n(r.has_canonical),
    cnt_imported: n(r.cnt_imported), cnt_pending: n(r.cnt_pending),
    cnt_failed: n(r.cnt_failed), cnt_none: n(r.cnt_none),
  };
}

async function queryUrlHealth(table: string): Promise<UrlHealth> {
  const [dupSlugsRaw, dupUrlsRaw, startsRaw, invalidRaw] = await Promise.all([
    prisma.$queryRawUnsafe<{ slug: string; cnt: number }[]>(`
      SELECT slug, count(*)::int AS cnt FROM "${table}" GROUP BY slug HAVING count(*) > 1 ORDER BY cnt DESC
    `),
    prisma.$queryRawUnsafe<{ url: string; cnt: number }[]>(`
      SELECT "legacyUrl" AS url, count(*)::int AS cnt
      FROM "${table}"
      WHERE "legacyUrl" IS NOT NULL AND "legacyUrl" != ''
      GROUP BY "legacyUrl" HAVING count(*) > 1 ORDER BY cnt DESC
    `),
    prisma.$queryRawUnsafe<{ id: number; slug: string }[]>(`
      SELECT id, slug FROM "${table}" WHERE slug ~ '^[0-9]' ORDER BY slug LIMIT 50
    `),
    prisma.$queryRawUnsafe<{ id: number; slug: string }[]>(`
      SELECT id, slug FROM "${table}" WHERE slug ~ '[^a-z0-9\\-_\\.]' ORDER BY slug LIMIT 50
    `),
  ]);
  return {
    dupSlugs: dupSlugsRaw,
    dupUrls: dupUrlsRaw,
    startsWithNumber: startsRaw,
    invalidChars: invalidRaw,
  };
}

const CONTENT_TYPES = [
  { label: "Pages",         table: "Page"             },
  { label: "Blog Posts",    table: "BlogPost"         },
  { label: "Services",      table: "Service"          },
  { label: "Portfolio",     table: "PortfolioProject" },
  { label: "Industries",    table: "Industry"         },
  { label: "Locations",     table: "Location"         },
] as const;

export default async function AuditPage() {
  const [statsResults, urlResults] = await Promise.all([
    Promise.all(CONTENT_TYPES.map(ct => queryStats(ct.table))),
    Promise.all(CONTENT_TYPES.map(ct => queryUrlHealth(ct.table))),
  ]);

  const data = CONTENT_TYPES.map((ct, i) => ({
    ...ct,
    stats: statsResults[i],
    url: urlResults[i],
  }));

  // Grand totals for summary cards
  const totals = statsResults.reduce((acc, s) => ({
    total: acc.total + s.total,
    published: acc.published + s.published,
    draft: acc.draft + s.draft,
    missingContent: acc.missingContent + s.missing_content,
    missingImage: acc.missingImage + s.missing_image,
    missingSeo: acc.missingSeo + (s.total - s.has_seo_title),
    missingDesc: acc.missingDesc + (s.total - s.has_seo_desc),
    imported: acc.imported + s.cnt_imported,
    failed: acc.failed + s.cnt_failed,
  }), { total: 0, published: 0, draft: 0, missingContent: 0, missingImage: 0, missingSeo: 0, missingDesc: 0, imported: 0, failed: 0 });

  const totalDupSlugs = urlResults.reduce((a, u) => a + u.dupSlugs.length, 0);
  const totalInvalidSlugs = urlResults.reduce((a, u) => a + u.startsWithNumber.length + u.invalidChars.length, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Audit</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Read-only report — no content is modified.
          </p>
        </div>
        <Link
          href="/admin/migration/audit/export"
          className="inline-flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
        >
          Export CSV ↓
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Total Records" value={totals.total} />
        <SummaryCard label="Published" value={totals.published} color="green" />
        <SummaryCard label="Draft" value={totals.draft} color="yellow" />
        <SummaryCard label="Missing Content" value={totals.missingContent} color={totals.missingContent > 0 ? "red" : "green"} />
        <SummaryCard label="Missing Featured Image" value={totals.missingImage} color={totals.missingImage > 0 ? "red" : "green"} />
        <SummaryCard label="Missing SEO Title" value={totals.missingSeo} color={totals.missingSeo > 0 ? "red" : "green"} />
        <SummaryCard label="Missing Meta Description" value={totals.missingDesc} color={totals.missingDesc > 0 ? "red" : "green"} />
        <SummaryCard label="Duplicate Slugs" value={totalDupSlugs} color={totalDupSlugs > 0 ? "red" : "green"} />
        <SummaryCard label="Slug Issues" value={totalInvalidSlugs} color={totalInvalidSlugs > 0 ? "yellow" : "green"} />
      </div>

      {/* Migration summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Imported (WP)" value={totals.imported} color="blue" />
        <SummaryCard label="Import Failed" value={totals.failed} color={totals.failed > 0 ? "red" : "green"} />
        <SummaryCard label="Not Migrated" value={totals.total - totals.imported} />
      </div>

      {/* Per-type sections */}
      <div className="space-y-10">
        {data.map(ct => (
          <ContentTypeSection key={ct.table} label={ct.label} stats={ct.stats} url={ct.url} />
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({ label, value, color = "default" }: {
  label: string;
  value: number;
  color?: "green" | "red" | "yellow" | "blue" | "default";
}) {
  const colorMap = {
    green:   "text-green-700 bg-green-50 border-green-200",
    red:     "text-red-700 bg-red-50 border-red-200",
    yellow:  "text-yellow-700 bg-yellow-50 border-yellow-200",
    blue:    "text-blue-700 bg-blue-50 border-blue-200",
    default: "text-gray-700 bg-white border-gray-200",
  };
  return (
    <div className={`rounded-lg border px-5 py-4 ${colorMap[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Pct({ count, total }: { count: number; total: number }) {
  if (total === 0) return <span className="text-gray-400">—</span>;
  const pct = Math.round((count / total) * 100);
  return (
    <span className={pct === 100 ? "text-green-600 font-medium" : pct === 0 ? "text-red-500" : "text-yellow-600"}>
      {pct}%
    </span>
  );
}

function MissingBadge({ missing, total }: { missing: number; total: number }) {
  if (missing === 0) return <span className="text-green-600 font-medium">✓ None</span>;
  return <span className="text-red-600 font-medium">{missing} / {total}</span>;
}

function ContentTypeSection({ label, stats: s, url }: {
  label: string;
  stats: TableStats;
  url: UrlHealth;
}) {
  const urlIssues = url.dupSlugs.length + url.dupUrls.length + url.startsWithNumber.length + url.invalidChars.length;

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
        {label}
        <span className="text-xs font-normal text-gray-400">({s.total} records)</span>
        {urlIssues > 0 && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            {urlIssues} URL issue{urlIssues !== 1 ? "s" : ""}
          </span>
        )}
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Content Health */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Content Health</p>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <MetricRow label="Total" value={s.total} />
              <MetricRow label="Published" value={s.published} />
              <MetricRow label="Draft" value={s.draft} />
              <MetricRow label="Missing Title" value={<MissingBadge missing={s.missing_title} total={s.total} />} />
              <MetricRow label="Missing Slug" value={<MissingBadge missing={s.missing_slug} total={s.total} />} />
              <MetricRow label="Missing Content" value={<MissingBadge missing={s.missing_content} total={s.total} />} />
              <MetricRow label="Missing Feat. Image" value={<MissingBadge missing={s.missing_image} total={s.total} />} />
            </tbody>
          </table>
        </div>

        {/* SEO Health */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">SEO Health</p>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <MetricRow label="Has SEO Title" value={<><span className="text-gray-700">{s.has_seo_title}</span> <Pct count={s.has_seo_title} total={s.total} /></>} />
              <MetricRow label="Missing SEO Title" value={<MissingBadge missing={s.total - s.has_seo_title} total={s.total} />} />
              <MetricRow label="Has Meta Desc." value={<><span className="text-gray-700">{s.has_seo_desc}</span> <Pct count={s.has_seo_desc} total={s.total} /></>} />
              <MetricRow label="Missing Meta Desc." value={<MissingBadge missing={s.total - s.has_seo_desc} total={s.total} />} />
              <MetricRow label="Has OG Title" value={<><span className="text-gray-700">{s.has_og_title}</span> <Pct count={s.has_og_title} total={s.total} /></>} />
              <MetricRow label="Missing OG Title" value={<MissingBadge missing={s.total - s.has_og_title} total={s.total} />} />
              <MetricRow label="Has OG Desc." value={<><span className="text-gray-700">{s.has_og_desc}</span> <Pct count={s.has_og_desc} total={s.total} /></>} />
              <MetricRow label="Missing OG Desc." value={<MissingBadge missing={s.total - s.has_og_desc} total={s.total} />} />
              <MetricRow label="Has Canonical URL" value={<><span className="text-gray-700">{s.has_canonical}</span> <Pct count={s.has_canonical} total={s.total} /></>} />
              <MetricRow label="Missing Canonical" value={<MissingBadge missing={s.total - s.has_canonical} total={s.total} />} />
            </tbody>
          </table>
        </div>

        {/* Migration & URL Health */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Migration Health</p>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <MetricRow label="Imported" value={<span className="text-blue-600 font-medium">{s.cnt_imported}</span>} />
                <MetricRow label="Pending" value={s.cnt_pending} />
                <MetricRow label="Failed" value={<span className={s.cnt_failed > 0 ? "text-red-600 font-medium" : "text-gray-700"}>{s.cnt_failed}</span>} />
                <MetricRow label="Not Migrated" value={s.cnt_none} />
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">URL Health</p>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <MetricRow
                  label="Duplicate Slugs"
                  value={url.dupSlugs.length > 0
                    ? <span className="text-red-600 font-medium">{url.dupSlugs.length}</span>
                    : <span className="text-green-600 font-medium">✓ None</span>}
                />
                <MetricRow
                  label="Duplicate URLs"
                  value={url.dupUrls.length > 0
                    ? <span className="text-red-600 font-medium">{url.dupUrls.length}</span>
                    : <span className="text-green-600 font-medium">✓ None</span>}
                />
                <MetricRow
                  label="Starts with Number"
                  value={url.startsWithNumber.length > 0
                    ? <span className="text-yellow-600 font-medium">{url.startsWithNumber.length}</span>
                    : <span className="text-green-600 font-medium">✓ None</span>}
                />
                <MetricRow
                  label="Invalid Characters"
                  value={url.invalidChars.length > 0
                    ? <span className="text-yellow-600 font-medium">{url.invalidChars.length}</span>
                    : <span className="text-green-600 font-medium">✓ None</span>}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* URL issue detail */}
      {urlIssues > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {url.dupSlugs.length > 0 && (
            <IssueTable title="Duplicate Slugs" headers={["Slug", "Count"]}>
              {url.dupSlugs.map(d => (
                <tr key={d.slug} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{d.slug}</td>
                  <td className="px-3 py-2 text-red-600 font-medium text-xs">{d.cnt}</td>
                </tr>
              ))}
            </IssueTable>
          )}
          {url.dupUrls.length > 0 && (
            <IssueTable title="Duplicate Legacy URLs" headers={["URL", "Count"]}>
              {url.dupUrls.map(d => (
                <tr key={d.url} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700 truncate max-w-xs">{d.url}</td>
                  <td className="px-3 py-2 text-red-600 font-medium text-xs">{d.cnt}</td>
                </tr>
              ))}
            </IssueTable>
          )}
          {url.startsWithNumber.length > 0 && (
            <IssueTable title="Slugs Starting with Number" headers={["ID", "Slug"]}>
              {url.startsWithNumber.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-400 text-xs">{r.id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-yellow-700">{r.slug}</td>
                </tr>
              ))}
            </IssueTable>
          )}
          {url.invalidChars.length > 0 && (
            <IssueTable title="Slugs with Invalid Characters" headers={["ID", "Slug"]}>
              {url.invalidChars.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-400 text-xs">{r.id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-yellow-700">{r.slug}</td>
                </tr>
              ))}
            </IssueTable>
          )}
        </div>
      )}
    </section>
  );
}

function MetricRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td className="px-4 py-2 text-gray-500 text-xs">{label}</td>
      <td className="px-4 py-2 text-right text-xs">{value}</td>
    </tr>
  );
}

function IssueTable({ title, headers, children }: {
  title: string;
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-red-100 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-red-50 border-b border-red-100">
        <p className="text-xs font-semibold text-red-700">{title}</p>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-gray-100">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-3 py-1.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  );
}
