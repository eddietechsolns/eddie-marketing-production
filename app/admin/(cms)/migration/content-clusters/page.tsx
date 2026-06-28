import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Content Clusters | Admin" };

// ─── Cluster definitions ──────────────────────────────────────────────────────

const CLUSTERS = [
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

type ClusterId = typeof CLUSTERS[number]["id"];
type ClusterColor = typeof CLUSTERS[number]["color"];

const COLORS: Record<ClusterColor, { card: string; badge: string; text: string; bar: string; head: string }> = {
  blue:   { card: "bg-blue-50 border-blue-200",     badge: "bg-blue-100 text-blue-800",   text: "text-blue-700",   bar: "bg-blue-500",   head: "bg-blue-600"   },
  orange: { card: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-800", text: "text-orange-700", bar: "bg-orange-500", head: "bg-orange-600" },
  purple: { card: "bg-purple-50 border-purple-200", badge: "bg-purple-100 text-purple-800", text: "text-purple-700", bar: "bg-purple-500", head: "bg-purple-600" },
  teal:   { card: "bg-teal-50 border-teal-200",     badge: "bg-teal-100 text-teal-800",   text: "text-teal-700",   bar: "bg-teal-500",   head: "bg-teal-600"   },
  green:  { card: "bg-green-50 border-green-200",   badge: "bg-green-100 text-green-800", text: "text-green-700", bar: "bg-green-500",  head: "bg-green-600"  },
  rose:   { card: "bg-rose-50 border-rose-200",     badge: "bg-rose-100 text-rose-800",   text: "text-rose-700",   bar: "bg-rose-500",   head: "bg-rose-600"   },
  red:    { card: "bg-red-50 border-red-200",       badge: "bg-red-100 text-red-800",     text: "text-red-700",   bar: "bg-red-500",    head: "bg-red-600"    },
  indigo: { card: "bg-indigo-50 border-indigo-200", badge: "bg-indigo-100 text-indigo-800", text: "text-indigo-700", bar: "bg-indigo-500", head: "bg-indigo-600" },
  pink:   { card: "bg-pink-50 border-pink-200",     badge: "bg-pink-100 text-pink-800",   text: "text-pink-700",   bar: "bg-pink-500",   head: "bg-pink-600"   },
  yellow: { card: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-800", text: "text-yellow-700", bar: "bg-yellow-500", head: "bg-yellow-600" },
  amber:  { card: "bg-amber-50 border-amber-200",   badge: "bg-amber-100 text-amber-800", text: "text-amber-700", bar: "bg-amber-500",  head: "bg-amber-600"  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentItem = {
  id: number;
  kind: "page" | "post";
  title: string;
  slug: string;
  status: string;
  rawLen: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

type ScoredItem = ContentItem & { score: number; clusterId: ClusterId };

// ─── Analysis helpers ─────────────────────────────────────────────────────────

function searchText(item: ContentItem): string {
  return [
    item.title,
    item.slug.replace(/-/g, " "),
    item.seoTitle ?? "",
    item.seoDescription ?? "",
  ].join(" ").toLowerCase();
}

function scoreAgainstCluster(item: ContentItem, cluster: typeof CLUSTERS[number]): number {
  const text = searchText(item);
  const titleLower = item.title.toLowerCase();
  let score = 0;
  for (const kw of cluster.keywords) {
    if (text.includes(kw)) score++;
    if (titleLower.includes(kw)) score++; // title match scores double
  }
  return score;
}

function assignCluster(item: ContentItem): { clusterId: ClusterId; score: number } | null {
  let bestId: ClusterId | null = null;
  let bestScore = 0;
  for (const c of CLUSTERS) {
    const score = scoreAgainstCluster(item, c);
    if (score > bestScore) { bestScore = score; bestId = c.id; }
  }
  if (!bestId || bestScore === 0) return null;
  return { clusterId: bestId, score: bestScore };
}

const STOP_WORDS = new Set([
  "a","an","the","and","or","for","to","of","in","on","with","how","what",
  "why","your","you","is","are","be","can","will","that","this","it","as",
  "at","by","from","about","top","best","tips","guide","get","make","using",
  "use","vs","my","our","their","its","do","does","did","has","have",
]);

function sigWords(title: string): string[] {
  return title.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function titleSimilarity(a: string, b: string): number {
  const wa = new Set(sigWords(a));
  const wb = new Set(sigWords(b));
  if (wa.size === 0 || wb.size === 0) return 0;
  let overlap = 0;
  for (const w of wa) if (wb.has(w)) overlap++;
  return overlap / Math.min(wa.size, wb.size);
}

const THIN_THRESHOLD_PAGE = 600;   // raw HTML chars
const THIN_THRESHOLD_POST = 1200;

function isThin(item: ContentItem): boolean {
  if (item.status !== "published") return false;
  return item.kind === "page"
    ? item.rawLen < THIN_THRESHOLD_PAGE
    : item.rawLen < THIN_THRESHOLD_POST;
}

// ─── Data fetching ────────────────────────────────────────────────────────────

type DbRow = {
  id: number; title: string; slug: string; status: string;
  raw_len: number; seoTitle: string | null; seoDescription: string | null;
};

async function fetchContent(): Promise<ContentItem[]> {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContentClustersPage() {
  const all = await fetchContent();

  // Assign each item to a cluster
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

  // Sort each cluster by score DESC, then page-before-post for pillar selection
  for (const [, records] of clusterMap) {
    records.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.kind !== b.kind) return a.kind === "page" ? -1 : 1;
      return a.title.length - b.title.length;
    });
  }

  // Active clusters in definition order
  const activeClusters = CLUSTERS.filter(c => clusterMap.has(c.id));
  const totalClustered = all.length - uncategorized.length;

  // Issues
  const thinItems = all.filter(isThin);

  // Similar titles within each cluster (limit to 40 pairs total)
  type SimilarPair = { a: ScoredItem; b: ScoredItem; clusterName: string; sim: number };
  const similarPairs: SimilarPair[] = [];
  for (const cluster of activeClusters) {
    const records = clusterMap.get(cluster.id) ?? [];
    if (records.length < 2) continue;
    for (let i = 0; i < records.length && similarPairs.length < 40; i++) {
      for (let j = i + 1; j < records.length && similarPairs.length < 40; j++) {
        const sim = titleSimilarity(records[i].title, records[j].title);
        if (sim >= 0.6 && sigWords(records[i].title).length >= 2) {
          similarPairs.push({ a: records[i], b: records[j], clusterName: cluster.name, sim });
        }
      }
    }
  }
  similarPairs.sort((a, b) => b.sim - a.sim);

  // Cluster-level recommendations
  function clusterRecs(clusterId: ClusterId, records: ScoredItem[]): string[] {
    const recs: string[] = [];
    const missingSeo = records.filter(r => !r.seoTitle).length;
    const thinCount = records.filter(isThin).length;
    const posts = records.filter(r => r.kind === "post");
    const pages = records.filter(r => r.kind === "page");
    if (missingSeo > 0) recs.push(`${missingSeo} record${missingSeo > 1 ? "s" : ""} missing SEO title — fix before targeting this cluster`);
    if (thinCount > 0) recs.push(`${thinCount} published record${thinCount > 1 ? "s" : ""} with thin content — expand before promoting`);
    if (pages.length === 0 && posts.length > 0) recs.push("No pillar page exists — consider creating a dedicated service page as the cluster hub");
    if (posts.length > 5) recs.push(`${posts.length} supporting posts — ensure all link internally to the pillar page`);
    return recs;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Cluster Analyzer</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Read-only analysis · {all.length} records · {activeClusters.length} clusters detected
          </p>
        </div>
        <nav className="flex gap-1.5 text-xs">
          <a href="#cluster-map"   className="px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Cluster Map</a>
          <a href="#cluster-detail" className="px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Detail</a>
          <a href="#uncategorized" className="px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Uncategorized</a>
          <a href="#issues"        className="px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Issues</a>
        </nav>
      </div>

      {/* ── CLUSTER MAP ────────────────────────────────────────────────────── */}
      <section id="cluster-map" className="mb-10 scroll-mt-4">
        <SectionHeader title="Cluster Map" />

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Records"     value={all.length}             sub={`${all.filter(r => r.kind === "page").length} pages · ${all.filter(r => r.kind === "post").length} posts`} />
          <StatCard label="Clustered"         value={totalClustered}         sub={`${Math.round((totalClustered / all.length) * 100)}% coverage`} />
          <StatCard label="Uncategorized"     value={uncategorized.length}   sub="Did not match any cluster" warn={uncategorized.length > 20} />
          <StatCard label="Thin Content"      value={thinItems.length}       sub="Published, below content threshold" warn={thinItems.length > 0} />
        </div>

        {/* Cluster cards grid */}
        <div className="grid grid-cols-4 gap-3">
          {CLUSTERS.map(c => {
            const records = clusterMap.get(c.id) ?? [];
            if (records.length === 0) return null;
            const col = COLORS[c.color];
            const pages = records.filter(r => r.kind === "page").length;
            const posts = records.filter(r => r.kind === "post").length;
            const thinCount = records.filter(isThin).length;
            const pillar = records[0];
            return (
              <a key={c.id} href={`#cluster-${c.id}`}
                className={`rounded-lg border p-4 hover:shadow-sm transition-shadow ${col.card}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-sm font-semibold ${col.text}`}>{c.name}</span>
                  <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${col.badge}`}>{records.length}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                  <div>{pages} page{pages !== 1 ? "s" : ""} · {posts} post{posts !== 1 ? "s" : ""}</div>
                  {thinCount > 0 && <div className="text-amber-600 font-medium">⚠ {thinCount} thin content</div>}
                </div>
                <div className="text-xs text-gray-400 truncate" title={pillar?.title}>
                  Pillar: <span className="text-gray-600">{pillar?.title ?? "—"}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Coverage bar */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Content Distribution</p>
          <div className="flex rounded-full overflow-hidden h-4 gap-px">
            {activeClusters.map(c => {
              const records = clusterMap.get(c.id) ?? [];
              const pct = (records.length / all.length) * 100;
              if (pct < 0.5) return null;
              return (
                <div
                  key={c.id}
                  title={`${c.name}: ${records.length} records (${Math.round(pct)}%)`}
                  style={{ width: `${pct}%` }}
                  className={`${COLORS[c.color].bar} first:rounded-l-full last:rounded-r-full`}
                />
              );
            })}
            {uncategorized.length > 0 && (
              <div
                title={`Uncategorized: ${uncategorized.length} records`}
                style={{ width: `${(uncategorized.length / all.length) * 100}%` }}
                className="bg-gray-300 last:rounded-r-full"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {activeClusters.map(c => {
              const count = clusterMap.get(c.id)?.length ?? 0;
              return (
                <span key={c.id} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className={`inline-block w-2.5 h-2.5 rounded-sm ${COLORS[c.color].bar}`} />
                  {c.name} ({count})
                </span>
              );
            })}
            {uncategorized.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-300" />
                Uncategorized ({uncategorized.length})
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── CLUSTER DETAIL ──────────────────────────────────────────────────── */}
      <section id="cluster-detail" className="mb-10 scroll-mt-4">
        <SectionHeader title="Cluster Detail" />

        <div className="space-y-8">
          {activeClusters.map(cluster => {
            const records = clusterMap.get(cluster.id) ?? [];
            const col = COLORS[cluster.color];
            const pillar = records[0];
            const supporting = records.slice(1, 11);
            const moreCount = records.length - 1 - supporting.length;
            const pages = records.filter(r => r.kind === "page").length;
            const posts = records.filter(r => r.kind === "post").length;
            const missSeo = records.filter(r => !r.seoTitle).length;
            const thinCount = records.filter(isThin).length;
            const recs = clusterRecs(cluster.id, records);

            return (
              <div key={cluster.id} id={`cluster-${cluster.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden scroll-mt-4">
                {/* Cluster header */}
                <div className={`px-5 py-3 ${col.card} border-b border-gray-200 flex items-center justify-between`}>
                  <div>
                    <span className={`text-sm font-bold ${col.text}`}>{cluster.name}</span>
                    <span className="text-xs text-gray-500 ml-3">{cluster.description}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>{pages} pages</span>
                    <span>{posts} posts</span>
                    {missSeo > 0 && <span className="text-red-500">{missSeo} missing SEO title</span>}
                    {thinCount > 0 && <span className="text-amber-500">{thinCount} thin content</span>}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Pillar suggestion */}
                  {pillar && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Suggested Pillar Page
                      </p>
                      <div className={`rounded-lg border p-3 ${col.card}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{pillar.title}</p>
                            <p className="font-mono text-xs text-gray-400 mt-0.5">{pillar.slug}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <KindBadge kind={pillar.kind} />
                            <ScoreBadge score={pillar.score} />
                            {isThin(pillar) && <IssuePill label="Thin" />}
                            {!pillar.seoTitle && <IssuePill label="No SEO title" />}
                          </div>
                        </div>
                        {pillar.kind === "post" && (
                          <p className="text-xs text-amber-600 mt-2">
                            ⚠ Only a blog post qualifies as pillar — consider creating a dedicated service/landing page.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Supporting pages */}
                  {supporting.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Supporting Content ({records.length - 1} total{moreCount > 0 ? `, showing 10` : ""})
                      </p>
                      <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              {["Title / Slug", "Kind", "Status", "SEO Title", "Content"].map(h => (
                                <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {supporting.map(r => (
                              <tr key={`${r.kind}-${r.id}`} className="hover:bg-gray-50">
                                <td className="px-3 py-2">
                                  <p className="text-gray-800 font-medium text-xs truncate max-w-xs" title={r.title}>{r.title}</p>
                                  <p className="text-gray-400 font-mono text-xs">{r.slug}</p>
                                </td>
                                <td className="px-3 py-2"><KindBadge kind={r.kind} /></td>
                                <td className="px-3 py-2">
                                  <span className={`text-xs font-medium ${r.status === "published" ? "text-green-600" : "text-gray-400"}`}>
                                    {r.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  {r.seoTitle
                                    ? <span className="text-green-600 text-xs">✓</span>
                                    : <span className="text-red-400 text-xs font-medium">Missing</span>}
                                </td>
                                <td className="px-3 py-2">
                                  {isThin(r)
                                    ? <span className="text-xs text-amber-600 font-medium">Thin</span>
                                    : <span className="text-green-600 text-xs">✓</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {moreCount > 0 && (
                          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                            <p className="text-xs text-gray-400">+ {moreCount} more records in this cluster</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {recs.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recommendations</p>
                      {recs.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="text-blue-400 mt-0.5 shrink-0">→</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── UNCATEGORIZED ──────────────────────────────────────────────────── */}
      <section id="uncategorized" className="mb-10 scroll-mt-4">
        <SectionHeader title={`Uncategorized Content (${uncategorized.length})`} />
        {uncategorized.length === 0 ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm font-medium text-green-700">✓ All content assigned to a cluster.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              These records did not match any cluster's keywords. They may need new cluster definitions,
              better slug/title wording, or SEO title/description that contains topic keywords.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                    <tr>
                      {["Kind", "Title / Slug", "Status", "SEO Title"].map(h => (
                        <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {uncategorized.map(r => (
                      <tr key={`${r.kind}-${r.id}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5"><KindBadge kind={r.kind} /></td>
                        <td className="px-4 py-2.5">
                          <p className="text-gray-800 font-medium text-sm truncate max-w-sm" title={r.title}>{r.title}</p>
                          <p className="text-gray-400 font-mono text-xs">{r.slug}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-medium ${r.status === "published" ? "text-green-600" : "text-gray-400"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          {r.seoTitle
                            ? <span className="text-green-600 text-xs truncate block max-w-xs" title={r.seoTitle}>{r.seoTitle}</span>
                            : <span className="text-red-400 text-xs">Missing</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── ISSUES ─────────────────────────────────────────────────────────── */}
      <section id="issues" className="mb-10 scroll-mt-4">
        <SectionHeader title="Issues" />

        <div className="space-y-6">
          {/* Thin content */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Thin Content — {thinItems.length} published record{thinItems.length !== 1 ? "s" : ""} below content threshold
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Thresholds: pages &lt; {THIN_THRESHOLD_PAGE} raw chars · posts &lt; {THIN_THRESHOLD_POST} raw chars.
              Thin content harms crawl budget and may not rank. Expand or merge with related pages.
            </p>
            {thinItems.length === 0 ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-700">✓ No thin content detected among published records.</p>
              </div>
            ) : (
              <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50 border-b border-amber-100 sticky top-0">
                      <tr>
                        {["Kind","Title / Slug","Cluster","Raw Content Length","Recommendation"].map(h => (
                          <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-amber-700 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {thinItems.map(r => {
                        const assignment = assignCluster(r);
                        const clusterName = assignment
                          ? CLUSTERS.find(c => c.id === assignment.clusterId)?.name ?? "—"
                          : "Uncategorized";
                        return (
                          <tr key={`${r.kind}-${r.id}`} className="hover:bg-amber-50">
                            <td className="px-4 py-2.5"><KindBadge kind={r.kind} /></td>
                            <td className="px-4 py-2.5">
                              <p className="text-gray-800 font-medium text-xs truncate max-w-xs" title={r.title}>{r.title}</p>
                              <p className="text-gray-400 font-mono text-xs">{r.slug}</p>
                            </td>
                            <td className="px-4 py-2.5 text-xs text-gray-600">{clusterName}</td>
                            <td className="px-4 py-2.5">
                              <span className="font-mono text-xs text-amber-700">{r.rawLen} chars</span>
                            </td>
                            <td className="px-4 py-2.5 text-xs text-gray-600">
                              {r.rawLen === 0 ? "No content — add or remove page" : "Expand content or merge with a related page"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Similar titles */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Similar &amp; Duplicate Titles — {similarPairs.length} pair{similarPairs.length !== 1 ? "s" : ""} detected
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Titles sharing ≥ 60% of significant words within the same cluster. These may target the same
              keyword intent and compete against each other. Consider consolidating, redirecting, or
              clearly differentiating the topics.
            </p>
            {similarPairs.length === 0 ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-700">✓ No highly-similar title pairs found within clusters.</p>
              </div>
            ) : (
              <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-red-50 border-b border-red-100 sticky top-0">
                      <tr>
                        {["Cluster","Title A","Title B","Similarity","Action"].map(h => (
                          <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-red-700 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {similarPairs.map((pair, i) => (
                        <tr key={i} className="hover:bg-red-50">
                          <td className="px-4 py-2.5 text-xs text-gray-600 whitespace-nowrap">{pair.clusterName}</td>
                          <td className="px-4 py-2.5">
                            <p className="text-xs text-gray-800 font-medium truncate max-w-52" title={pair.a.title}>{pair.a.title}</p>
                            <p className="text-xs text-gray-400 font-mono">{pair.a.kind}</p>
                          </td>
                          <td className="px-4 py-2.5">
                            <p className="text-xs text-gray-800 font-medium truncate max-w-52" title={pair.b.title}>{pair.b.title}</p>
                            <p className="text-xs text-gray-400 font-mono">{pair.b.kind}</p>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-xs font-bold ${pair.sim >= 0.9 ? "text-red-600" : pair.sim >= 0.75 ? "text-orange-500" : "text-yellow-600"}`}>
                              {Math.round(pair.sim * 100)}%
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">
                            {pair.sim >= 0.9 ? "Likely duplicate — consolidate or remove" : "Review — differentiate or merge"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Display components ───────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{title}</h2>
  );
}

function StatCard({ label, value, sub, warn }: {
  label: string; value: number; sub: string; warn?: boolean;
}) {
  return (
    <div className={`rounded-lg border px-4 py-4 ${warn && value > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${warn && value > 0 ? "text-amber-700" : "text-gray-800"}`}>{value}</p>
      <p className={`text-xs mt-1 ${warn && value > 0 ? "text-amber-500" : "text-gray-400"}`}>{sub}</p>
    </div>
  );
}

function KindBadge({ kind }: { kind: "page" | "post" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
      kind === "page" ? "bg-slate-100 text-slate-700" : "bg-sky-100 text-sky-700"
    }`}>
      {kind === "page" ? "Page" : "Post"}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
      score {score}
    </span>
  );
}

function IssuePill({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600">
      {label}
    </span>
  );
}
