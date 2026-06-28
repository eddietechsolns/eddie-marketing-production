import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { TrackPageView } from "@/components/analytics/TrackPageView";
import { ResourceArticleBlock } from "@/components/blog/ResourceArticleBlock";
import { cleanBlogContent } from "@/lib/content-cleanup";
import AuthorBio from "@/components/blog/AuthorBio";
import { getAuthorByName } from "@/lib/authors";
import { extractKeyTakeaways, splitAtMidpointH2 } from "@/lib/blog-content-parser";
import { getSectionImage } from "@/lib/page-images";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Not Found" };
  const resolvedTitle = post.seoTitle ?? post.title;
  const authorProfile = post.author ? getAuthorByName(post.author) : null;
  const displayAuthor = authorProfile?.name ?? "Eddie Marketing Team";
  return buildMetadata({
    title: resolvedTitle,
    description:
      post.seoDescription ??
      post.excerpt ??
      `Read "${resolvedTitle}" — expert digital marketing insights from Eddie Marketing Solutions FZE.`,
    path: `/blog/${slug}`,
    ogType: "article",
    publishedTime: post.publishedAt?.toISOString(),
    authors: [displayAuthor],
  });
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return posts;
}

function readingTime(content: string | null | undefined): number {
  if (!content) return 1;
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDateShort(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const PROSE_CLASSES = [
  "prose prose-slate max-w-none",
  "text-slate-700 leading-7",
  // Headings
  "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900",
  "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-100",
  "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
  "prose-h4:text-base prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-3",
  // Paragraphs
  "prose-p:leading-7 prose-p:text-slate-700",
  // Links
  "prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium hover:prose-a:underline",
  // Bold
  "prose-strong:text-slate-900 prose-strong:font-semibold",
  // Lists
  "prose-ul:space-y-1.5 prose-ol:space-y-1.5",
  "prose-li:text-slate-700 prose-li:leading-relaxed",
  // Blockquote
  "prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50/40 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-700",
  // Inline code
  "prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:text-[0.875em] prose-code:font-mono prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
  // Code blocks
  "prose-pre:bg-slate-950 prose-pre:text-slate-200 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:border prose-pre:border-slate-800 prose-pre:overflow-x-auto",
  // Images
  "prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto",
  // Tables
  "prose-table:text-sm prose-table:w-full",
  "prose-th:bg-slate-50 prose-th:font-semibold prose-th:text-slate-900 prose-th:py-3 prose-th:px-4 prose-th:text-left",
  "prose-td:py-3 prose-td:px-4 prose-td:border-b prose-td:border-slate-100",
  // HR
  "prose-hr:border-slate-200 prose-hr:my-10",
].join(" ");

// ─── Category-aware bottom CTA ────────────────────────────────────────────────
const CATEGORY_CTA: Record<string, { eyebrow: string; title: string; description: string; submitLabel: string }> = {
  "SEO": {
    eyebrow: "Free SEO Audit",
    title: "Get a Custom SEO Growth Plan",
    description: "Our specialists will audit your current rankings and build a tailored strategy to increase organic traffic and leads for your business in UAE.",
    submitLabel: "Book My Free SEO Audit",
  },
  "Local SEO": {
    eyebrow: "Free Local SEO Review",
    title: "Dominate Local Search in Your Area",
    description: "Get a personalised local SEO strategy that puts your business in front of nearby customers searching for exactly what you offer.",
    submitLabel: "Get My Local SEO Plan",
  },
  "Google Ads": {
    eyebrow: "Free PPC Audit",
    title: "Reduce Wasted Ad Spend — Free Audit",
    description: "Our Google Ads team will review your campaigns, identify budget waste, and show you how to lower cost-per-lead while increasing conversions.",
    submitLabel: "Get My Free PPC Audit",
  },
  "Social Media": {
    eyebrow: "Free Social Media Strategy",
    title: "Turn Followers Into Paying Customers",
    description: "Get a customised social media marketing plan that builds your brand authority and drives measurable leads for your business.",
    submitLabel: "Get My Social Strategy",
  },
  "Content Marketing": {
    eyebrow: "Free Content Strategy Session",
    title: "Build Authority With Content That Converts",
    description: "Get a content strategy that attracts your ideal customers, ranks on Google, and establishes your brand as the go-to authority in your industry.",
    submitLabel: "Get My Content Plan",
  },
  "Analytics": {
    eyebrow: "Free Analytics Review",
    title: "Make Smarter Decisions With Better Data",
    description: "We'll set up proper tracking and attribution so you can see exactly which channels are driving revenue — and stop wasting budget on what isn't.",
    submitLabel: "Book My Analytics Review",
  },
  "Web Design": {
    eyebrow: "Free Website Review",
    title: "Turn Your Website Into a Lead Machine",
    description: "Our web specialists will analyse your current site and show you how to improve conversion rates and turn more visitors into paying clients.",
    submitLabel: "Get My Website Review",
  },
  "Email Marketing": {
    eyebrow: "Free Email Marketing Audit",
    title: "Maximise Revenue From Your Email List",
    description: "Get a professional audit of your email sequences, segmentation, and automation — and a plan to increase open rates and drive more sales.",
    submitLabel: "Get My Email Audit",
  },
};

function getCategoryCta(category?: string) {
  return (
    CATEGORY_CTA[category ?? ""] ?? {
      eyebrow: "Free Consultation",
      title: "Put These Insights Into Action",
      description: "Get a custom marketing plan built around your goals. We'll show you exactly how to apply these strategies for your business.",
      submitLabel: "Get a Free Plan",
    }
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { categories: { select: { name: true, slug: true } } },
  });

  if (!post || post.status !== "published") notFound();

  const postCategorySlug = post.categories[0]?.slug;

  const [relatedPosts, serviceCategories] = await Promise.all([
    postCategorySlug
      ? prisma.blogPost.findMany({
          where: {
            status: "published",
            slug: { not: slug },
            categories: { some: { slug: postCategorySlug } },
          },
          orderBy: { publishedAt: "desc" },
          take: 3,
          select: {
            slug: true,
            title: true,
            excerpt: true,
            publishedAt: true,
            categories: { select: { name: true } },
          },
        }).then((posts) =>
          posts.length >= 2
            ? posts
            : prisma.blogPost.findMany({
                where: { status: "published", slug: { not: slug } },
                orderBy: { publishedAt: "desc" },
                take: 3,
                select: {
                  slug: true,
                  title: true,
                  excerpt: true,
                  publishedAt: true,
                  categories: { select: { name: true } },
                },
              })
        )
      : prisma.blogPost.findMany({
          where: { status: "published", slug: { not: slug } },
          orderBy: { publishedAt: "desc" },
          take: 3,
          select: {
            slug: true,
            title: true,
            excerpt: true,
            publishedAt: true,
            categories: { select: { name: true } },
          },
        }),
    prisma.serviceCategory.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  const cleanedContent = cleanBlogContent(post.content);
  const mins = readingTime(post.content);
  const authorProfile = post.author ? getAuthorByName(post.author) : null;

  const keyTakeaways = extractKeyTakeaways(cleanedContent);
  const [firstHalf, secondHalf] = splitAtMidpointH2(cleanedContent);
  const relatedPostImages = relatedPosts.map((rp) => getSectionImage(rp.slug, 0, rp.title));
  const categoryCta = getCategoryCta(post.categories[0]?.name);

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${slug}`,
            publishedAt: post.publishedAt,
            modifiedAt: post.updatedAt,
            author: authorProfile?.name ?? "Eddie Marketing Team",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <TrackPageView
        event="blog_post_view"
        params={{ post_slug: slug, category: post.categories?.[0]?.name }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
            {post.categories[0] && (
              <>
                <span>/</span>
                <Link href={`/blog?category=${post.categories[0].slug}`} className="hover:text-slate-300 transition-colors">
                  {post.categories[0].name}
                </Link>
              </>
            )}
          </nav>

          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/blog?category=${cat.slug}`}
                  className="inline-block text-xs font-semibold text-teal-600 bg-teal-400/10 px-2.5 py-1 rounded-full hover:bg-teal-400/20 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-6 max-w-3xl leading-snug">
            {post.title}
          </h1>

          <div className="flex items-center flex-wrap gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(authorProfile?.name ?? "Eddie Marketing Team").charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-300">{authorProfile?.name ?? "Eddie Marketing Team"}</span>
            </span>
            {post.publishedAt && (
              <>
                <span className="text-slate-700">·</span>
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDate(post.publishedAt)}
                </time>
              </>
            )}
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {mins} min read
            </span>
          </div>
        </div>
      </div>

      {/* ── Featured image ─────────────────────────────────────────────── */}
      {post.featuredImage && (
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto rounded-xl object-cover max-h-[400px]"
            />
          </div>
        </div>
      )}

      {/* ── Content + Sidebar ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Main article ─────────────────────────────────────────────── */}
          <article className="lg:col-span-2 min-w-0">

            {/* Key Takeaways */}
            {keyTakeaways.length >= 3 && (
              <div className="mb-8 rounded-xl overflow-hidden border border-blue-100">
                <div className="bg-blue-600 px-5 py-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">Key Takeaways</p>
                </div>
                <div className="bg-blue-50 px-5 py-4">
                  <ul className="space-y-2.5">
                    {keyTakeaways.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Excerpt / lead */}
            {post.excerpt && (
              <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed border-l-4 border-teal-500 pl-5 bg-teal-50/40 py-3 pr-4 rounded-r-xl">
                {post.excerpt}
              </p>
            )}

            {cleanedContent ? (
              <>
                {/* First half */}
                <div
                  className={PROSE_CLASSES}
                  dangerouslySetInnerHTML={{ __html: secondHalf ? firstHalf : cleanedContent }}
                />

                {/* Mid-article CTA */}
                {secondHalf && (
                  <div className="my-10 p-6 ems-gradient-bg rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-lg">
                    <div className="flex-1">
                      <p className="font-bold text-white mb-1 text-base">
                        Ready to apply these strategies?
                      </p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Get a custom marketing plan built for your business — free, no obligation.
                      </p>
                    </div>
                    <Link
                      href="/request-for-a-proposal"
                      className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap shadow-sm"
                    >
                      Free Strategy Session
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                )}

                {/* Second half */}
                {secondHalf && (
                  <div
                    className={PROSE_CLASSES}
                    dangerouslySetInnerHTML={{ __html: secondHalf }}
                  />
                )}
              </>
            ) : (
              <p className="text-slate-400 italic">Content coming soon.</p>
            )}

            {/* Author Bio */}
            {authorProfile && (
              <AuthorBio
                author={authorProfile}
                publishedAt={post.publishedAt}
                updatedAt={post.updatedAt}
                readingMins={mins}
                category={post.categories[0]?.name}
              />
            )}

            {/* Article footer */}
            <div className="mt-10 pt-8 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <Link
                href="/blog"
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
              {post.categories.length > 0 && (
                <Link
                  href={`/blog?category=${post.categories[0].slug}`}
                  className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                  More {post.categories[0].name} articles →
                </Link>
              )}
            </div>
          </article>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-5 lg:col-span-1 lg:sticky lg:top-24 self-start">
            {/* CTA */}
            <div className="ems-gradient-bg rounded-xl p-6 text-white">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75 mb-1">Free Consultation</p>
              <h3 className="text-base font-bold mb-2">Strategy Session</h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                30 minutes with a senior strategist. Actionable insights, no obligation.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                Book Now — It&apos;s Free
              </Button>
            </div>

            {/* Our Services */}
            {serviceCategories.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 mb-4">Our Services</h3>
                <ul className="space-y-2">
                  {serviceCategories.slice(0, 8).map((svc) => (
                    <li key={svc.slug}>
                      <Link
                        href={`/services/${svc.slug}`}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group"
                      >
                        <svg className="w-3 h-3 text-teal-500 shrink-0 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {svc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Nav */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 mb-4">Explore More</h3>
              <ul className="space-y-2">
                {[
                  { href: "/portfolio", label: "Case Studies" },
                  { href: "/industries", label: "Industries We Serve" },
                  { href: "/blog", label: "All Articles" },
                  { href: "/request-for-a-proposal", label: "Get a Free Strategy Session" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                      <svg className="w-3 h-3 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Resource Article Enhancement ──────────────────────────────── */}
      <ResourceArticleBlock slug={slug} />

      {/* ── Related Articles ──────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-7">
              <h2 className="text-lg font-bold text-slate-900">
                {postCategorySlug
                  ? `More ${post.categories[0]?.name ?? ""} Articles`
                  : "Related Articles"}
              </h2>
              <div className="flex-1 h-px bg-slate-200" />
              <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors shrink-0">
                All articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rp, idx) => {
                const img = relatedPostImages[idx];
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                  >
                    {/* Card image */}
                    <div className="h-40 overflow-hidden bg-slate-100 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                      {rp.categories[0]?.name && (
                        <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {rp.categories[0].name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors mb-2 leading-snug flex-1">
                        {rp.title}
                      </h3>
                      {rp.excerpt && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{rp.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mt-auto">
                        {rp.publishedAt && (
                          <time dateTime={rp.publishedAt.toISOString()}>
                            {formatDateShort(rp.publishedAt)}
                          </time>
                        )}
                        <span className="flex items-center gap-1 text-blue-600 font-medium ml-auto group-hover:gap-1.5 transition-all text-xs">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Internal Linking ──────────────────────────────────────────── */}
      <ClusterLinksSection variant="slug" slug={slug} kind="post" />

      {/* ── Lead Capture ──────────────────────────────────────────────── */}
      <LeadCaptureSection
        eyebrow={categoryCta.eyebrow}
        title={categoryCta.title}
        description={categoryCta.description}
        submitLabel={categoryCta.submitLabel}
      />
    </>
  );
}
