import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const n = (v: unknown): number => Number(v ?? 0);

const CONTENT_TYPES = [
  { label: "Pages",     table: "Page"             },
  { label: "BlogPosts", table: "BlogPost"         },
  { label: "Services",  table: "Service"          },
  { label: "Portfolio", table: "PortfolioProject" },
  { label: "Industries",table: "Industry"         },
  { label: "Locations", table: "Location"         },
] as const;

async function queryStats(table: string) {
  const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE status = 'published')::int AS published,
      count(*) FILTER (WHERE status = 'draft')::int AS draft,
      count(*) FILTER (WHERE content IS NULL OR content = '')::int AS missing_content,
      count(*) FILTER (WHERE "featuredImage" IS NULL)::int AS missing_image,
      count(*) FILTER (WHERE title IS NULL OR title = '')::int AS missing_title,
      count(*) FILTER (WHERE slug IS NULL OR slug = '')::int AS missing_slug,
      count(*) FILTER (WHERE "seoTitle" IS NOT NULL AND "seoTitle" != '')::int AS has_seo_title,
      count(*) FILTER (WHERE "seoDescription" IS NOT NULL AND "seoDescription" != '')::int AS has_seo_desc,
      count(*) FILTER (WHERE "ogTitle" IS NOT NULL AND "ogTitle" != '')::int AS has_og_title,
      count(*) FILTER (WHERE "ogDescription" IS NOT NULL AND "ogDescription" != '')::int AS has_og_desc,
      count(*) FILTER (WHERE "canonicalUrl" IS NOT NULL AND "canonicalUrl" != '')::int AS has_canonical,
      count(*) FILTER (WHERE "importStatus" = 'imported')::int AS cnt_imported,
      count(*) FILTER (WHERE "importStatus" = 'pending')::int AS cnt_pending,
      count(*) FILTER (WHERE "importStatus" = 'failed')::int AS cnt_failed,
      count(*) FILTER (WHERE "importStatus" = 'none')::int AS cnt_none
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

async function queryUrlHealth(table: string) {
  const [dupSlugs, dupUrls, startsWithNumber, invalidChars] = await Promise.all([
    prisma.$queryRawUnsafe<{ slug: string; cnt: number }[]>(`
      SELECT slug, count(*)::int AS cnt FROM "${table}" GROUP BY slug HAVING count(*) > 1
    `),
    prisma.$queryRawUnsafe<{ url: string; cnt: number }[]>(`
      SELECT "legacyUrl" AS url, count(*)::int AS cnt
      FROM "${table}" WHERE "legacyUrl" IS NOT NULL AND "legacyUrl" != ''
      GROUP BY "legacyUrl" HAVING count(*) > 1
    `),
    prisma.$queryRawUnsafe<{ id: number; slug: string }[]>(`
      SELECT id, slug FROM "${table}" WHERE slug ~ '^[0-9]' LIMIT 50
    `),
    prisma.$queryRawUnsafe<{ id: number; slug: string }[]>(`
      SELECT id, slug FROM "${table}" WHERE slug ~ '[^a-z0-9\\-_\\.]' LIMIT 50
    `),
  ]);
  return { dupSlugs, dupUrls, startsWithNumber, invalidChars };
}

function csvRow(cells: (string | number)[]): string {
  return cells.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",");
}

export async function GET() {
  const statsResults = await Promise.all(CONTENT_TYPES.map(ct => queryStats(ct.table)));
  const urlResults = await Promise.all(CONTENT_TYPES.map(ct => queryUrlHealth(ct.table)));

  const lines: string[] = [];

  // === CONTENT HEALTH ===
  lines.push("CONTENT HEALTH");
  lines.push(csvRow(["Type","Total","Published","Draft","Missing Title","Missing Slug","Missing Content","Missing Featured Image"]));
  CONTENT_TYPES.forEach((ct, i) => {
    const s = statsResults[i];
    lines.push(csvRow([
      ct.label, s.total, s.published, s.draft,
      s.missing_title, s.missing_slug, s.missing_content, s.missing_image,
    ]));
  });

  lines.push("");

  // === SEO HEALTH ===
  lines.push("SEO HEALTH");
  lines.push(csvRow(["Type","Total","Has SEO Title","Missing SEO Title","Has Meta Desc","Missing Meta Desc","Has OG Title","Missing OG Title","Has OG Desc","Missing OG Desc","Has Canonical","Missing Canonical"]));
  CONTENT_TYPES.forEach((ct, i) => {
    const s = statsResults[i];
    lines.push(csvRow([
      ct.label, s.total,
      s.has_seo_title, s.total - s.has_seo_title,
      s.has_seo_desc, s.total - s.has_seo_desc,
      s.has_og_title, s.total - s.has_og_title,
      s.has_og_desc, s.total - s.has_og_desc,
      s.has_canonical, s.total - s.has_canonical,
    ]));
  });

  lines.push("");

  // === MIGRATION HEALTH ===
  lines.push("MIGRATION HEALTH");
  lines.push(csvRow(["Type","Total","Imported","Pending","Failed","Not Migrated"]));
  CONTENT_TYPES.forEach((ct, i) => {
    const s = statsResults[i];
    lines.push(csvRow([ct.label, s.total, s.cnt_imported, s.cnt_pending, s.cnt_failed, s.cnt_none]));
  });

  lines.push("");

  // === URL HEALTH — Duplicate Slugs ===
  lines.push("URL HEALTH — Duplicate Slugs");
  lines.push(csvRow(["Type","Slug","Count"]));
  CONTENT_TYPES.forEach((ct, i) => {
    for (const d of urlResults[i].dupSlugs) {
      lines.push(csvRow([ct.label, d.slug, d.cnt]));
    }
  });

  lines.push("");

  // === URL HEALTH — Duplicate Legacy URLs ===
  lines.push("URL HEALTH — Duplicate Legacy URLs");
  lines.push(csvRow(["Type","Legacy URL","Count"]));
  CONTENT_TYPES.forEach((ct, i) => {
    for (const d of urlResults[i].dupUrls) {
      lines.push(csvRow([ct.label, d.url, d.cnt]));
    }
  });

  lines.push("");

  // === URL HEALTH — Slugs Starting with Number ===
  lines.push("URL HEALTH — Slugs Starting with Number");
  lines.push(csvRow(["Type","ID","Slug"]));
  CONTENT_TYPES.forEach((ct, i) => {
    for (const r of urlResults[i].startsWithNumber) {
      lines.push(csvRow([ct.label, r.id, r.slug]));
    }
  });

  lines.push("");

  // === URL HEALTH — Slugs with Invalid Characters ===
  lines.push("URL HEALTH — Slugs with Invalid Characters");
  lines.push(csvRow(["Type","ID","Slug"]));
  CONTENT_TYPES.forEach((ct, i) => {
    for (const r of urlResults[i].invalidChars) {
      lines.push(csvRow([ct.label, r.id, r.slug]));
    }
  });

  const csv = lines.join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="content-audit-${date}.csv"`,
    },
  });
}
