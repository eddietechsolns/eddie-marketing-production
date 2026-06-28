import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  runClusterAnalysis,
  computeActionPlan,
  type ClusterId,
  type ScoredItem,
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

function currentUrl(item: ScoredItem): string {
  return item.kind === "post" ? `/blog/${item.slug}` : `/${item.slug}`;
}

function csvCell(v: string): string {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
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
  for (const ai of actionItems) {
    actionMap.set(`${ai.item.kind}:${ai.item.id}`, ai.action);
  }

  const overrideMap = new Map<string, { contentKind: string; contentId: number }>();
  for (const o of overrides) overrideMap.set(o.clusterId, o);

  const activeClusters = CLUSTERS.filter(c => clusterMap.has(c.id));

  const header = csvRow([
    "Cluster",
    "Recommended Path",
    "Role",
    "Content Kind",
    "Title",
    "Current URL",
    "Content Action",
    "Is Pillar Override",
  ]);

  const rows: string[] = [header];

  for (const cluster of activeClusters) {
    const records = clusterMap.get(cluster.id as ClusterId) ?? [];
    const override = overrideMap.get(cluster.id);
    const algorithmPillar = records[0];

    let pillar = algorithmPillar;
    let isOverride = false;
    if (override) {
      const found = records.find(r => r.kind === override.contentKind && r.id === override.contentId);
      if (found) { pillar = found; isOverride = true; }
    }

    const parentPath = PARENT_PATH[cluster.id] ?? "/services/";

    for (const item of records) {
      const isPillar = item.kind === pillar.kind && item.id === pillar.id;
      const role = isPillar ? "Pillar" : item.kind === "page" ? "Supporting Page" : "Blog Post";
      const action = actionMap.get(`${item.kind}:${item.id}`) ?? "Keep as Supporting";

      rows.push(csvRow([
        cluster.name,
        parentPath,
        role,
        item.kind === "page" ? "Page" : "Blog Post",
        item.title,
        currentUrl(item),
        action,
        isPillar && isOverride ? "Yes" : "No",
      ]));
    }
  }

  const csv = rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="silo-architecture.csv"',
    },
  });
}
