import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { ACADEMY_CATEGORIES, ACADEMY_STATS } from "@/lib/academy-data";
import CtaBanner from "@/components/sections/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Marketing Academy — Free Learning Guides for UAE Businesses",
  description:
    "Free in-depth marketing guides covering SEO, Google Ads, social media, analytics, web design, local SEO, and content marketing. Written by UAE digital marketing specialists.",
  path: "/academy",
});

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

const WHY_LEARN = [
  {
    icon: "🎯",
    title: "UAE-Specific Context",
    desc: "Every guide is written with the UAE market in mind — covering local search behaviour, AED budget benchmarks, GCC audience nuances, and regulations relevant to UAE businesses.",
  },
  {
    icon: "⚡",
    title: "Actionable, Not Academic",
    desc: "Each section ends with a practical tip you can implement today. No fluff, no theory for its own sake — just the information you need to make better marketing decisions.",
  },
  {
    icon: "🔗",
    title: "Connected to Free Tools",
    desc: "Every guide links directly to our free marketing tools and calculators so you can immediately apply what you've learned — from calculating SEO ROI to generating schema markup.",
  },
  {
    icon: "📅",
    title: "Kept Current",
    desc: "Digital marketing changes fast. Our guides are reviewed and updated monthly to reflect Google algorithm changes, new platform features, and shifts in UAE market behaviour.",
  },
];

export default function AcademyHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Marketing Academy", path: "/academy" },
        ])}
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 text-white pt-20 pb-16 md:pt-28 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(37,99,235,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Marketing Academy</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
              <span>🎓</span>
              <span>Learning Center — Free, No Sign-Up Required</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-[1.1]">
              Marketing Academy for<br />
              <span className="text-blue-400">UAE Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              In-depth, actionable guides on every digital marketing discipline — written by the specialists who actually run campaigns for UAE and Dubai businesses every day.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ACADEMY_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Guide Category Cards ─────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Free Guides</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Choose Your Learning Path
            </h2>
            <p className="text-base text-slate-500 mt-2 max-w-xl mx-auto">
              Each guide is a complete reference covering strategy, tactics, and measurement — not a surface-level overview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACADEMY_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/academy/${cat.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${cat.bgClass} ${cat.borderClass} border flex items-center justify-center text-2xl flex-shrink-0`}>
                    {cat.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_COLOR[cat.difficulty]}`}>
                    {cat.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {cat.shortTitle}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {cat.readTime}
                    </span>
                    <span>{cat.sections.length} sections</span>
                  </div>
                  <span className={`text-xs font-semibold ${cat.colorClass} flex items-center gap-1`}>
                    Read guide
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Learn With Us ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Why Learn Here</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Guides Written By Practitioners, Not Content Writers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_LEARN.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick-jump by topic ─────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 text-center mb-6">Browse by Topic</p>
          <div className="flex flex-wrap justify-center gap-3">
            {ACADEMY_CATEGORIES.flatMap((cat) =>
              cat.sections.slice(0, 2).map((s) => (
                <Link
                  key={`${cat.slug}-${s.id}`}
                  href={`/academy/${cat.slug}#${s.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <span>{cat.icon}</span>
                  {s.title}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Explore Free Tools ──────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-lg">
              <p className="text-blue-200 text-sm font-semibold mb-2">Free Marketing Tools</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Put the Learning Into Practice</h2>
              <p className="text-blue-100 leading-relaxed">
                Every guide links to relevant free tools — SEO calculators, UTM builders, schema generators, and more. No sign-up required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
              >
                Browse Free Tools →
              </Link>
              <Link
                href="/request-for-a-proposal"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                Get Expert Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Need Expert Implementation?"
        title="Turn Learning Into Results With a Free Strategy Call"
        description={`Reading about marketing is the first step — implementing it correctly is what drives revenue. Our team runs ${SITE_NAME} strategies for UAE businesses across every industry.`}
        primaryCta={{ label: "Book a Free Consultation", href: "/request-for-a-proposal" }}
      />
    </>
  );
}
