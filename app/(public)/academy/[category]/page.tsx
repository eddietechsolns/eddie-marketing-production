import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { ReadingProgress } from "@/components/academy/ReadingProgress";
import { TableOfContents } from "@/components/academy/TableOfContents";
import {
  ACADEMY_CATEGORIES,
  getCategory,
  type AcademySection,
} from "@/lib/academy-data";

export const revalidate = 86400;

export function generateStaticParams() {
  return ACADEMY_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return buildMetadata({
    title: cat.title,
    description: cat.metaDescription,
    path: `/academy/${category}`,
  });
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

function SectionContent({ section, index }: { section: AcademySection; index: number }) {
  return (
    <div id={section.id} className="scroll-mt-24 pt-10 first:pt-0">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black">
          {index + 1}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug pt-0.5">
          {section.title}
        </h2>
      </div>

      <div className="pl-12 space-y-4">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="text-base text-slate-600 leading-[1.8]">
            {p}
          </p>
        ))}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="space-y-2 mt-4">
            {section.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {section.tip && (
          <div className="mt-5 flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-lg flex-shrink-0">💡</span>
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Pro Tip</p>
              <p className="text-sm text-amber-900 leading-relaxed">{section.tip}</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-slate-100 mt-10" />
    </div>
  );
}

export default async function AcademyGuidePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const otherCategories = ACADEMY_CATEGORIES.filter((c) => c.slug !== cat.slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cat.title,
    description: cat.metaDescription,
    url: `${SITE_URL}/academy/${cat.slug}`,
    dateModified: new Date().toISOString(),
    author: { "@type": "Organization", name: "Eddie Marketing Solutions" },
    publisher: {
      "@type": "Organization",
      name: "Eddie Marketing Solutions",
      url: SITE_URL,
    },
  };

  return (
    <>
      <ReadingProgress />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Marketing Academy", path: "/academy" },
        { name: cat.shortTitle, path: `/academy/${cat.slug}` },
      ])} />
      <JsonLd data={articleSchema} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 text-white pt-16 pb-12 md:pt-24 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.12)_0%,_transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/academy" className="hover:text-slate-300 transition-colors">Academy</Link>
            <span>/</span>
            <span className="text-slate-300">{cat.shortTitle}</span>
          </nav>

          <div className="flex items-start gap-5 mb-6">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${cat.bgClass} ${cat.borderClass} border-2 flex items-center justify-center text-3xl flex-shrink-0`}>
              {cat.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_COLOR[cat.difficulty]}`}>
                  {cat.difficulty}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cat.readTime} read
                </span>
                <span className="text-xs text-slate-400">Updated {cat.lastUpdated}</span>
                <span className="text-xs text-slate-400">{cat.sections.length} sections</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {cat.title}
              </h1>
            </div>
          </div>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {cat.intro}
          </p>

          {/* Quick nav anchors */}
          <div className="flex flex-wrap gap-2 mt-6">
            {cat.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors border border-white/10"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="lg:flex lg:gap-12 xl:gap-16">

          {/* ── Main content ──────────────────────────────────────────────── */}
          <main className="lg:flex-1 min-w-0">
            {/* Mobile TOC */}
            <TableOfContents sections={cat.sections} />

            {/* Sections */}
            <article className="space-y-0">
              {cat.sections.map((section, i) => (
                <SectionContent key={section.id} section={section} index={i} />
              ))}
            </article>

            {/* Case Study */}
            <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-blue-200 flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-0.5">Real-World Case Study</p>
                  <p className="text-xs text-blue-600">{cat.caseStudy.category}</p>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                  <div className="sm:flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-2">{cat.caseStudy.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{cat.caseStudy.desc}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:flex-shrink-0 sm:text-right">
                    <div className="inline-block bg-blue-600 text-white rounded-xl px-4 py-3 text-center">
                      <p className="text-lg font-black">{cat.caseStudy.metric}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <FaqAccordion
                items={cat.faqs}
                eyebrow="Common Questions"
                title={`${cat.shortTitle} — Frequently Asked Questions`}
              />
            </div>

            {/* Related guides */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Related Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherCategories.slice(0, 4).map((other) => (
                  <Link
                    key={other.slug}
                    href={`/academy/${other.slug}`}
                    className="group flex items-start gap-4 p-4 border border-slate-200 rounded-xl bg-white hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl ${other.bgClass} flex items-center justify-center text-xl flex-shrink-0`}>
                      {other.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1">
                        {other.shortTitle}
                      </p>
                      <p className="text-xs text-slate-400">{other.readTime} · {other.difficulty}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </main>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0 space-y-6">

            {/* Desktop TOC */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <TableOfContents sections={cat.sections} />
            </div>

            {/* Related Tools */}
            {cat.relatedTools.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">Free Tools</p>
                <div className="space-y-2">
                  {cat.relatedTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 leading-snug">{tool.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{tool.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/tools"
                  className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3 pt-3 border-t border-slate-100"
                >
                  See all free tools →
                </Link>
              </div>
            )}

            {/* Related Services */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">Related Services</p>
              <div className="space-y-2">
                {cat.relatedServices.map((svc) => (
                  <Link
                    key={svc.href}
                    href={svc.href}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                  >
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">{svc.title}</span>
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Expert CTA */}
            <div className="bg-blue-600 rounded-2xl p-5 text-white">
              <p className="text-xs font-semibold text-blue-200 mb-1">Need Expert Help?</p>
              <p className="text-sm font-bold text-white mb-2">Turn this guide into a revenue-generating campaign for your business.</p>
              <p className="text-xs text-blue-200 mb-4 leading-relaxed">Free 30-minute strategy session with a UAE marketing specialist. No obligation.</p>
              <Link
                href="/request-for-a-proposal"
                className="block w-full text-center px-4 py-2.5 bg-white text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors"
              >
                Book a Free Consultation →
              </Link>
            </div>

            {/* All guides nav */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">All Guides</p>
              <div className="space-y-1.5">
                {ACADEMY_CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/academy/${c.slug}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      c.slug === cat.slug
                        ? `${c.bgClass} ${c.colorClass} font-semibold`
                        : "text-slate-600 hover:bg-white hover:text-slate-800"
                    }`}
                  >
                    <span>{c.icon}</span>
                    {c.shortTitle}
                    {c.slug === cat.slug && (
                      <span className="ml-auto text-xs opacity-60">← Current</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Lead Capture ──────────────────────────────────────────────────── */}
      <LeadCaptureSection
        title={`Get Expert Help With ${cat.shortTitle.replace(" Guides", "")}`}
        description={`Reading about ${cat.shortTitle.toLowerCase()} is the first step. Our specialists implement these strategies every day for UAE businesses — and we'd love to show you what's possible for yours.`}
        eyebrow="Free Consultation"
        submitLabel="Request a Free Strategy Call"
        bullets={[
          `Senior ${cat.shortTitle.replace(" Guides", "")} specialist assigned`,
          "Free audit of your current setup",
          "Custom strategy tailored to the UAE market",
          "Clear KPIs and timelines agreed upfront",
          "No long-term lock-in contracts",
        ]}
      />
    </>
  );
}
