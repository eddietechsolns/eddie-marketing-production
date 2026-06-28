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
    title: "Digital Marketing for GCC Region — Gulf Strategy | Eddie Marketing",
    description:
      "Digital marketing across the GCC — UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman. SEO, Google Ads, social media, and multi-country campaigns for Gulf businesses.",
    path: "/locations/gcc",
  }),
  alternates: { canonical: `${SITE_URL}/locations/gcc` },
};

const GCC_STATS = [
  { value: "57M+", label: "GCC Population" },
  { value: "6", label: "Member States" },
  { value: "$2T+", label: "Combined GDP" },
  { value: "95%+", label: "Average Internet Rate" },
];

const GCC_COUNTRIES = [
  {
    flag: "🇦🇪",
    name: "United Arab Emirates",
    shortName: "UAE",
    capital: "Abu Dhabi",
    population: "10M+",
    strength: "Most diverse digital market; English and Arabic campaigns essential.",
    href: "/locations/uae",
  },
  {
    flag: "🇸🇦",
    name: "Saudi Arabia",
    shortName: "KSA",
    capital: "Riyadh",
    population: "36M+",
    strength: "Largest GCC economy. Snapchat and Twitter/X penetration highest in the world.",
    href: null,
  },
  {
    flag: "🇶🇦",
    name: "Qatar",
    shortName: "Qatar",
    capital: "Doha",
    population: "3M+",
    strength: "Highest GDP per capita in GCC. Premium B2B and luxury consumer markets.",
    href: null,
  },
  {
    flag: "🇰🇼",
    name: "Kuwait",
    shortName: "Kuwait",
    capital: "Kuwait City",
    population: "4.8M+",
    strength: "High social media engagement; Instagram and Snapchat dominate.",
    href: null,
  },
  {
    flag: "🇧🇭",
    name: "Bahrain",
    shortName: "Bahrain",
    capital: "Manama",
    population: "1.7M+",
    strength: "Financial services hub; strong B2B and fintech digital marketing opportunities.",
    href: null,
  },
  {
    flag: "🇴🇲",
    name: "Oman",
    shortName: "Oman",
    capital: "Muscat",
    population: "4.5M+",
    strength: "Growing tourism and logistics market; less competitive digital landscape.",
    href: null,
  },
];

const GCC_SERVICES = [
  {
    title: "Multi-Country SEO",
    description: "Country-targeted SEO with hreflang, localised keyword research, and market-specific content for each GCC nation.",
  },
  {
    title: "Arabic PPC Campaigns",
    description: "Google Ads campaigns built natively in Arabic and English — not just translated — for Saudi, UAE, Qatar, Kuwait, and Bahrain.",
  },
  {
    title: "GCC Social Media",
    description: "Platform strategy covering Instagram, Snapchat, TikTok, LinkedIn, and Twitter/X — with country-specific ad targeting and creative.",
  },
  {
    title: "Localised Landing Pages",
    description: "Country-specific landing pages with localised copy, currency, and cultural considerations that improve Quality Score and conversion rate.",
  },
  {
    title: "Cross-Border Analytics",
    description: "Unified reporting across all GCC markets — measuring performance by country, platform, language, and audience segment.",
  },
  {
    title: "Compliance & Platform Rules",
    description: "Navigation of GCC-specific ad policies — Saudi Arabia content restrictions, UAE regulatory requirements, and platform-level rules per country.",
  },
];

