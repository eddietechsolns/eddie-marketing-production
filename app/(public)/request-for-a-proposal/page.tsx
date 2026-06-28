import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = buildMetadata({
  title: "Request for a Proposal — Free Strategy Session",
  description:
    "Book a free 30-minute strategy session with a senior digital marketing specialist. No sales pitch — just actionable insights for your business.",
  path: "/request-for-a-proposal",
});

const TRUST_POINTS = [
  "30-min call with a senior strategist",
  "Custom plan for your goals and budget",
  "No obligation, no sales pitch",
  "Response within one business day",
];

const WHAT_YOU_GET = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Marketing Audit",
    desc: "We review your current digital presence and identify quick wins.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Custom Strategy",
    desc: "A tailored digital marketing roadmap built for your industry and goals.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Budget Guidance",
    desc: "Honest advice on where to invest for the highest return in your market.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Expert Team",
    desc: "Talk directly with certified Google Ads and SEO specialists, not account managers.",
  },
];

export default async function RequestForProposalPage() {
  const [serviceCategories, recentPosts] = await Promise.all([
    prisma.serviceCategory.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true },
    }),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Request for a Proposal", path: "/request-for-a-proposal" },
          ]),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Get a Proposal</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Free Strategy Session
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 max-w-2xl leading-snug">
            Let&apos;s Build Your Digital Marketing Strategy
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-xl leading-relaxed mb-6">
            Book a free 30-minute call with a senior specialist. We&apos;ll audit your current marketing, identify opportunities, and outline a plan — no obligation.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {TRUST_POINTS.map((pt) => (
              <span key={pt} className="flex items-center gap-2 text-sm text-slate-400">
                <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {pt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust strip ──────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-x-8 gap-y-2">
          {["No Lock-In Contracts", "Transparent Reporting", "UAE Licensed", "Conversion Focused"].map((t) => (
            <span key={t} className="flex items-center gap-2 text-sm text-slate-300">
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left — What you get */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-5">What You Get</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {WHAT_YOU_GET.map((item) => (
                <div key={item.title} className="flex gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">{item.title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-12 p-6 bg-slate-900 rounded-2xl text-white">
              <div className="text-center">
                <p className="text-2xl font-bold ems-gradient-text">50+</p>
                <p className="text-xs text-slate-400 mt-1">Clients Served</p>
              </div>
              <div className="text-center border-x border-slate-700">
                <p className="text-2xl font-bold ems-gradient-text">312%</p>
                <p className="text-xs text-slate-400 mt-1">Avg Traffic Growth</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold ems-gradient-text">AED 2M+</p>
                <p className="text-xs text-slate-400 mt-1">Revenue Generated</p>
              </div>
            </div>

            {/* Services list */}
            {serviceCategories.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mb-4">Services We Can Help With</p>
                <div className="flex flex-wrap gap-2">
                  {serviceCategories.map((svc) => (
                    <Link
                      key={svc.slug}
                      href={`/services/${svc.slug}`}
                      className="text-sm text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      {svc.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start space-y-5">
            <div className="ems-gradient-bg rounded-xl p-6 text-white">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75 mb-1">Speak to a Specialist</p>
              <h3 className="text-base font-bold mb-2">Book Your Free Session</h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                Prefer to email? Reach us at:
              </p>
              <a
                href="mailto:info@eddietechsolns.com"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@eddietechsolns.com
              </a>
            </div>

            {recentPosts.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 mb-4">Recent Insights</h3>
                <ul className="space-y-3">
                  {recentPosts.map((post) => (
                    <li key={post.slug}>
                      <Link href={`/blog/${post.slug}`} className="text-sm text-slate-600 hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {post.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-sm font-semibold text-slate-900 mb-1">UAE Licensed Agency</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eddie Marketing Solutions FZE<br />Dubai, United Arab Emirates
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                Accepting new clients
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Lead capture form ─────────────────────────────────────────── */}
      <LeadCaptureSection
        title="Tell Us About Your Business"
        description="A senior strategist will review your request and get back to you within one business day — no sales pitch, just a plan."
        submitLabel="Request My Free Session"
        eyebrow="Request Your Strategy Session"
      />
    </>
  );
}
