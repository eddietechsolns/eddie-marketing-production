import { prisma } from "@/lib/prisma";

// ─── Cluster definitions ──────────────────────────────────────────────────────

export const CLUSTERS = [
  {
    id: "seo", name: "SEO", color: "blue" as const,
    description: "Organic search, ranking, link building, technical SEO",
    keywords: [
      "seo", "search engine optimization", "link building", "on-page seo",
      "on page seo", "off-page seo", "keyword research", "organic search",
      "backlink", "technical seo", "serp", "search ranking", "seo strategy",
      "seo analysis", "search engine", "seo services", "seo agency",
    ],
  },
  {
    id: "ppc", name: "Google Ads / PPC", color: "orange" as const,
    description: "Paid search, display advertising, PPC campaigns",
    keywords: [
      "google ads", "adwords", "google adwords", "ppc", "pay per click",
      "pay-per-click", "display advertising", "display media", "bing ads",
      "google adsense", "adsense", "search engine marketing", "sem",
      "paid advertising", "paid search", "cpc", "ppc management",
    ],
  },
  {
    id: "social-media", name: "Social Media", color: "purple" as const,
    description: "Social media marketing, ads, and platform management",
    keywords: [
      "social media", "facebook", "instagram", "twitter", "linkedin",
      "snapchat", "tiktok", "tik tok", "youtube advertising", "youtube marketing",
      "social marketing", "social advertising", "social media ads",
      "social media marketing", "social media management",
    ],
  },
  {
    id: "web-design", name: "Web Design & Dev", color: "teal" as const,
    description: "Website design, development, platforms, and apps",
    keywords: [
      "web design", "website design", "website development", "web development",
      "wordpress", "joomla", "magento", "squarespace", "html5",
      "application development", "responsive design", "website redesign",
      "website builder", "web design agency",
    ],
  },
  {
    id: "content-marketing", name: "Content Marketing", color: "green" as const,
    description: "Content creation, blogging, copywriting",
    keywords: [
      "content marketing", "content creation", "blog writing", "copywriting",
      "guest blogging", "sponsored content", "content strategy",
      "blogging", "inbound marketing", "website content", "blog post",
    ],
  },
  {
    id: "video-creative", name: "Video & Creative", color: "rose" as const,
    description: "Video production, photography, graphic design",
    keywords: [
      "video content", "video marketing", "videography", "photography",
      "graphic design", "video production", "video advertising",
      "youtube video", "visual content", "creative services", "video",
    ],
  },
  {
    id: "analytics", name: "Analytics & Tools", color: "red" as const,
    description: "Analytics, reporting, and tracking tools",
    keywords: [
      "analytics", "reporting", "google analytics", "google tag manager",
      "search console", "google search console", "tracking", "roi",
      "metrics", "kpi", "attribution", "data analysis", "analytics and reporting",
    ],
  },
  {
    id: "email-influencer", name: "Email & Influencer", color: "indigo" as const,
    description: "Email campaigns and influencer marketing",
    keywords: [
      "email marketing", "influencer marketing", "influencer",
      "newsletter", "email campaign", "email list", "drip campaign",
    ],
  },
  {
    id: "ecommerce", name: "Ecommerce", color: "pink" as const,
    description: "Online stores, product marketing, conversion",
    keywords: [
      "ecommerce", "e-commerce", "online store", "product pages",
      "online sales", "shopify", "woocommerce", "shopping",
      "checkout", "conversion rate",
    ],
  },
  {
    id: "local-geo", name: "Local SEO & Geo", color: "yellow" as const,
    description: "Local search, geolocation, Google My Business",
    keywords: [
      "local seo", "local search", "google my business", "gmb",
      "geo landing", "geofencing", "local marketing", "near me",
      "local business", "local listing",
    ],
  },
  {
    id: "dubai-market", name: "Dubai / UAE Market", color: "amber" as const,
    description: "Digital marketing focused on the UAE/Dubai market",
    keywords: [
      "digital marketing in dubai", "digital marketing dubai",
      "digital marketing agency in", "agency in dubai", "agency in uae",
      "services in dubai", "services dubai", "marketing dubai",
      "in uae", "uae", "dubai",
    ],
  },
] as const;