const GCC_INSIGHTS = [
  {
    title: "Arabic-First Content",
    body: "While English is widely spoken in UAE and Qatar, Arabic-first content consistently outperforms English in Saudi Arabia, Kuwait, and Oman. Transliteration is not enough — culturally appropriate Arabic copy written by native speakers drives significantly better results.",
  },
  {
    title: "Snapchat Dominates in KSA and Kuwait",
    body: "Saudi Arabia has the highest Snapchat usage rate per capita globally. Kuwait is not far behind. For consumer brands targeting these markets, Snapchat advertising is often more cost-effective than Instagram or TikTok.",
  },
  {
    title: "High Mobile Commerce Growth",
    body: "GCC e-commerce is growing at 25%+ annually. Mobile payment adoption via Apple Pay, Google Pay, and local wallets (STC Pay, mada in Saudi) is accelerating. Mobile-optimised landing pages and click-to-WhatsApp flows are essential.",
  },
  {
    title: "B2B LinkedIn Opportunity",
    body: "The GCC's large professional expat workforce makes LinkedIn unusually effective. Decision-makers in finance, construction, energy, and professional services engage heavily with LinkedIn Ads — often at lower CPC than Western markets.",
  },
  {
    title: "Vision 2030 & Digital Transformation",
    body: "Saudi Vision 2030 and UAE Centennial 2071 are driving massive government and private sector investment in digital infrastructure, healthcare, tourism, and entertainment — creating sustained demand for digital marketing services.",
  },
  {
    title: "Ramadan & Cultural Peaks",
    body: "Social media usage increases 30–40% during Ramadan across the GCC. Campaigns running during Ramadan, Eid Al-Fitr, and Eid Al-Adha with culturally appropriate messaging consistently achieve higher engagement and lower CPMs.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Can Eddie Marketing run campaigns across multiple GCC countries?",
    a: "Yes. We manage multi-country digital marketing campaigns across UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman. Each country gets its own targeted strategy including language, platform mix, budget allocation, and localised creative — all managed from a single account team with unified reporting.",
  },
  {
    q: "Is digital marketing in Saudi Arabia different from UAE?",
    a: "Significantly. Saudi Arabia requires Arabic-first content, Snapchat is a major channel (highest global penetration), and ad content policies are stricter. Google Ads in KSA also has different competitive dynamics and CPC levels compared to UAE. We build country-specific strategies rather than duplicating UAE campaigns.",
  },
  {
    q: "What platforms should GCC businesses prioritise?",
    a: "It depends on country and audience. UAE: Google Ads + Instagram + LinkedIn. Saudi Arabia: Snapchat + Instagram + Google Ads. Qatar: Instagram + LinkedIn + Google Ads. Kuwait: Snapchat + Instagram. For all GCC markets, Google Search Ads targeting commercial intent queries delivers consistent ROI across sectors.",
  },
  {
    q: "How do you handle Arabic content for GCC campaigns?",
    a: "Our Arabic content is written by native Arabic copywriters with digital marketing expertise — not machine-translated. We produce separate Arabic keyword research, Arabic ad copy, and Arabic landing page variants for each GCC market to ensure cultural accuracy and platform relevance.",
  },
];

