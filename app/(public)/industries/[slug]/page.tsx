import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { getIndustryPages } from "@/lib/industry-pages";
import { INDUSTRY_CONTENT, DEFAULT_INDUSTRY_CONTENT } from "@/lib/industry-content";

import { AuthorityStrip } from "@/components/trust/AuthorityStrip";
import { TrustSidebarWidget } from "@/components/trust/TrustSidebarWidget";

const INDUSTRY_BLOG_KEYWORDS: Record<string, string[]> = {
  healthcare: ["healthcare", "medical", "doctor", "clinic", "hospital"],
  legal: ["legal", "lawyer", "law firm", "attorney"],
  "real-estate": ["real estate", "property", "realtor"],
  construction: ["construction", "contractor", "builder"],
  hospitality: ["hospitality", "hotel", "restaurant"],
  education: ["education", "university", "school", "elearning"],
  finance: ["finance", "fintech", "bank", "financial"],
  ecommerce: ["ecommerce", "e-commerce", "online store", "retail", "social commerce"],
  tech: ["tech", "software", "saas", "startup"],
  "home-services": ["home services", "plumbing", "electrical", "hvac"],
  automotive: ["automotive", "car", "dealership", "vehicle"],
  "food-beverage": ["food", "beverage", "restaurant", "cafe", "dining"],
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = await prisma.industry.findUnique({ where: { slug } });
  if (!industry) return { title: "Not Found" };
  return buildMetadata({
    title: industry.seoTitle ?? `${industry.title} Digital Marketing`,
    description:
      industry.seoDescription ??
      industry.excerpt ??
      `Digital marketing for ${industry.title} businesses. SEO, Google Ads, social media, and more.`,
    path: `/industries/${slug}`,
  });
}

