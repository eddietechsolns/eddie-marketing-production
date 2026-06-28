import { cache } from "react";
import {
  runClusterAnalysis,
  assignCluster,
  CLUSTERS,
  type ClusterId,
  type ScoredItem,
  type ContentItem,
} from "./cluster-analysis";

export type { ClusterId } from "./cluster-analysis";
import { prisma } from "./prisma";

// ─── Cache per request (React cache deduplicates within a render tree) ─────────

export const getCachedAnalysis = cache(runClusterAnalysis);

const getCachedPillarOverrides = cache(() =>
  prisma.pillarOverride.findMany(),
);

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ClusterLinks = {
  clusterId: ClusterId;
  clusterName: string;
  /** Pillar page (manual override takes precedence over auto-detected) */
  pillar: ScoredItem | null;
  /** Supporting pages in the cluster (excludes pillar + current page) */
  supporting: ScoredItem[];
  /** Blog posts in the cluster (excludes current post) */
  blogPosts: ScoredItem[];
};

// ─── URL helpers ──────────────────────────────────────────────────────────────

/** Public URL for a content item from the cluster analysis */
export function contentUrl(item: Pick<ScoredItem, "kind" | "slug">): string {
  return item.kind === "post" ? `/blog/${item.slug}` : `/${item.slug}`;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

type PillarOverrideRow = {
  clusterId: string;
  contentKind: string;
  contentId: number;
};

function resolvePillar(
  clusterId: string,
  items: ScoredItem[],
  overrides: PillarOverrideRow[],
): ScoredItem | null {
  const override = overrides.find((o) => o.clusterId === clusterId);
  if (override) {
    const found = items.find(
      (i) => i.kind === override.contentKind && i.id === override.contentId,
    );
    if (found) return found;
  }
  return items[0] ?? null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns cluster links for an explicit cluster ID.
 * The excludeSlug/excludeKind parameters remove the current page from results.
 */
export async function getClusterLinksById(
  clusterId: ClusterId,
  excludeSlug?: string,
  excludeKind?: "page" | "post",
): Promise<ClusterLinks | null> {
  const [analysis, overrides] = await Promise.all([
    getCachedAnalysis(),
    getCachedPillarOverrides(),
  ]);

  const clusterDef = CLUSTERS.find((c) => c.id === clusterId);
  if (!clusterDef) return null;

  const items = analysis.clusterMap.get(clusterId) ?? [];
  const pillar = resolvePillar(clusterId, items, overrides);

  const isExcluded = (i: ScoredItem) =>
    excludeSlug !== undefined && i.slug === excludeSlug && i.kind === excludeKind;

  const supporting = items
    .filter((i) => i.kind === "page" && i !== pillar && !isExcluded(i))
    .slice(0, 6);

  const blogPosts = items
    .filter((i) => i.kind === "post" && !isExcluded(i))
    .slice(0, 4);

  return {
    clusterId,
    clusterName: clusterDef.name,
    pillar,
    supporting,
    blogPosts,
  };
}

// Category slugs that need a forced cluster override because keyword scoring
// produces a tie and the wrong cluster wins (e.g. "Local SEO" scores equal
// against "seo" and "local-geo" but "seo" appears first in CLUSTERS).
const CATEGORY_CLUSTER_OVERRIDES: Partial<Record<string, ClusterId>> = {
  "local-seo": "local-geo",
};

/**
 * Resolves a cluster for a service category using `assignCluster()` on a
 * synthetic ContentItem built from the category name + description.
 * Categories listed in CATEGORY_CLUSTER_OVERRIDES skip keyword scoring and
 * use the specified cluster directly.
 */
export async function getClusterLinksForCategory(
  catSlug: string,
  catName: string,
  catDescription: string | null,
  excludeSlug?: string,
): Promise<ClusterLinks | null> {
  const overriddenCluster = CATEGORY_CLUSTER_OVERRIDES[catSlug];
  if (overriddenCluster) {
    return getClusterLinksById(overriddenCluster, excludeSlug, "page");
  }

  const synthetic: ContentItem = {
    id: 0,
    kind: "page",
    title: catName,
    slug: catSlug,
    status: "published",
    rawLen: 100,
    seoTitle: catDescription,
    seoDescription: catDescription,
  };
  const assignment = assignCluster(synthetic);
  if (!assignment) return null;
  return getClusterLinksById(assignment.clusterId, excludeSlug, "page");
}

/**
 * Resolves a cluster for a content item (page or blog post) by its slug.
 */
export async function getClusterLinksForSlug(
  slug: string,
  kind: "page" | "post",
): Promise<ClusterLinks | null> {
  const analysis = await getCachedAnalysis();
  const item = analysis.all.find((i) => i.slug === slug && i.kind === kind);
  if (!item) return null;
  const assignment = assignCluster(item);
  if (!assignment) return null;
  return getClusterLinksById(assignment.clusterId, slug, kind);
}

// ─── Admin dashboard helpers ──────────────────────────────────────────────────

export type ClusterSummary = {
  clusterId: ClusterId;
  clusterName: string;
  pillar: ScoredItem | null;
  pillarIsOverridden: boolean;
  pageCount: number;
  postCount: number;
  total: number;
  isSingleMember: boolean; // no peers to link to/from
};

export async function getAdminClusterSummaries(): Promise<{
  summaries: ClusterSummary[];
  uncategorized: ContentItem[];
  totalAssigned: number;
  totalUncategorized: number;
}> {
  const [analysis, overrides] = await Promise.all([
    getCachedAnalysis(),
    getCachedPillarOverrides(),
  ]);

  const summaries: ClusterSummary[] = [];

  for (const cluster of CLUSTERS) {
    const items = analysis.clusterMap.get(cluster.id) ?? [];
    if (items.length === 0) continue;

    const pillar = resolvePillar(cluster.id, items, overrides);
    const pillarIsOverridden = overrides.some((o) => o.clusterId === cluster.id);
    const pageCount = items.filter((i) => i.kind === "page").length;
    const postCount = items.filter((i) => i.kind === "post").length;

    summaries.push({
      clusterId: cluster.id,
      clusterName: cluster.name,
      pillar,
      pillarIsOverridden,
      pageCount,
      postCount,
      total: items.length,
      isSingleMember: items.length === 1,
    });
  }

  const totalAssigned = summaries.reduce((s, c) => s + c.total, 0);

  return {
    summaries,
    uncategorized: analysis.uncategorized,
    totalAssigned,
    totalUncategorized: analysis.uncategorized.length,
  };
}