export default function GccPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: "GCC Region", path: "/locations/gcc" },
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
            description: "Digital marketing agency serving the GCC region",
            url: `${SITE_URL}/locations/gcc`,
            areaServed: GCC_COUNTRIES.map((c) => ({
              "@type": "Country",
              name: c.name,
            })),
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
            <span className="text-slate-300">GCC Region</span>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            GCC Region
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl leading-snug">
            Digital Marketing for the GCC Region
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Multi-country digital marketing across UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman.
            One agency. One strategy. Six markets, delivered in Arabic and English.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a GCC Strategy Session
            </Button>
            <Button variant="ghost" size="md" href="/locations/uae" className="text-slate-300 hover:text-white hover:bg-white/10">
              UAE Market →
            </Button>
          </div>

          {/* GCC Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GCC_STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthorityStrip />

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">

          <div className="min-w-0">

            {/* GCC Countries Grid */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Coverage</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Six GCC Markets, One Consistent Strategy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GCC_COUNTRIES.map((country) => (
                  <div key={country.shortName} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-teal-200 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl leading-none">{country.flag}</span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{country.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{country.capital}</span>
                          <span className="text-slate-200">·</span>
                          <span className="text-xs text-slate-400">{country.population}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{country.strength}</p>
                    {country.href && (
                      <Link href={country.href} className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 mt-3 transition-colors">
                        Full UAE strategy →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* GCC Services */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Services</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">GCC-Specific Digital Marketing Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GCC_SERVICES.map((svc) => (
                  <div key={svc.title} className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{svc.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{svc.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Market Intelligence</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">GCC Digital Marketing Insights</h2>
              <div className="space-y-4">
                {GCC_INSIGHTS.map((insight) => (
                  <div key={insight.title} className="border-l-4 border-teal-400 pl-5 py-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">{insight.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{insight.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Eddie for GCC */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 mb-10 border border-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Why Eddie Marketing</p>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Built for the Gulf Region</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { point: "UAE-based team", detail: "We operate in the same time zone, know the market, and understand GCC business culture." },
                  { point: "Arabic & English expertise", detail: "Native Arabic copywriters and culturally fluent campaign managers for every GCC market." },
                  { point: "Multi-platform certified", detail: "Google Ads, Meta, TikTok, Snapchat, LinkedIn — all channels, all six countries." },
                  { point: "Transparent reporting", detail: "Unified dashboards showing performance by country, channel, language, and audience segment." },
                ].map((item) => (
                  <div key={item.point} className="flex gap-3">
                    <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.point}</div>
                      <div className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">FAQ</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">GCC Digital Marketing Questions</h2>
              <div className="space-y-2">
                {FAQ_ITEMS.map((item) => (
                  <details key={item.q} className="group rounded-xl border border-slate-200 bg-white overflow-hidden open:border-blue-200 transition-colors">
                    <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-semibold text-slate-900 text-sm list-none hover:bg-slate-50 group-open:bg-blue-50/40 transition-colors">
                      <span>{item.q}</span>
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
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="ems-gradient-bg rounded-xl p-5 text-white shadow-lg">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-1.5">GCC Strategy Session</h3>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                Tell us your target countries and goals. We'll map out a GCC-wide digital strategy — free, no obligation.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                Book Free Session
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">GCC Locations</h3>
              <ul className="space-y-2">
                {[
                  { href: "/locations/uae", label: "🇦🇪 UAE — Nationwide" },
                  { href: "/locations/dubai", label: "Dubai" },
                  { href: "/locations/abu-dhabi", label: "Abu Dhabi" },
                  { href: "/locations/sharjah", label: "Sharjah" },
                  { href: "/dubai-cities-marketing", label: "Dubai Neighbourhoods" },
                  { href: "/abu-dhabi-cities-marketing", label: "Abu Dhabi Areas" },
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
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">GCC by Numbers</h3>
              <ul className="space-y-3">
                {[
                  { stat: "57M+", desc: "Total GCC population" },
                  { stat: "$2T+", desc: "Combined GDP (USD)" },
                  { stat: "6", desc: "Member states" },
                  { stat: "95%+", desc: "Average internet penetration" },
                ].map((item) => (
                  <li key={item.stat} className="flex gap-3 items-start">
                    <span className="text-base font-bold text-teal-600 leading-tight shrink-0">{item.stat}</span>
                    <span className="text-xs text-slate-600 leading-snug">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <p className="text-sm font-semibold mb-1">Marketing across the Gulf?</p>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Eddie Marketing is your single partner for digital marketing across all six GCC countries.
              </p>
              <Link href="/request-for-a-proposal" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Talk to our GCC team →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Internal links ────────────────────────────────────────────────── */}
      <ClusterLinksSection variant="slug" slug="locations-gcc" kind="page" />

      {/* ── Lead capture ──────────────────────────────────────────────────── */}
      <LeadCaptureSection
        title="Grow Your Business Across the GCC"
        description="One agency for UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman. Arabic and English digital marketing built for the Gulf."
        submitLabel="Start Your GCC Marketing Plan"
        eyebrow="GCC Digital Marketing"
      />

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            GCC Digital Marketing Agency
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Your GCC Growth Partner
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Multi-country strategy. Arabic and English expertise. Six markets, one dedicated team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a Free GCC Consultation
            </Button>
            <Button variant="ghost" size="lg" href="/locations/uae" className="text-slate-400 hover:text-white hover:bg-white/10">
              Explore UAE Market
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