export type ClusterId = typeof CLUSTERS[number]["id"];
export type ClusterColor = typeof CLUSTERS[number]["color"];
export type ClusterDef = typeof CLUSTERS[number];

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentItem = {
  id: number;
  kind: "page" | "post";
  title: string;
  slug: string;
  status: string;
  rawLen: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type ScoredItem = ContentItem & { score: number; clusterId: ClusterId };

export type ActionLabel =
  | "Keep as Pillar"
  | "Keep as Supporting"
  | "Merge Later"
  | "Expand Later"
  | "Redirect Later"
  | "Needs Manual Review";

export type ActionItem = {
  item: ContentItem;
  action: ActionLabel;
  reason: string;
  clusterName: string;
  clusterId: ClusterId | "uncategorized";
};

// ─── Analysis helpers ─────────────────────────────────────────────────────────

function searchText(item: ContentItem): string {
  return [
    item.title,
    item.slug.replace(/-/g, " "),
    item.seoTitle ?? "",
    item.seoDescription ?? "",
  ].join(" ").toLowerCase();
}

function scoreAgainstCluster(item: ContentItem, cluster: ClusterDef): number {
  const text = searchText(item);
  const titleLower = item.title.toLowerCase();
  let score = 0;
  for (const kw of cluster.keywords) {
    if (text.includes(kw)) score++;
    if (titleLower.includes(kw)) score++; // title match scores double
  }
  return score;
}

export function assignCluster(item: ContentItem): { clusterId: ClusterId; score: number } | null {
  let bestId: ClusterId | null = null;
  let bestScore = 0;
  for (const c of CLUSTERS) {
    const score = scoreAgainstCluster(item, c);
    if (score > bestScore) { bestScore = score; bestId = c.id; }
  }
  if (!bestId || bestScore === 0) return null;
  return { clusterId: bestId, score: bestScore };
}

export const THIN_THRESHOLD_PAGE = 600;
export const THIN_THRESHOLD_POST = 1200;

export function isThin(item: ContentItem): boolean {
  if (item.status !== "published") return false;
  return item.kind === "page"
    ? item.rawLen < THIN_THRESHOLD_PAGE
    : item.rawLen < THIN_THRESHOLD_POST;
}

const STOP_WORDS = new Set([
  "a","an","the","and","or","for","to","of","in","on","with","how","what",
  "why","your","you","is","are","be","can","will","that","this","it","as",
  "at","by","from","about","top","best","tips","guide","get","make","using",
  "use","vs","my","our","their","its","do","does","did","has","have",
]);

export function sigWords(title: string): string[] {
  return title.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

export function titleSimilarity(a: string, b: string): number {
  const wa = new Set(sigWords(a));
  const wb = new Set(sigWords(b));
  if (wa.size === 0 || wb.size === 0) return 0;
  let overlap = 0;
  for (const w of wa) if (wb.has(w)) overlap++;
  return overlap / Math.min(wa.size, wb.size);
}

// ─── DB fetch ─────────────────────────────────────────────────────────────────

type DbRow = {
  id: number; title: string; slug: string; status: string;
  raw_len: number; seoTitle: string | null; seoDescription: string | null;
};

export async function fetchContent(): Promise<ContentItem[]> {
  const [pages, posts] = await Promise.all([
    prisma.$queryRawUnsafe<DbRow[]>(`
      SELECT id, title, slug, status,
             COALESCE(LENGTH(content), 0) AS raw_len,
             "seoTitle", "seoDescription"
      FROM "Page" ORDER BY id
    `),
    prisma.$queryRawUnsafe<DbRow[]>(`
      SELECT id, title, slug, status,
             COALESCE(LENGTH(content), 0) AS raw_len,
             "seoTitle", "seoDescription"
      FROM "BlogPost" ORDER BY id
    `),
  ]);
  return [
    ...pages.map(r => ({ ...r, kind: "page" as const, rawLen: Number(r.raw_len) })),
    ...posts.map(r => ({ ...r, kind: "post" as const, rawLen: Number(r.raw_len) })),
  ];
}

// ─── Core analysis ────────────────────────────────────────────────────────────

export type ClusterAnalysis = {
  all: ContentItem[];
  clusterMap: Map<ClusterId, ScoredItem[]>;
  uncategorized: ContentItem[];
};

export async function runClusterAnalysis(): Promise<ClusterAnalysis> {
  const all = await fetchContent();

  const clusterMap = new Map<ClusterId, ScoredItem[]>();
  const uncategorized: ContentItem[] = [];

  for (const item of all) {
    const result = assignCluster(item);
    if (result) {
      const { clusterId, score } = result;
      if (!clusterMap.has(clusterId)) clusterMap.set(clusterId, []);
      clusterMap.get(clusterId)!.push({ ...item, clusterId, score });
    } else {
      uncategorized.push(item);
    }
  }

  // Sort each cluster: score DESC, then page before post, then shorter title
  for (const [, records] of clusterMap) {
    records.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.kind !== b.kind) return a.kind === "page" ? -1 : 1;
      return a.title.length - b.title.length;
    });
  }

  return { all, clusterMap, uncategorized };
}

