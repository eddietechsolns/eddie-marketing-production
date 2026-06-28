import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";
import { GLOSSARY } from "./glossary-data";
import { GlossaryClient } from "./GlossaryClient";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "PPC Glossary 2026 — 100+ Pay-Per-Click Terms Explained",
    description:
      "The complete PPC glossary for digital marketers. 100+ pay-per-click terms defined — from Ad Rank and Quality Score to ROAS, Smart Bidding, and Performance Max. Search, browse by letter, and link through to related terms. Updated for 2026.",
    path: "/ppc-glossary-for-2024",
  }),
  alternates: { canonical: `${SITE_URL}/ppc-glossary-for-2024` },
};

const ALL_LETTERS = GLOSSARY.map((g) => g.letter);
const TOTAL_TERMS = GLOSSARY.reduce((acc, g) => acc + g.terms.length, 0);

// Build FAQ schema from terms that have faq entries
const faqTerms = GLOSSARY.flatMap((g) =>
  g.terms.filter((t) => t.faq && t.faq.length > 0)
);

export default function PpcGlossaryPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Google Ads", path: "/google-adwords-management" },
            { name: "PPC Glossary 2026", path: "/ppc-glossary-for-2024" },
          ]),
          {
            "@type": "FAQPage",
            mainEntity: faqTerms.flatMap((t) =>
              (t.faq ?? []).map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              }))
            ),
          } as Record<string, unknown>,
          {
            "@type": "WebPage",
            "@id": `${SITE_URL}/ppc-glossary-for-2024`,
            name: "PPC Glossary 2026 — 100+ Pay-Per-Click Terms Explained",
            description:
              "Comprehensive pay-per-click glossary covering 100+ PPC terms with definitions, related terms, FAQ answers, and internal links to PPC services and training courses.",
            url: `${SITE_URL}/ppc-glossary-for-2024`,
            inLanguage: "en",
            publisher: {
              "@type": "Organization",
              name: "Eddie Marketing Solutions FZE",
              url: SITE_URL,
            },
          } as Record<string, unknown>,
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/google-adwords-management"
              className="hover:text-slate-300 transition-colors"
            >
              Google Ads
            </Link>
            <span>/</span>
            <span className="text-slate-300">PPC Glossary 2026</span>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-400 mb-3">
            Google Ads Reference
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl leading-snug">
            PPC Glossary for 2026
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            {TOTAL_TERMS}+ pay-per-click terms defined — from Ad Auction and
            Quality Score to Performance Max and Smart Bidding. Search by
            keyword, browse by letter, and follow internal links to related
            concepts and services.
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { value: `${TOTAL_TERMS}+`, label: "Terms defined" },
              { value: `${ALL_LETTERS.length}`, label: "Alphabet sections" },
              { value: `${faqTerms.length}`, label: "Terms with FAQ answers" },
              { value: "2026", label: "Updated for" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-400 max-w-[100px] leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a Free PPC Audit
            </Button>
            <Button
              variant="ghost"
              size="md"
              href="/google-adwords-management"
              className="text-slate-300 hover:text-white hover:bg-white/10"
            >
              Google Ads Services
            </Button>
          </div>
        </div>
      </div>

      {/* ── Interactive glossary (search, nav, terms) ─────────────────────── */}
      <GlossaryClient glossary={GLOSSARY} totalTerms={TOTAL_TERMS} />

      {/* ── Internal links ────────────────────────────────────────────────── */}
      <ClusterLinksSection variant="slug" slug="ppc-glossary-for-2024" kind="page" />

      {/* ── Lead capture ──────────────────────────────────────────────────── */}
      <LeadCaptureSection
        title="Ready to Put These PPC Terms Into Practice?"
        description="Our certified Google Ads team handles strategy, setup, and ongoing optimisation — so you get results, not just terminology."
        submitLabel="Get a Free PPC Consultation"
        eyebrow="Free Consultation"
      />

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-400 mb-3">
            Google Ads Management
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Let&apos;s Build a PPC Strategy That Delivers
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            From keyword research to campaign architecture, Smart Bidding, and
            conversion optimisation — Eddie Marketing runs PPC that performs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a Free PPC Audit
            </Button>
            <Button
              variant="ghost"
              size="lg"
              href="/services/google-ads"
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              View Google Ads Services
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
