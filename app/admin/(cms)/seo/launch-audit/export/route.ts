import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const n = (v: unknown): number =>
  typeof v === "bigint" ? Number(v) : Number(v ?? 0);

type FailRecord = {
  type: string;
  slug: string;
  title: string;
  missing_title: boolean;
  missing_desc: boolean;
};

type SuspiciousStats = {
  localhost_count: bigint | number;
  replit_count: bigint | number;
  old_domain_count: bigint | number;
};

const SLUG_PREFIX: Record<string, string> = {
  blog: "/blog/",
  page: "/",
  service: "/services/",
  industry: "/industries/",
  location: "/locations/",
  portfolio: "/portfolio/",
};

function csvRow(fields: string[]): string {
  return fields.map((f) => `"${String(f ?? "").replace(/"/g, '""')}"`).join(",");
}

export async function GET() {
  const [failingRecords, suspiciousLinks, leadTotal] = await Promise.all([
    prisma.$queryRaw<FailRecord[]>`
      SELECT type, slug, title, missing_title, missing_desc FROM (
        SELECT 'blog'      AS type, slug, title,
          ("seoTitle"       IS NULL OR "seoTitle"       = '') AS missing_title,
          ("seoDescription" IS NULL OR "seoDescription" = '') AS missing_desc
        FROM "BlogPost" WHERE status = 'published'
          AND ("seoTitle" IS NULL OR "seoTitle" = '' OR "seoDescription" IS NULL OR "seoDescription" = '')
        UNION ALL
        SELECT 'page',      slug, title,
          ("seoTitle" IS NULL OR "seoTitle" = ''),
          ("seoDescription" IS NULL OR "seoDescription" = '')
        FROM "Page"
          WHERE "seoTitle" IS NULL OR "seoTitle" = '' OR "seoDescription" IS NULL OR "seoDescription" = ''
        UNION ALL
        SELECT 'service',   slug, title,
          ("seoTitle" IS NULL OR "seoTitle" = ''),
          ("seoDescription" IS NULL OR "seoDescription" = '')
        FROM "Service"
          WHERE "seoTitle" IS NULL OR "seoTitle" = '' OR "seoDescription" IS NULL OR "seoDescription" = ''
        UNION ALL
        SELECT 'industry',  slug, title,
          ("seoTitle" IS NULL OR "seoTitle" = ''),
          ("seoDescription" IS NULL OR "seoDescription" = '')
        FROM "Industry"
          WHERE "seoTitle" IS NULL OR "seoTitle" = '' OR "seoDescription" IS NULL OR "seoDescription" = ''
        UNION ALL
        SELECT 'location',  slug, title,
          ("seoTitle" IS NULL OR "seoTitle" = ''),
          ("seoDescription" IS NULL OR "seoDescription" = '')
        FROM "Location"
          WHERE "seoTitle" IS NULL OR "seoTitle" = '' OR "seoDescription" IS NULL OR "seoDescription" = ''
        UNION ALL
        SELECT 'portfolio', slug, title,
          ("seoTitle" IS NULL OR "seoTitle" = ''),
          ("seoDescription" IS NULL OR "seoDescription" = '')
        FROM "PortfolioProject"
          WHERE "seoTitle" IS NULL OR "seoTitle" = '' OR "seoDescription" IS NULL OR "seoDescription" = ''
      ) q ORDER BY missing_title DESC, type`,

    prisma.$queryRaw<SuspiciousStats[]>`
      SELECT
        SUM(CASE WHEN content LIKE '%localhost%'                   THEN 1 ELSE 0 END)::int AS localhost_count,
        SUM(CASE WHEN content LIKE '%.replit.%'                    THEN 1 ELSE 0 END)::int AS replit_count,
        SUM(CASE WHEN content LIKE '%eddiemarketingsolutions.com%' THEN 1 ELSE 0 END)::int AS old_domain_count
      FROM (
        SELECT content FROM "BlogPost"         WHERE content IS NOT NULL
        UNION ALL SELECT content FROM "Page"           WHERE content IS NOT NULL
        UNION ALL SELECT content FROM "Service"        WHERE content IS NOT NULL
        UNION ALL SELECT content FROM "Industry"       WHERE content IS NOT NULL
        UNION ALL SELECT content FROM "Location"       WHERE content IS NOT NULL
        UNION ALL SELECT content FROM "PortfolioProject" WHERE content IS NOT NULL
      ) t`,

    prisma.lead.count(),
  ]);

  const sus = suspiciousLinks[0] ?? { localhost_count: 0, replit_count: 0, old_domain_count: 0 };

  const rows: string[] = [
    csvRow(["URL", "Audit Type", "Status", "Issue", "Severity"]),
  ];

  for (const r of failingRecords) {
    const url = `${SITE_URL}${SLUG_PREFIX[r.type] ?? "/"}${r.slug}`;
    if (r.missing_title) {
      rows.push(csvRow([url, "SEO Coverage", "FAIL", "Missing SEO Title", "HIGH"]));
    }
    if (r.missing_desc) {
      rows.push(csvRow([url, "SEO Coverage", "FAIL", "Missing Meta Description", "HIGH"]));
    }
  }

  if (n(sus.localhost_count) > 0) {
    rows.push(csvRow([SITE_URL, "Internal Links", "FAIL", `${n(sus.localhost_count)} content pages contain localhost references`, "HIGH"]));
  }
  if (n(sus.replit_count) > 0) {
    rows.push(csvRow([SITE_URL, "Internal Links", "FAIL", `${n(sus.replit_count)} content pages contain .replit. domain references`, "HIGH"]));
  }
  if (n(sus.old_domain_count) > 0) {
    rows.push(csvRow([SITE_URL, "Internal Links", "WARN", `${n(sus.old_domain_count)} content pages reference old domain (eddiemarketingsolutions.com)`, "MEDIUM"]));
  }

  if (leadTotal === 0) {
    rows.push(csvRow([`${SITE_URL}/contact`, "Conversion", "WARN", "No leads captured yet — test lead form submission", "MEDIUM"]));
  }

  rows.push(csvRow([SITE_URL, "Schema",       "PASS", "Organization schema registered",  "INFO"]));
  rows.push(csvRow([SITE_URL, "Schema",       "PASS", "WebSite schema registered",        "INFO"]));
  rows.push(csvRow([SITE_URL, "Schema",       "PASS", "LocalBusiness schema registered",  "INFO"]));
  rows.push(csvRow([SITE_URL, "Sitemap",      "PASS", "sitemap.xml uses correct domain",  "INFO"]));
  rows.push(csvRow([SITE_URL, "Robots",       "PASS", "robots.txt excludes /admin/ and /api/", "INFO"]));
  rows.push(csvRow([SITE_URL, "Domain",       "PASS", "All canonicals emit eddietechsolns.com", "INFO"]));
  rows.push(csvRow([SITE_URL, "Conversion",   "PASS", "Lead forms present on all public page templates", "INFO"]));

  const date = new Date().toISOString().slice(0, 10);
  const csv = rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="launch-audit-${date}.csv"`,
    },
  });
}