export async function generateStaticParams() {
  const industries = await prisma.industry.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return industries;
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;

  const [industry, serviceCategories, otherIndustries, allPages] = await Promise.all([
    prisma.industry.findUnique({ where: { slug } }),
    prisma.serviceCategory.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.industry.findMany({
      where: { status: "published", slug: { not: slug } },
      orderBy: { title: "asc" },
      take: 6,
      select: { slug: true, title: true },
    }),
    prisma.page.findMany({
      where: { status: "published" },
      orderBy: { title: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  if (!industry || industry.status !== "published") notFound();

  const relatedPages = getIndustryPages(slug, allPages);

  const industryKeywords = INDUSTRY_BLOG_KEYWORDS[slug] ?? [];
  const relatedBlogPosts = await (industryKeywords.length > 0
    ? prisma.blogPost.findMany({
        where: {
          status: "published",
          OR: industryKeywords.map((kw) => ({
            title: { contains: kw, mode: "insensitive" as const },
          })),
        },
        orderBy: { publishedAt: "desc" },
        take: 4,
        select: { slug: true, title: true, excerpt: true, publishedAt: true },
      })
    : prisma.blogPost.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 4,
        select: { slug: true, title: true, excerpt: true, publishedAt: true },
      }));

  const industryCaseStudies = await prisma.caseStudy.findMany({
    where: { status: "published", industry: industry.title },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      clientName: true,
      serviceType: true,
      trafficIncreasePercent: true,
      leadIncreasePercent: true,
      revenueGenerated: true,
    },
  });

  const structured = INDUSTRY_CONTENT[slug] ?? null;
  const fallback = DEFAULT_INDUSTRY_CONTENT;
  const content = structured ?? fallback;
  const tagline = structured?.tagline ?? `Specialised digital marketing for ${industry.title} businesses in the UAE.`;
  const overview = structured?.overview ?? industry.excerpt ?? `We understand the unique marketing challenges and opportunities facing ${industry.title} businesses in the UAE. Our strategies are built around your sector's specific buyers, regulations, and competitive dynamics.`;

  const faqSchema = content.faqs.length > 0
    ? {
        "@type": "FAQPage" as const,
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question" as const,
          name: f.question,
          acceptedAnswer: { "@type": "Answer" as const, text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: industry.title, path: `/industries/${slug}` },
          ]),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/industries" className="hover:text-slate-300 transition-colors">Industries</Link>
            <span>/</span>
            <span className="text-slate-300">{industry.title}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Industry Expertise
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            {industry.title} Marketing
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            {tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">Get a Free Strategy Session</Button>
            <Button variant="ghost" size="md" href="/services" className="text-slate-300 hover:text-white hover:bg-white/10">
              View Our Services
            </Button>
          </div>
        </div>
      </div>

      <AuthorityStrip />

      {/* ── Stats Strip ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {content.stats.map((stat) => (
              <div key={stat.label} className="text-center px-4 first:pl-0 last:pr-0">
                <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content + Sidebar ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Main column ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-14">

            {/* Industry Overview */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] ems-gradient-text mb-2">
                Industry Overview
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {industry.title} Marketing in the UAE
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {overview}
              </p>
            </section>

            {/* Industry Challenges */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-500 mb-2">
                Industry Challenges
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                The Challenges Facing {industry.title} Businesses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.challenges.map((ch) => (
                  <div
                    key={ch.title}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight">{ch.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-10">{ch.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Marketing Opportunities */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                Marketing Opportunities
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Growth Opportunities for {industry.title} Businesses
              </h2>
              <div className="space-y-4">
                {content.opportunities.map((opp) => (
                  <div
                    key={opp.title}
                    className="flex gap-4 p-5 bg-teal-50 rounded-xl border border-teal-100"
                  >
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1 text-sm">{opp.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{opp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Eddie Solutions */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 mb-2">
                Eddie Solutions
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                How We Help {industry.title} Businesses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.solutions.map((sol) => (
                  <div
                    key={sol.title}
                    className="p-5 bg-blue-50 rounded-xl border border-blue-100"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm">{sol.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{sol.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] ems-gradient-text mb-2">
                Our Process
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                How We Work With {industry.title} Clients
              </h2>
              <div className="space-y-4">
                {content.process.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-teal-400 flex items-center justify-center text-sm font-bold text-teal-700 shrink-0">
                        {i + 1}
                      </div>
                      {i < content.process.length - 1 && (
                        <div className="w-0.5 h-full bg-teal-100 mt-1" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-semibold text-slate-900 mb-1 text-sm">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Services */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Services for {industry.title}
              </h3>
              <ul className="space-y-2.5">
                {serviceCategories.map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {svc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="ems-gradient-bg rounded-xl p-6 text-white">
              <h3 className="text-base font-bold mb-2">Free Strategy Session</h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                30 minutes with a senior strategist. No obligation, just actionable insights.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>Book My Free Session</Button>
            </div>

            {/* Other industries */}
            {otherIndustries.length > 0 && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Other Industries</h3>
                <ul className="space-y-2">
                  {otherIndustries.map((ind) => (
                    <li key={ind.slug}>
                      <Link href={`/industries/${ind.slug}`} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        {ind.title} &rarr;
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/industries" className="text-sm text-blue-600 font-medium hover:text-blue-800">
                      All industries &rarr;
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            <TrustSidebarWidget />
          </div>
        </div>
      </div>

      {/* ── Results KPI Strip ─────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Results</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            What {industry.title} Clients Measure
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl">
            The metrics that matter to {industry.title.toLowerCase()} businesses — and what our campaigns are built to move.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.results.map((kpi) => (
              <div
                key={kpi.metric}
                className="bg-white/5 rounded-xl p-5 border border-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  {kpi.metric}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  {kpi.description}
                </p>
                <p className="text-xs text-slate-500 italic leading-relaxed border-t border-white/10 pt-3">
                  {kpi.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      {content.faqs.length > 0 && (
        <div className="py-14 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 tracking-tight">
              {industry.title} Marketing — Common Questions
            </h2>
            <div className="space-y-3">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden open:border-blue-200 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-semibold text-slate-900 text-sm list-none hover:bg-slate-50 group-open:bg-blue-50/40 transition-colors">
                    <span>{faq.question}</span>
                    <svg
                      className="w-4 h-4 text-slate-400 shrink-0 group-open:rotate-180 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-blue-100 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Featured Industry Resources ────────────────────────────────────── */}
      {relatedPages.length > 0 && (
        <div className="border-t border-slate-200 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                  Resource Library
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  Featured {industry.title} Resources
                </h2>
                <p className="text-slate-500 mt-1 text-sm">
                  {relatedPages.length} specialist page{relatedPages.length !== 1 ? "s" : ""} covering {industry.title.toLowerCase()} marketing
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedPages.slice(0, 8).map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
                    <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug flex-1">
                    {page.title}
                  </h3>
                  <span className="mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
            {relatedPages.length > 8 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  +{relatedPages.length - 8} more {industry.title.toLowerCase()} resources:
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedPages.slice(8).map((page) => (
                    <Link
                      key={page.slug}
                      href={`/${page.slug}`}
                      className="text-sm text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Industry Case Studies ─────────────────────────────────────────── */}
      {industryCaseStudies.length > 0 && (
        <div className="bg-slate-50 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                  Proven Results
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {industry.title} Case Studies
                </h2>
              </div>
              <Link
                href={`/case-studies?industry=${encodeURIComponent(industry.title)}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {industryCaseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
                >
                  {cs.serviceType && (
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 mb-3">
                      {cs.serviceType}
                    </span>
                  )}
                  {cs.clientName && (
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                      {cs.clientName}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-3">
                    {cs.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs font-bold">
                    {cs.trafficIncreasePercent && (
                      <span className="text-teal-600">+{cs.trafficIncreasePercent}% traffic</span>
                    )}
                    {cs.leadIncreasePercent && (
                      <span className="text-blue-600">+{cs.leadIncreasePercent}% leads</span>
                    )}
                    {cs.revenueGenerated && (
                      <span className="text-emerald-600">{cs.revenueGenerated} revenue</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Related blog articles ─────────────────────────────────────────── */}
      {relatedBlogPosts.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">
                  From the Blog
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  {industry.title} Marketing Insights
                </h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors shrink-0">
                View all articles &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
                >
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-3 mb-3">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    Read article &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Internal linking ──────────────────────────────────────────────── */}
      <ClusterLinksSection variant="cross-silo" />

      {/* ── Lead capture ──────────────────────────────────────────────────── */}
      <LeadCaptureSection
        title={`Grow Your ${industry.title} Business`}
        description="Tell us about your goals and we'll build a digital marketing strategy tailored to your sector, your market, and your customers."
        submitLabel="Request a Proposal"
        eyebrow="Free Consultation"
      />

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Get Started</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to grow your {industry.title.toLowerCase()} business?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get a custom marketing strategy built for your sector, your market, and your growth targets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">Get a Free Consultation</Button>
            <Button variant="ghost" size="lg" href="/portfolio" className="text-slate-400 hover:text-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
