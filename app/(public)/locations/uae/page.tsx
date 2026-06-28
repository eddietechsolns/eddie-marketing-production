import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { AuthorityStrip } from "@/components/trust/AuthorityStrip";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Digital Marketing in UAE — Nationwide Strategy | Eddie Marketing",
    description:
      "Expert digital marketing across the UAE — from Abu Dhabi and Dubai to Sharjah, Ajman, Ras Al Khaimah, and Fujairah. SEO, Google Ads, social media, and web design for UAE businesses.",
    path: "/locations/uae",
  }),
  alternates: { canonical: `${SITE_URL}/locations/uae` },
};

const UAE_STATS = [
  { value: "10M+", label: "UAE Population" },
  { value: "99%", label: "Internet Penetration" },
  { value: "91%", label: "Social Media Usage" },
  { value: "7", label: "Emirates Covered" },
];

const UAE_SERVICES = [
  {
    slug: "seo",
    name: "SEO",
    description: "Rank for high-intent UAE searches in English and Arabic.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    ),
  },
  {
    slug: "google-ads",
    name: "Google Ads",
    description: "Capture commercial intent across all seven Emirates.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
  },
  {
    slug: "social-media",
    name: "Social Media",
    description: "Instagram, LinkedIn, TikTok, and Snapchat for UAE audiences.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    ),
  },
  {
    slug: "content-marketing",
    name: "Content Marketing",
    description: "English and Arabic content built for UAE market intent.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    ),
  },
  {
    slug: "web-design",
    name: "Web Design",
    description: "High-conversion sites built for UAE business culture and UX expectations.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
    ),
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    description: "Google Maps and local pack rankings across every emirate.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    ),
  },
];

const UAE_EMIRATES = [
  { name: "Dubai", slug: "locations/dubai", hub: "dubai-cities-marketing", desc: "UAE's commercial and tourism capital. Most competitive digital market in the region." },
  { name: "Abu Dhabi", slug: "locations/abu-dhabi", hub: "abu-dhabi-cities-marketing", desc: "Federal capital with high-value B2B, government, and energy sector clients." },
  { name: "Sharjah", slug: "locations/sharjah", hub: "sharjah-cities-marketing", desc: "UAE's cultural capital. Strong manufacturing, education, and retail sectors." },
  { name: "Ajman", slug: null, hub: "ajman-cities-marketing", desc: "Fast-growing emirate with thriving SME and real estate markets." },
  { name: "Ras Al Khaimah", slug: null, hub: null, desc: "Northern emirate with growing tourism, manufacturing, and healthcare sectors." },
  { name: "Fujairah", slug: null, hub: null, desc: "East coast hub with port, logistics, and tourism opportunities." },
  { name: "Umm Al Quwain", slug: null, hub: null, desc: "Emerging emirate with light industry and residential development focus." },
];

const UAE_OPPORTUNITIES = [
  {
    title: "High Mobile Usage",
    body: "91% of UAE internet users access the web via smartphone. Mobile-first campaigns, AMP landing pages, and click-to-call extensions are non-negotiable for UAE PPC and local SEO.",
  },
  {
    title: "Bilingual Search Landscape",
    body: "Arabic-language queries represent a major untapped opportunity for most English-only advertisers. UAE campaigns that include Arabic keywords typically see 30–50% more impression share.",
  },
  {
    title: "Expat Majority Audience",
    body: "90% of UAE residents are expatriates from 200+ nationalities. Audience segmentation by language, job title, income level, and home country is essential for effective targeting.",
  },
  {
    title: "High Purchasing Power",
    body: "The UAE has one of the world's highest average incomes. Premium positioning, quality-focused messaging, and luxury market targeting outperform low-price approaches in most B2B and B2C sectors.",
  },
  {
    title: "WhatsApp & Chat Conversions",
    body: "UAE consumers strongly prefer WhatsApp for business enquiries. Integrating WhatsApp CTAs into landing pages and Google Business Profiles can increase lead volume by 40–60%.",
  },
  {
    title: "Zero Personal Income Tax",
    body: "UAE's tax-free environment attracts high-net-worth individuals and businesses. Sector-specific campaigns in finance, property, and professional services deliver above-average ROI.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is digital marketing effective for UAE businesses?",
    a: "Yes — with 99% internet penetration and one of the world's highest smartphone adoption rates, UAE businesses that invest in digital marketing consistently outperform competitors relying solely on traditional channels. Google Ads, local SEO, and Instagram advertising are particularly high-ROI in the UAE market.",
  },
  {
    q: "How much does digital marketing cost in the UAE?",
    a: "Costs vary by channel, competition, and goals. Monthly retainers for comprehensive digital marketing in UAE typically start from AED 5,000–10,000/month for SMEs. Google Ads campaigns require a minimum budget of AED 3,000–5,000/month to generate meaningful data. Eddie Marketing provides a free strategy session and custom quote based on your objectives.",
  },
  {
    q: "Should UAE campaigns be in Arabic or English?",
    a: "Both. English dominates B2B and professional searches; Arabic is essential for reaching the broader consumer market, particularly in retail, healthcare, education, and government sectors. Bilingual campaigns consistently outperform English-only in reach and cost-per-conversion.",
  },
  {
    q: "What are the best digital marketing channels for UAE?",
    a: "For most UAE businesses: Google Ads (highest commercial intent), Instagram (highest engagement rate in the region), LinkedIn (B2B and professional services), and Google My Business/local SEO (for location-based searches). WhatsApp integration is also critical for lead conversion in the UAE context.",
  },
];

