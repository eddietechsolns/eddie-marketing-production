import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import CtaBanner from "@/components/sections/CtaBanner";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import ToolCard from "@/components/tools/ToolCard";
import ToolInteractive from "@/components/tools/ToolInteractive";
import {
  TOOLS,
  getToolBySlug,
  getRelatedTools,
  TYPE_LABELS,
  TYPE_COLORS,
  DIFFICULTY_COLORS,
} from "@/lib/tools-data";

export const revalidate = 86400;

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return buildMetadata({
    title: tool.name,
    description: tool.description,
    path: `/tools/${tool.slug}`,
  });
}

const CATEGORY_ICONS: Record<string, string> = {
  "SEO": "🔍",
  "Google Ads": "📢",
  "Social Media": "📱",
  "Content Marketing": "✍️",
  "Email Marketing": "📧",
  "Analytics": "📊",
  "Website Development": "⚡",
  "Business Tools": "💼",
  "AI Marketing": "🤖",
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const relatedTools = getRelatedTools(tool);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${SITE_URL}/tools/${tool.slug}#app`,
      name: tool.name,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AED",
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Marketing Tools", path: "/tools" },
      { name: tool.name, path: `/tools/${tool.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-slate-300 transition-colors">Marketing Tools</Link>
            <span>/</span>
            <span className="text-slate-300">{tool.name}</span>
          </nav>

          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                {CATEGORY_ICONS[tool.category]} {tool.category}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[tool.type]}`}>
                {TYPE_LABELS[tool.type]}
              </span>
              <span className={`text-xs font-semibold ${DIFFICULTY_COLORS[tool.difficulty]}`}>
                {tool.difficulty}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">
                ⏱ {tool.timeToComplete}
              </span>
              {tool.isNew && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full ems-gradient-bg text-white">
                  New
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
              {tool.iconEmoji} {tool.name}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-6 max-w-2xl">
              {tool.tagline}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tool Description + How It Works ───────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About This Tool</h2>
              <p className="text-base text-slate-600 leading-relaxed mb-8">{tool.description}</p>

              {/* How it works */}
              <h2 className="text-xl font-bold text-slate-900 mb-5">How It Works</h2>
              <ol className="space-y-5">
                {tool.howItWorks.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">{step.step}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Tool info card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Tool Details</h3>
                <div className="space-y-3">
                  {[
                    { label: "Category", value: tool.category },
                    { label: "Type", value: TYPE_LABELS[tool.type] },
                    { label: "Difficulty", value: tool.difficulty },
                    { label: "Time Needed", value: tool.timeToComplete },
                    {
                      label: "Last Updated",
                      value: new Date(tool.updatedAt).toLocaleDateString("en-GB", {
                        month: "long", day: "numeric", year: "numeric",
                      }),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related keywords */}
              {tool.relatedKeywords.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.relatedKeywords.map((kw) => (
                      <Link
                        key={kw}
                        href={`/blog?q=${encodeURIComponent(kw)}`}
                        className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        {kw}
                      </Link>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    → <Link href="/blog" className="hover:text-blue-600 transition-colors">Read related blog articles</Link>
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="bg-blue-600 rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-2">
                  Need Expert Support?
                </p>
                <p className="text-sm font-bold mb-3 leading-snug">
                  Turn your data into a strategy that drives real growth.
                </p>
                <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                  Book a Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Tool ──────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
              Use the Tool
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {tool.iconEmoji} {tool.name}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Free · No sign-up required · Runs in your browser</p>
          </div>
          <ToolInteractive tool={tool} />
        </div>
      </div>

      {/* ── Educational Content ───────────────────────────────────────────── */}
      {tool.educationalContent && tool.educationalContent.length > 0 && (
        <div className="bg-white border-t border-slate-200 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Sticky heading */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
                    Deep Dive
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                    Everything You Need to Know About {tool.name}
                  </h2>
                  <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                    Written by the Eddie Marketing team — practical insights from running campaigns for 200+ UAE businesses.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      EM
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Eddie Marketing Team</p>
                      <p className="text-xs text-slate-500">Digital Marketing Specialists</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="lg:col-span-8 space-y-10">
                {tool.educationalContent.map((section, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-slate-100 hover:border-blue-400 transition-colors">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">
                      {section.heading}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-[15px]">{section.body}</p>
                  </div>
                ))}

                {/* Expert CTA */}
                <div className="mt-4 p-6 bg-slate-900 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">
                      Want expert guidance on {tool.category}?
                    </p>
                    <p className="text-slate-400 text-sm">
                      Our specialists work with UAE businesses daily. Get a personalised strategy session — no sales pressure.
                    </p>
                  </div>
                  <a
                    href="/request-for-a-proposal"
                    className="flex-shrink-0 inline-flex items-center gap-2 ems-gradient-bg text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Get a Free Strategy Session
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {tool.faqs.length > 0 && (
        <FaqAccordion
          items={tool.faqs}
          eyebrow={`${tool.name} FAQ`}
          title={`Common Questions About ${tool.name}`}
        />
      )}

      {/* ── Related Tools ────────────────────────────────────────────────── */}
      {relatedTools.length > 0 && (
        <div className="bg-white border-t border-slate-200 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">
                  Related Tools
                </p>
                <h2 className="text-2xl font-bold text-slate-900">You Might Also Need</h2>
              </div>
              <Link
                href="/tools"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors hidden sm:block"
              >
                View all tools →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedTools.map((related) => (
                <ToolCard key={related.slug} tool={related} variant="featured" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Related Blog Posts ────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Read More on {tool.category}
            </h2>
            <Link href={`/blog?q=${encodeURIComponent(tool.category)}`} className="text-sm text-blue-600 hover:underline">
              All articles →
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {tool.relatedKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/blog?q=${encodeURIComponent(kw)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-all"
              >
                📖 Articles about {kw}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cluster Links ─────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-4">
            Explore More
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools" className="text-sm text-slate-600 hover:text-blue-700 hover:underline transition-colors">
              All Marketing Tools
            </Link>
            <span className="text-slate-300">·</span>
            <Link href={`/services`} className="text-sm text-slate-600 hover:text-blue-700 hover:underline transition-colors">
              Our Services
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/blog" className="text-sm text-slate-600 hover:text-blue-700 hover:underline transition-colors">
              Marketing Blog
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/case-studies" className="text-sm text-slate-600 hover:text-blue-700 hover:underline transition-colors">
              Case Studies
            </Link>
            {tool.relatedKeywords.slice(0, 3).map((kw) => (
              <span key={kw} className="contents">
                <span className="text-slate-300">·</span>
                <Link href={`/blog?q=${encodeURIComponent(kw)}`} className="text-sm text-slate-600 hover:text-blue-700 hover:underline transition-colors">
                  {kw} resources
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lead Capture ──────────────────────────────────────────────────── */}
      <LeadCaptureSection
        eyebrow="Take It Further"
        title="Want Expert Help Applying These Insights?"
        description={`Our team works with UAE businesses to implement ${tool.category.toLowerCase()} strategies that deliver measurable results. Book a free session — no commitment, no jargon.`}
        defaultService={tool.category}
        submitLabel="Get a Free Strategy Session"
        bullets={[
          "Free 30-minute strategy consultation",
          `Specialist in ${tool.category} for UAE markets`,
          "Custom action plan based on your data",
          "Clear KPIs agreed before we start",
          "Transparent pricing — no hidden fees",
          "Month-to-month — no lock-in contracts",
        ]}
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <CtaBanner
        variant="navy"
        eyebrow="Grow Your Business"
        title="Ready to Turn Data Into Results?"
        description="Our digital marketing specialists use the same frameworks behind these tools to build strategies that grow UAE businesses."
        primaryCta={{ label: "Get a Free Proposal", href: "/request-for-a-proposal" }}
        secondaryCta={{ label: "See Our Work", href: "/portfolio" }}
      />
    </>
  );
}
