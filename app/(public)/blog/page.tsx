import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import BlogSearchInput from "@/components/blog/BlogSearchInput";
import { ExploreMoreSection } from "@/components/internal-links/ExploreMoreSection";
import { getSectionImage } from "@/lib/page-images";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { category, page: pageParam, q } = await searchParams;
  const isFiltered = !!(category || q || (pageParam && parseInt(pageParam, 10) > 1));

  const base = buildMetadata({
    title: "Digital Marketing Blog",
    description:
      "Expert insights on SEO, Google Ads, social media, and digital marketing strategy from the Eddie Marketing Solutions team.",
    path: "/blog",
  });

  if (isFiltered) {
    return {
      ...base,
      robots: { index: false, follow: true },
      alternates: { canonical: "/blog" },
    };
  }

  return base;
}

const BLOG_CATEGORIES = [
  { label: "All Articles", slug: null },
  { label: "SEO", slug: "seo" },
  { label: "Google Ads", slug: "google-ads" },
  { label: "Social Media", slug: "social-media" },
  { label: "Content Marketing", slug: "content-marketing" },
  { label: "Web Design", slug: "web-design" },
  { label: "Analytics", slug: "analytics" },
  { label: "Industry Marketing", slug: "industry-marketing" },
];

const PER_PAGE = 9;

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" });
}

function estimateReadingMins(excerpt: string | null | undefined): number {
  const words = excerpt?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(3, Math.round((words * 12) / 200));
}