// ─── Action plan ──────────────────────────────────────────────────────────────

export function computeActionPlan(
  clusterMap: Map<ClusterId, ScoredItem[]>,
  uncategorized: ContentItem[],
): ActionItem[] {
  const result: ActionItem[] = [];

  for (const cluster of CLUSTERS) {
    const records = clusterMap.get(cluster.id) ?? [];
    if (records.length === 0) continue;

    // Compute max similarity info per index within this cluster
    type SimInfo = { sim: number; otherTitle: string };
    const maxSim = new Map<number, SimInfo>();

    for (let i = 0; i < records.length; i++) {
      if (sigWords(records[i].title).length < 2) continue;
      for (let j = i + 1; j < records.length; j++) {
        const sim = titleSimilarity(records[i].title, records[j].title);
        if (sim < 0.6) continue;

        const ci = maxSim.get(i);
        if (!ci || sim > ci.sim) maxSim.set(i, { sim, otherTitle: records[j].title });
        const cj = maxSim.get(j);
        if (!cj || sim > cj.sim) maxSim.set(j, { sim, otherTitle: records[i].title });
      }
    }

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      const simInfo = maxSim.get(i);
      let action: ActionLabel;
      let reason: string;

      if (i === 0) {
        action = "Keep as Pillar";
        reason = `Relevance score ${r.score} — highest in ${cluster.name}. Set as the cluster hub; ensure all supporting content links here.`;
      } else if (simInfo && simInfo.sim >= 0.9) {
        action = "Redirect Later";
        reason = `${Math.round(simInfo.sim * 100)}% title match with "${simInfo.otherTitle}" — near-duplicate. Consolidate content, then add 301 redirect.`;
      } else if (simInfo && simInfo.sim >= 0.6) {
        action = "Merge Later";
        reason = `${Math.round(simInfo.sim * 100)}% title overlap with "${simInfo.otherTitle}" — similar keyword intent. Merge into one stronger page.`;
      } else if (isThin(r)) {
        action = "Expand Later";
        reason = `Published with only ${r.rawLen} raw chars — below minimum for ranking. Expand to 800+ words before promoting.`;
      } else {
        action = "Keep as Supporting";
        reason = `Good topical fit for ${cluster.name}. Add an internal link pointing to the cluster pillar page.`;
      }

      result.push({ item: r, action, reason, clusterName: cluster.name, clusterId: cluster.id });
    }
  }

  for (const item of uncategorized) {
    result.push({
      item,
      action: "Needs Manual Review",
      reason: "Did not match any cluster. Add topic keywords to title/SEO fields or assign to an existing cluster manually.",
      clusterName: "Uncategorized",
      clusterId: "uncategorized",
    });
  }

  return result;
}
