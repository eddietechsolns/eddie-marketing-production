import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { AUTHORS } from "@/lib/authors";
import Button from "@/components/ui/Button";
import { ExploreMoreSection } from "@/components/internal-links/ExploreMoreSection";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "We are a full-service digital marketing agency based in Dubai, UAE. Learn about our team, our mission, and why ambitious businesses across UAE, GCC and Europe trust us.",
  path: "/about",
});

const VALUES = [
  {
    title: "Results Over Vanity",
    desc: "Every campaign is measured by revenue, leads, and ROI — not impressions or follower counts.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Radical Transparency",
    desc: "You see every metric, every spend, every result — in plain language, every month.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "UAE Market Expertise",
    desc: "Deep local knowledge of UAE buyer behaviour, regulations, and competitive landscapes.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Long-Term Partnerships",
    desc: "We build strategies that compound over time. Most clients have been with us for 2+ years.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "50+", label: "Clients Served" },
  { value: "12+", label: "Years Experience" },
  { value: "AED 2M+", label: "Revenue Generated" },
  { value: "UAE", label: "Licensed FZE" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
          ]),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">About Us</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Who We Are</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl leading-snug">
            The Team Behind Your Growth
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Eddie Marketing Solutions FZE is a full-service digital marketing agency based in Dubai, UAE. We help ambitious businesses grow with data-driven SEO, Google Ads, social media, and web design.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a Free Strategy Session
            </Button>
            <Button variant="ghost" size="md" href="/portfolio" className="text-slate-300 hover:text-white hover:bg-white/10">
              View Our Work
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold ems-gradient-text mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mission ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Our Mission</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-5">
              Measurable results for ambitious businesses
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Founded in Dubai, Eddie Marketing Solutions FZE was built on a simple premise: digital marketing should generate real, measurable business growth — not just vanity metrics.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              We work with businesses across UAE, GCC, and Europe to build integrated digital marketing strategies that deliver consistent leads, sales, and revenue. From enterprise real estate developers to ambitious SMEs, our campaigns are designed around your commercial goals.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our team of certified specialists covers SEO, Google Ads, Meta Ads, social media, content marketing, web design, and analytics — giving you a full marketing department without the overhead.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  {v.icon}
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1.5">{v.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-y border-slate-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Meet the Team</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Senior specialists, not juniors
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto mt-3 text-base">
              Every account is managed by a certified specialist with years of UAE market experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AUTHORS.map((author) => (
              <div key={author.slug} className="bg-white rounded-2xl border border-slate-200 p-7">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                  {author.name.charAt(0)}
                </div>
                <p className="font-bold text-slate-900 mb-0.5">{author.name}</p>
                <p className="text-sm text-teal-600 font-medium mb-3">{author.role}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{author.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {author.credentials.map((c) => (
                    <span key={c} className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ExploreMoreSection
        eyebrow="Explore Our Resources"
        title="Everything We Offer UAE Businesses"
        exclude={["/about"]}
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Work With Us</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to grow your business?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy session. No obligation, no sales pitch — just actionable insights.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">
            Get a Free Strategy Session
          </Button>
        </div>
      </div>
    </>
  );
}
