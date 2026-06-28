import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/sections/SectionHeader";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import CtaBanner from "@/components/sections/CtaBanner";
import ToolCard from "@/components/tools/ToolCard";
import ToolsFilterClient from "@/components/tools/ToolsFilterClient";
import {
  TOOLS,
  TOOL_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  getFeaturedTools,
  getNewTools,
  getRecentlyUpdatedTools,
  TYPE_LABELS,
  TYPE_COLORS,
} from "@/lib/tools-data";

export const metadata: Metadata = buildMetadata({
  title: "Free Marketing Tools & Calculators",
  description:
    "Free marketing calculators, generators, and checklists for SEO, Google Ads, social media, email marketing, and more. No sign-up required.",
  path: "/tools",
});

const TOOLS_FAQS = [
  {
    question: "Are all the tools really free?",
    answer:
      "Yes — every tool on this page is 100% free with no sign-up, no credit card, and no hidden charges. They run entirely in your browser, so your data never leaves your device.",
  },
  {
    question: "How accurate are the calculators?",
    answer:
      "The calculators use industry-standard formulas and real-world benchmarks sourced from Google, HubSpot, DMA, and other authoritative marketing research. They're designed as planning and estimation tools — your actual results will depend on your specific market, audience, and campaign execution.",
  },
  {
    question: "Do I need to create an account to use the tools?",
    answer:
      "No account is required. All tools work instantly in your browser. For the checklist tools, your progress is saved for the current session only — we recommend copying your results before closing the tab.",
  },
  {
    question: "How often are the tools updated?",
    answer:
      "We update benchmarks, algorithms, and content at least quarterly. Each tool displays its last updated date. If you notice outdated information, please contact us and we'll review it promptly.",
  },
  {
    question: "Can I use these tools for client work?",
    answer:
      "Absolutely. These tools are designed for marketing professionals, agency teams, and business owners alike. There are no restrictions on commercial use.",
  },
  {
    question: "Are more tools being added?",
    answer:
      "Yes — we add new tools regularly based on user requests and market needs. Check back monthly or contact us to request a specific tool you'd like to see added.",
  },
];

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

export default function ToolsHubPage() {
  const featured = getFeaturedTools();
  const newTools = getNewTools();
  const recent = getRecentlyUpdatedTools(6);

  const toolCountByCategory = Object.fromEntries(
    TOOL_CATEGORIES.map((cat) => [cat, TOOLS.filter((t) => t.category === cat).length])
  );

  const typeCounts = Object.entries(
    TOOLS.reduce<Record<string, number>>((acc, t) => {
      acc[t.type] = (acc[t.type] ?? 0) + 1;
      return acc;
    }, {})
  );

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/tools#page`,
            name: `Free Marketing Tools & Calculators | ${SITE_NAME}`,
            url: `${SITE_URL}/tools`,
            description:
              "Free marketing calculators, generators, and checklists for digital marketers.",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Marketing Tools", path: "/tools" },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Marketing Tools</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
                Free Tools
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                Marketing Tools&nbsp;& Calculators
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                {TOOLS.length} free tools to plan campaigns, calculate ROI, generate content,
                and audit your marketing — no sign-up required.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" size="lg" href="/request-for-a-proposal">
                  Get Expert Help
                </Button>
                <Button variant="ghost" size="lg" href="#all-tools" className="text-slate-400 hover:text-white hover:bg-white/10">
                  Browse All Tools ↓
                </Button>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black text-white">{TOOLS.length}</p>
                <p className="text-sm text-slate-400 mt-1">Free tools</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black text-white">{TOOL_CATEGORIES.length}</p>
                <p className="text-sm text-slate-400 mt-1">Categories</p>
              </div>
              {typeCounts.map(([type, count]) => (
                <div key={type} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-3xl font-black text-white">{count}</p>
                  <p className="text-sm text-slate-400 mt-1">{TYPE_LABELS[type as keyof typeof TYPE_LABELS]}s</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tool Categories ───────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {TOOL_CATEGORIES.map((cat) => (
              <a
                key={cat}
                href="#all-tools"
                className="group flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-center"
              >
                <span className="text-2xl mb-1.5">{CATEGORY_ICONS[cat]}</span>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors leading-tight font-medium">{cat}</span>
                <span className="text-xs text-slate-600 mt-0.5">{toolCountByCategory[cat]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Tools ────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Editor's Picks"
            title="Most Popular Tools"
            description="Our highest-rated tools — used by thousands of marketers every month."
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} variant="featured" />
            ))}
          </div>
        </div>
      </div>

      {/* ── New & Recently Updated ────────────────────────────────────────── */}
      {newTools.length > 0 && (
        <div className="bg-white border-b border-slate-200 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* New tools */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-teal-500">New</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Recently Added</h2>
                <div className="space-y-3">
                  {newTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} variant="compact" />
                  ))}
                </div>
              </div>

              {/* Recently updated */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-500 mb-6">
                  Recently Updated
                </p>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Freshest Benchmarks</h2>
                <div className="space-y-3">
                  {recent.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{tool.iconEmoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {tool.name}
                          </p>
                          <p className="text-xs text-slate-400">Updated {new Date(tool.updatedAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[tool.type]}`}>
                        {TYPE_LABELS[tool.type]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── All Tools (Search + Filter) ───────────────────────────────────── */}
      <div id="all-tools" className="bg-white py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Complete Library"
            title={`All ${TOOLS.length} Marketing Tools`}
            description="Search, filter by category, and find the exact tool you need."
            align="left"
          />
          <ToolsFilterClient tools={TOOLS} />
        </div>
      </div>

      {/* ── Category Deep-Dives ───────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="By Category"
            title="Browse Tools by Channel"
            description="Find the right tools for your specific marketing focus area."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOL_CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter((t) => t.category === cat);
              return (
                <div
                  key={cat}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{cat}</h3>
                        <p className="text-xs text-slate-400">{catTools.length} tool{catTools.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                  <div className="space-y-1.5 mb-4">
                    {catTools.slice(0, 3).map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-700 transition-colors group"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors" />
                        {tool.name}
                      </Link>
                    ))}
                    {catTools.length > 3 && (
                      <p className="text-xs text-slate-400 pl-3">+{catTools.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqAccordion
        items={TOOLS_FAQS}
        eyebrow="Tools FAQ"
        title="Common Questions About Our Marketing Tools"
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <CtaBanner
        eyebrow="Need Expert Help?"
        title="Let Our Team Do the Heavy Lifting"
        description="These tools give you the data — we turn it into a strategy that delivers measurable growth for your business."
        variant="navy"
        primaryCta={{ label: "Get a Free Strategy Session", href: "/request-for-a-proposal" }}
        secondaryCta={{ label: "View Our Services", href: "/services" }}
      />
    </>
  );
}
