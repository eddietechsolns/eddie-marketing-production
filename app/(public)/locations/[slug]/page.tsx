import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { LOCATION_CONTENT, DEFAULT_LOCATION_CONTENT } from "@/lib/location-content";
import { AuthorityStrip } from "@/components/trust/AuthorityStrip";
import { TrustSidebarWidget } from "@/components/trust/TrustSidebarWidget";
import { LocationTrustBlock } from "@/components/trust/LocationTrustBlock";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await prisma.location.findUnique({ where: { slug } });
  if (!location) return { title: "Not Found" };
  return buildMetadata({
    title:
      location.seoTitle ??
      `Digital Marketing in ${location.city ?? location.title}`,
    description:
      location.seoDescription ??
      location.excerpt ??
      `Expert digital marketing services for businesses in ${location.city ?? location.title}. SEO, Google Ads, social media, and more.`,
    path: `/locations/${slug}`,
  });
}

export async function generateStaticParams() {
  const locations = await prisma.location.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return locations;
}

const CITY_HUB_SLUGS: Record<string, string> = {
  dubai: "dubai-cities-marketing",
  "abu-dhabi": "abu-dhabi-cities-marketing",
  sharjah: "sharjah-cities-marketing",
  ajman: "ajman-cities-marketing",
};

const STAT_ICONS = [
  /* building */
  <path key="building" strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />,
  /* globe */
  <path key="globe" strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />,
  /* chart bar */
  <path key="chart" strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
];

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;

  const location = await prisma.location.findUnique({ where: { slug } });
  if (!location || location.status !== "published") notFound();

  const city = location.city ?? location.title;
  const structured = LOCATION_CONTENT[slug] ?? null;
  const fallback = DEFAULT_LOCATION_CONTENT;
  const content = structured ?? fallback;
  const tagline = structured?.tagline ?? `Expert digital marketing for businesses in ${city} — strategy built for your local market, your competitors, and your growth goals.`;

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

  const [serviceCategories, otherLocations, locationBlogPosts] = await Promise.all([
    prisma.serviceCategory.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.location.findMany({
      where: { status: "published", slug: { not: slug } },
      orderBy: [{ state: "asc" }, { city: "asc" }],
      take: 5,
      select: { slug: true, title: true, city: true, state: true },
    }),
    prisma.blogPost.findMany({
      where: {
        status: "published",
        title: { contains: city, mode: "insensitive" },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true },
    }).then((posts) =>
      posts.length >= 2
        ? posts
        : prisma.blogPost.findMany({
            where: { status: "published" },
            orderBy: { publishedAt: "desc" },
            take: 3,
            select: { slug: true, title: true, excerpt: true },
          })
    ),
  ]);

  const cityHubSlug = CITY_HUB_SLUGS[slug] ?? null;

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema({ city: location.city, state: location.state }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: location.title, path: `/locations/${slug}` },
          ]),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <div>
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/locations" className="hover:text-slate-300 transition-colors">Locations</Link>
                <span>/</span>
                <span className="text-slate-300">{location.title}</span>
              </nav>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
                Local Expertise · UAE
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3 max-w-xl">
                Digital Marketing in {city}
              </h1>
              {location.city && location.state && (
                <p className="text-sm text-slate-400 mb-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {location.city}, {location.state}
                </p>
              )}
              {location.excerpt && (
                <p className="text-base md:text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
                  {location.excerpt}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="accent" size="lg" href="/request-for-a-proposal">
                  Get a Free Strategy Session
                </Button>
                <Button variant="ghost" size="md" href="/services" className="text-slate-300 hover:text-white hover:bg-white/10">
                  View Our Services
                </Button>
              </div>
            </div>

            {/* Right: market snapshot card */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.06] rounded-2xl border border-white/10 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-5">
                  {city} at a Glance
                </p>
                <div className="divide-y divide-white/10">
                  {content.stats.map((stat, i) => (
                    <div key={stat.label} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {STAT_ICONS[i] ?? STAT_ICONS[0]}
                          </svg>
                        </div>
                        <span className="text-sm text-slate-400 leading-tight">{stat.label}</span>
                      </div>
                      <span className="text-xl font-bold text-white tabular-nums shrink-0">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-slate-400">Local strategy. Measurable results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthorityStrip />

      {/* ── Market Stats Strip (mobile-visible) ───────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 text-center mb-5 lg:hidden">
            {city} Market Overview
          </p>
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {content.stats.map((stat, i) => (
              <div key={stat.label} className="text-center px-4 first:pl-0 last:pr-0">
                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-2.5">
                  <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {STAT_ICONS[i] ?? STAT_ICONS[0]}
                  </svg>
                </div>
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

            {/* Market Overview */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] ems-gradient-text mb-2">
                Market Overview
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                The {city} Digital Marketing Opportunity
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {tagline}
              </p>
              <div className="space-y-4">
                {content.opportunities.map((opp, i) => (
                  <div
                    key={opp.title}
                    className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-200 hover:bg-teal-50/40 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-teal-600">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1 text-sm">{opp.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{opp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Digital Challenges */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-500 mb-2">
                Digital Challenges
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Common Challenges for {city} Businesses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.challenges.map((ch) => (
                  <div
                    key={ch.title}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all"
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

            {/* Recommended Services */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 mb-2">
                Recommended Services
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Digital Marketing Services for {city} Businesses
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Tailored programmes across all major digital channels — chosen to fit your market, budget, and growth goals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceCategories.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={`/services/${svc.slug}`}
                    className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors flex-1">
                      {svc.name}
                    </span>
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* CTA */}
            <div className="ems-gradient-bg rounded-xl p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70 mb-1">Free Consultation</p>
              <h3 className="text-base font-bold mb-2">
                Strategy Session for {city} Businesses
              </h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                30 minutes with a senior strategist. Actionable {city} marketing insights, no obligation.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>Book Now — It&apos;s Free</Button>
            </div>

            {/* Neighbourhood hub link (Dubai / Abu Dhabi / Sharjah / Ajman) */}
            {cityHubSlug && (
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-500 mb-1">
                  {city} Neighbourhoods
                </p>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Neighbourhood-Level Marketing
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Explore area-specific digital marketing pages for {city}&apos;s key districts and communities.
                </p>
                <Link
                  href={`/${cityHubSlug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Browse {city} areas
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Other locations */}
            {otherLocations.length > 0 && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Other Locations
                </h3>
                <ul className="space-y-2">
                  {otherLocations.map((loc) => (
                    <li key={loc.slug}>
                      <Link href={`/locations/${loc.slug}`} className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 group">
                        <span className="group-hover:translate-x-0.5 transition-transform">{loc.title}</span>
                        <svg className="w-3 h-3 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                  <li className="pt-1 border-t border-slate-200 mt-2">
                    <Link href="/locations" className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                      All locations &rarr;
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Quick links */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">More From Eddie</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/portfolio", label: "Case Studies & Results" },
                  { href: "/industries", label: "Industries We Serve" },
                  { href: "/blog", label: "Marketing Blog" },
                  { href: "/request-for-a-proposal", label: "Get a Free Strategy Session" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 group">
                      <svg className="w-3 h-3 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <TrustSidebarWidget />
          </div>
        </div>
      </div>

      {/* ── Why Businesses Work With Us ───────────────────────────────────── */}
      <div className="bg-slate-50 border-y border-slate-100 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocationTrustBlock city={city} />
        </div>
      </div>

      {/* ── Local SEO Opportunities ───────────────────────────────────────── */}
      {content.localSeo.length > 0 && (
        <div className="bg-slate-950 py-14 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
              Local SEO
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
              Local Search Opportunities in {city}
            </h2>
            <p className="text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Search intent categories that {city} businesses can capture with targeted local SEO and Google Business Profile optimisation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.localSeo.map((seo) => (
                <div
                  key={seo.category}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/[0.08] transition-colors"
                >
                  <div className="w-9 h-9 bg-teal-400/15 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-sm">{seo.category}</h3>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{seo.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {seo.exampleKeywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="text-xs font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      {content.faqs.length > 0 && (
        <div className="py-14 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 tracking-tight">
              Digital Marketing in {city} — Common Questions
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

      {/* ── Related blog articles ─────────────────────────────────────────── */}
      {locationBlogPosts.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">
                  From the Blog
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  Digital Marketing Insights for {city}
                </h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors shrink-0">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {locationBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200 flex flex-col"
                >
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-3 mb-3 flex-1">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors inline-flex items-center gap-1 mt-auto">
                    Read article
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Internal linking ──────────────────────────────────────────────── */}
      <ClusterLinksSection
        variant="cross-silo"
        excludeCategorySlug={undefined}
      />

      {/* ── Lead capture ──────────────────────────────────────────────────── */}
      <LeadCaptureSection
        title={`Digital Marketing for ${city} Businesses`}
        description="Get a custom strategy built for your local market. Tell us about your business and we'll show you the fastest path to growth."
        submitLabel="Get a Free Strategy Session"
        eyebrow="Free Consultation"
      />

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Get Started</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to grow your {city} business online?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get a custom digital marketing strategy built for your market, your customers, and your goals.
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