export default function UaePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: "UAE — Nationwide", path: "/locations/uae" },
          ]),
          {
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          } as Record<string, unknown>,
          {
            "@type": "LocalBusiness",
            name: "Eddie Marketing Solutions",
            description: "Digital marketing agency serving all seven UAE emirates",
            url: `${SITE_URL}/locations/uae`,
            areaServed: {
              "@type": "Country",
              name: "United Arab Emirates",
            },
          } as Record<string, unknown>,
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-400">Locations</span>
            <span>/</span>
            <span className="text-slate-300">UAE — Nationwide</span>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-400 mb-3">
            UAE Nationwide
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl leading-snug">
            Digital Marketing Across the UAE
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            From Dubai and Abu Dhabi to Sharjah, Ajman, and the northern emirates — Eddie Marketing
            delivers data-driven digital strategies built for the UAE market, UAE audiences, and UAE growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a Free UAE Strategy Session
            </Button>
            <Button variant="ghost" size="md" href="/services" className="text-slate-300 hover:text-white hover:bg-white/10">
              View All Services
            </Button>
          </div>

          {/* Market snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {UAE_STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthorityStrip />

      {/* ── Market Overview ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">

          <div className="min-w-0">
            {/* Opportunities */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-600 mb-2">Market Intelligence</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">UAE Digital Marketing Opportunities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {UAE_OPPORTUNITIES.map((opp) => (
                  <div key={opp.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                    <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{opp.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{opp.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emirates coverage */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600 mb-2">Coverage</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">All 7 Emirates, One Agency</h2>
              <div className="space-y-3">
                {UAE_EMIRATES.map((emirate) => (
                  <div key={emirate.name} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{emirate.name}</div>
                        <div className="text-xs text-slate-500">{emirate.desc}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {emirate.slug && (
                        <Link href={`/${emirate.slug}`} className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap">
                          City page →
                        </Link>
                      )}
                      {emirate.hub && (
                        <Link href={`/${emirate.hub}`} className="text-xs font-medium text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap">
                          Area hubs →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Services</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What We Deliver Nationwide</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {UAE_SERVICES.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={`/services/${svc.slug}`}
                    className="group flex flex-col bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all"
                  >
                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
                      <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        {svc.icon}
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">{svc.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed flex-1">{svc.description}</p>
                    <span className="mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">Learn more →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">FAQ</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">UAE Digital Marketing Questions</h2>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item) => (
                  <div key={item.q} className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 text-white shadow-lg">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-1.5">UAE-Focused Strategy Session</h3>
              <p className="text-xs text-teal-100 mb-3 leading-relaxed">
                30 minutes with a senior strategist who knows the UAE market. Actionable insights, zero obligation.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                Book Free Session
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">City Hubs</h3>
              <ul className="space-y-2">
                {[
                  { href: "/locations/dubai", label: "Dubai" },
                  { href: "/locations/abu-dhabi", label: "Abu Dhabi" },
                  { href: "/locations/sharjah", label: "Sharjah" },
                  { href: "/dubai-cities-marketing", label: "Dubai Neighbourhoods" },
                  { href: "/abu-dhabi-cities-marketing", label: "Abu Dhabi Areas" },
                  { href: "/sharjah-cities-marketing", label: "Sharjah Areas" },
                  { href: "/ajman-cities-marketing", label: "Ajman Areas" },
                  { href: "/locations/gcc", label: "GCC Region →" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-2 text-sm text-slate-700 hover:text-teal-600 transition-colors group">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 group-hover:bg-teal-600 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">UAE Market Snapshot</h3>
              <ul className="space-y-3">
                {[
                  { stat: "99%", desc: "Internet penetration rate" },
                  { stat: "91%", desc: "Social media users" },
                  { stat: "200+", desc: "Nationalities in UAE" },
                  { stat: "#1", desc: "MENA's most connected economy" },
                ].map((item) => (
                  <li key={item.stat} className="flex gap-3 items-start">
                    <span className="text-base font-bold text-teal-600 leading-tight shrink-0">{item.stat}</span>
                    <span className="text-xs text-slate-600 leading-snug">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <p className="text-sm font-semibold mb-1">Ready to grow in the UAE?</p>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Eddie Marketing is UAE-based, GCC-focused, and certified across all major platforms.
              </p>
              <Link href="/request-for-a-proposal" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Start your strategy →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Internal links ────────────────────────────────────────────────── */}
      <ClusterLinksSection variant="slug" slug="locations-uae" kind="page" />

      {/* ── Lead capture ──────────────────────────────────────────────────── */}
      <LeadCaptureSection
        title="Grow Your Business Across the UAE"
        description="Whether you're targeting Dubai, Abu Dhabi, Sharjah, or all seven emirates — we build digital marketing strategies that work across the UAE market."
        submitLabel="Get Your UAE Marketing Plan"
        eyebrow="UAE Digital Marketing"
      />

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-400 mb-3">
            UAE-Based Digital Marketing Agency
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Let's Build Your UAE Digital Strategy
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Local knowledge, certified expertise, and a results-driven approach across every UAE emirate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a Free Strategy Session
            </Button>
            <Button variant="ghost" size="lg" href="/locations/gcc" className="text-slate-400 hover:text-white hover:bg-white/10">
              Explore GCC Region
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