interface SearchParams {
  category?: string;
  page?: string;
  q?: string;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, page: pageParam, q } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const showFeatured = currentPage === 1 && !q && !category;

  const baseWhere = {
    status: "published" as const,
    ...(category ? { categories: { some: { slug: category } } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { excerpt: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const featured = showFeatured
    ? await prisma.blogPost.findFirst({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        include: { categories: { select: { name: true, slug: true } } },
      })
    : null;

  const gridWhere = {
    ...baseWhere,
    ...(featured ? { slug: { not: featured.slug } } : {}),
  };

  const [totalCount, gridPosts] = await Promise.all([
    prisma.blogPost.count({ where: gridWhere }),
    prisma.blogPost.findMany({
      where: gridWhere,
      orderBy: { publishedAt: "desc" },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { categories: { select: { name: true, slug: true } } },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const totalArticles = totalCount + (featured ? 1 : 0);

  function pageUrl(p: number): string {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  }

  function categoryUrl(slug: string | null): string {
    if (!slug) return "/blog";
    return `/blog?category=${slug}`;
  }

  const pageNumbers: number[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 7; i++) pageNumbers.push(i);
  } else if (currentPage >= totalPages - 3) {
    for (let i = totalPages - 6; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    for (let i = currentPage - 3; i <= currentPage + 3; i++) pageNumbers.push(i);
  }

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${SITE_URL}/blog#blog`,
            name: `Digital Marketing Blog | ${SITE_NAME}`,
            url: `${SITE_URL}/blog`,
            description:
              "Expert insights on SEO, Google Ads, social media, and digital marketing strategy.",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Blog</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Insights &amp; Strategy
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            Digital Marketing Blog
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-2">
            Expert insights on SEO, paid media, social strategy, and growth marketing from our team of specialists.
          </p>
          {showFeatured && totalArticles > 0 && (
            <p className="text-sm text-slate-500 mb-6">
              {totalArticles} article{totalArticles !== 1 ? "s" : ""} published
            </p>
          )}
          <div className="mt-6">
            <BlogSearchInput defaultValue={q} currentCategory={category} />
          </div>
        </div>
      </div>

      {/* ── Category Filter Tabs ──────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = cat.slug === null ? !category : category === cat.slug;
              return (
                <Link
                  key={cat.slug ?? "all"}
                  href={categoryUrl(cat.slug)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* Search result header */}
        {q && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-slate-600">
              <span className="font-semibold">{totalCount + (featured ? 1 : 0)}</span>{" "}
              result{(totalCount + (featured ? 1 : 0)) !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
            </p>
            <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Clear search ×
            </Link>
          </div>
        )}

        {/* ── Featured Article ─────────────────────────────────────────── */}
        {featured && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text">Featured Article</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <Link
              href={`/blog/${featured.slug}`}
              className="group flex flex-col md:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Visual panel */}
              {(() => {
                const featImg = getSectionImage(
                  featured.slug,
                  0,
                  featured.categories[0]?.name ?? featured.title
                );
                return (
                  <div className="md:w-5/12 min-h-[220px] md:min-h-[280px] relative overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src={featImg.src}
                      alt={featImg.alt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-900/20 to-blue-950/40" />
                    {featured.categories[0]?.name && (
                      <span className="absolute top-4 left-4 text-xs font-semibold text-white ems-gradient-bg px-3 py-1 rounded-full z-10">
                        {featured.categories[0].name}
                      </span>
                    )}
                  </div>
                );
              })()}
              {/* Copy */}
              <div className="flex flex-col justify-between p-7 md:p-10 md:w-7/12">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  {featured.excerpt ? (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-5">
                      {featured.excerpt}
                    </p>
                  ) : (
                    <p className="text-slate-400 text-sm italic mb-5">Read the full article →</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {featured.author && (
                      <span className="font-medium text-slate-600">{featured.author}</span>
                    )}
                    {featured.publishedAt && (
                      <>
                        <span>·</span>
                        <time dateTime={featured.publishedAt.toISOString()}>
                          {formatDate(featured.publishedAt)}
                        </time>
                      </>
                    )}
                    {(featured.excerpt || featured.content) && (
                      <>
                        <span>·</span>
                        <span>{estimateReadingMins(featured.excerpt)} min read</span>
                      </>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors shrink-0">
                    Read article
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid header */}
        {gridPosts.length > 0 && (
          <div className="flex items-center gap-3 mb-7">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500">
              {featured ? "Latest Articles" : category ? (BLOG_CATEGORIES.find((c) => c.slug === category)?.label ?? "Articles") : "All Articles"}
            </span>
            {totalPages > 1 && (
              <span className="text-xs text-slate-400">
                — Page {currentPage} of {totalPages}
              </span>
            )}
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        )}

        {/* ── Article Grid ─────────────────────────────────────────────── */}
        {gridPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {gridPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                >
                  {/* Thumbnail */}
                  {(() => {
                    const cardImg = getSectionImage(
                      post.slug,
                      post.id % 6,
                      post.categories[0]?.name ?? post.title
                    );
                    return (
                      <div className="relative h-40 overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={cardImg.src}
                          alt={cardImg.alt}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    );
                  })()}

                  <div className="flex flex-col flex-1 p-5">
                    {/* Category + reading time row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {post.categories[0]?.name ? (
                        <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full leading-none">
                          {post.categories[0].name}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {estimateReadingMins(post.excerpt)} min
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm font-semibold text-slate-900 mb-2.5 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug flex-1">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3.5 border-t border-slate-100 mt-auto">
                      <span className="truncate pr-2">{post.author || "—"}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt.toISOString()}>
                            {formatDate(post.publishedAt)}
                          </time>
                        )}
                        <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ── Pagination ───────────────────────────────────────────── */}
            {totalPages > 1 && (
              <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 flex-wrap">
                {currentPage > 1 && (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Link>
                )}

                {pageNumbers.map((pn) => (
                  <Link
                    key={pn}
                    href={pageUrl(pn)}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                      pn === currentPage
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {pn}
                  </Link>
                ))}

                {currentPage < totalPages && (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          !featured && (
            <div className="text-center py-24 text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1">
                {q ? `No results for "${q}"` : "No articles in this category yet"}
              </p>
              <p className="text-sm text-slate-500 mb-6">
                {q ? "Try a different search term or browse all articles." : "Check back soon or explore all articles."}
              </p>
              <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                View all articles →
              </Link>
            </div>
          )
        )}
      </div>

      <ExploreMoreSection
        eyebrow="More Resources"
        title="Tools, Guides, and Services to Grow Your Business"
        exclude={["/blog"]}
      />

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Work With Us</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to put these strategies to work?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get a custom digital marketing plan built for your business goals and budget.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">
            Get a Free Consultation
          </Button>
        </div>
      </div>
    </>
  );
}
