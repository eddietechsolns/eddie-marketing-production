import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  runClusterAnalysis,
  computeActionPlan,
  type ClusterId,
  type ScoredItem,
  type ContentItem,
  type ActionLabel,
} from "@/lib/cluster-analysis";

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

type ContentRole = "Pillar" | "Supporting Page" | "Blog Post";
type UrlAction = "Keep URL" | "Move URL" | "Manual Review";

function mkCurrentUrl(item: { kind: string; slug: string }): string {
  return item.kind === "post" ? `/blog/${item.slug}` : `/${item.slug}`;
}

function mkProposedUrl(item: ScoredItem | ContentItem, clusterId: string, role: ContentRole): string {
  if (item.kind === "post") return `/blog/${item.slug}`;
  if (clusterId === "uncategorized") return `/${item.slug}`;
  const parent = PARENT_PATH[clusterId] ?? "/services/";
  if (role === "Pillar") return parent;
  return `${parent}${item.slug}`;
}

function mkUrlAction(current: string, proposed: string, clusterId: string): UrlAction {
  if (clusterId === "uncategorized") return "Manual Review";
  if (current === proposed) return "Keep URL";
  return "Move URL";
}

function csvCell(v: string): string {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function csvRow(cells: string[]): string {
  return cells.map(csvCell).join(",");
}

export async function GET() {
  const [{ clusterMap, uncategorized }, overrides] = await Promise.all([
    runClusterAnalysis(),
    prisma.pillarOverride.findMany(),
  ]);

  const actionItems = computeActionPlan(clusterMap, uncategorized);
  const actionMap = new Map<string, ActionLabel>();
  for (const ai of actionItems) actionMap.set(`${ai.item.kind}:${ai.item.id}`, ai.action);

  const overrideMap = new Map<string, { contentKind: string; contentId: number }>();
  for (const o of overrides) overrideMap.set(o.clusterId, o);

  const activeClusters = CLUSTERS.filter(c => clusterMap.has(c.id));

  const header = csvRow([
    "Cluster", "Recommended Path", "Content Kind", "Title", "Role",
    "Current URL", "Proposed URL", "URL Action", "Redirect Required", "Content Action",
  ]);

  const rows: string[] = [header];

  const processItems = (
    items: (ScoredItem | ContentItem)[],
    clusterId: string,
    clusterName: string,
    pillarKind?: string,
    pillarId?: number,
  ) => {
    for (const item of items) {
      const isPillar = item.kind === pillarKind && item.id === pillarId;
      const role: ContentRole = item.kind === "post" ? "Blog Post" : isPillar ? "Pillar" : "Supporting Page";
      const current = mkCurrentUrl(item);
      const proposed = mkProposedUrl(item, clusterId, role);
      const urlAction = mkUrlAction(current, proposed, clusterId);
      const redirect = urlAction === "Move URL" ? "Yes" : "No";
      const contentAction = actionMap.get(`${item.kind}:${item.id}`) ?? "Needs Manual Review";
      const parentPath = PARENT_PATH[clusterId] ?? "/services/";

      rows.push(csvRow([
        clusterName,
        clusterId === "uncategorized" ? "Manual Review" : parentPath,
        item.kind === "page" ? "Page" : "Blog Post",
        item.title,
        role,
        current,
        proposed,
        urlAction,
        redirect,
        contentAction,
      ]));
    }
  };

  for (const cluster of activeClusters) {
    const records = clusterMap.get(cluster.id as ClusterId) ?? [];
    const override = overrideMap.get(cluster.id);

    let pillarKind = records[0]?.kind;
    let pillarId = records[0]?.id;
    if (override) {
      const found = records.find(r => r.kind === override.contentKind && r.id === override.contentId);
      if (found) { pillarKind = found.kind; pillarId = found.id; }
    }

    processItems(records, cluster.id, cluster.name, pillarKind, pillarId);
  }

  processItems(uncategorized, "uncategorized", "Uncategorized");

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="url-mapping.csv"',
    },
  });
}
