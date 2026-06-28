import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeActionPlan, runClusterAnalysis, type ActionLabel, type ClusterId } from "@/lib/cluster-analysis";

type RedirectRec = "Keep Current URL" | "Redirect to Pillar" | "Redirect to Supporting Page" | "Manual Review";

const PAGE_URL_PREFIXES: Partial<Record<ClusterId, string>> = {
  "seo":               "/services/seo",
  "ppc":               "/services/google-ads",
  "social-media":      "/services/social-media",
  "web-design":        "/services/web-development",
  "content-marketing": "/services/content-marketing",
  "analytics":         "/services/analytics",
  "ecommerce":         "/services/ecommerce",
  "dubai-market":      "/locations/dubai",
};

function currentUrl(kind: "page" | "post", slug: string): string {
  return kind === "post" ? `/blog/${slug}` : `/${slug}`;
}

function suggestedUrl(kind: "page" | "post", slug: string, clusterId: ClusterId | "uncategorized"): string {
  if (kind === "post") return `/blog/${slug}`;
  if (clusterId === "uncategorized") return "Manual Review";
  const prefix = PAGE_URL_PREFIXES[clusterId as ClusterId];
  return prefix ? `${prefix}/${slug}` : "Manual Review";
}

function redirectRec(action: ActionLabel, futureUrl: string): RedirectRec {
  if (action === "Keep as Pillar")     return "Keep Current URL";
  if (action === "Redirect Later")     return "Redirect to Pillar";
  if (action === "Merge Later")        return "Redirect to Pillar";
  if (action === "Needs Manual Review" || futureUrl === "Manual Review") return "Manual Review";
  return "Redirect to Supporting Page";
}

function csvEscape(value: string): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(values: string[]): string {
  return values.map(csvEscape).join(",");
}

export async function GET() {
  const { clusterMap, uncategorized } = await runClusterAnalysis();
  const actionPlan = computeActionPlan(clusterMap, uncategorized);

  const [pageLegacy, postLegacy] = await Promise.all([
    prisma.$queryRawUnsafe<{ id: number; legacyUrl: string | null }[]>(`SELECT id, "legacyUrl" FROM "Page"`),
    prisma.$queryRawUnsafe<{ id: number; legacyUrl: string | null }[]>(`SELECT id, "legacyUrl" FROM "BlogPost"`),
  ]);

  const legacyMap = new Map<string, string | null>();
  for (const r of pageLegacy) legacyMap.set(`page-${r.id}`, r.legacyUrl);
  for (const r of postLegacy) legacyMap.set(`post-${r.id}`, r.legacyUrl);

  const header = csvRow([
    "Content Type", "Title", "Legacy URL", "Current URL",
    "Suggested Future URL", "Cluster", "Recommended Action", "Redirect Recommendation",
  ]);

  const dataRows = actionPlan.map(ai => {
    const item = ai.item;
    const legUrl = legacyMap.get(`${item.kind}-${item.id}`) ?? "";
    const currUrl = currentUrl(item.kind, item.slug);
    const futureUrl = suggestedUrl(item.kind, item.slug, ai.clusterId);
    const rec = redirectRec(ai.action, futureUrl);
    return csvRow([
      item.kind === "page" ? "Page" : "Blog Post",
      item.title,
      legUrl,
      currUrl,
      futureUrl,
      ai.clusterName,
      ai.action,
      rec,
    ]);
  });

  const csv = [header, ...dataRows].join("\r\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="redirect-plan.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
