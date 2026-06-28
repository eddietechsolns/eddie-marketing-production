import Link from "next/link";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { FaqItem } from "@/components/ui/FaqAccordion";

// ─── Resource data definitions ────────────────────────────────────────────────

interface ResourceBenefit {
  title: string;
  desc: string;
}

interface ResourceStat {
  value: string;
  label: string;
  color: string;
}

interface ResourceStep {
  number: string;
  title: string;
  desc: string;
}

interface ResourceLink {
  title: string;
  href: string;
  desc: string;
}

interface ResourceData {
  eyebrow: string;
  headline: string;
  intro: string;
  benefits: ResourceBenefit[];
  stats: ResourceStat[];
  process: ResourceStep[];
  faqs: FaqItem[];
  relatedLinks: ResourceLink[];
  ctaText: string;
  ctaHref: string;
}

// ─── Slug-to-resource mapping ─────────────────────────────────────────────────

const RESOURCE_DATA: Record<string, ResourceData> = {
  "ppc-management": {
    eyebrow: "PPC Management Dubai",
    headline: "Performance-Driven PPC Management in Dubai",
    intro: "Our PPC management team runs paid search campaigns across Google, Bing, and Meta for businesses across Dubai, the UAE, and GCC — delivering qualified leads at a predictable cost.",
    benefits: [
      { title: "Immediate Lead Flow", desc: "PPC delivers qualified leads from day one — no waiting for organic rankings to build" },
      { title: "Full Budget Control", desc: "Set exact daily and monthly budgets; you only pay when a qualified prospect clicks" },
      { title: "Precision Targeting", desc: "Reach your ideal customers by keyword intent, location, device, time, and audience segment" },
      { title: "Measurable ROI", desc: "Every click, lead, and sale is tracked — you always know your exact return on ad spend" },
    ],
    stats: [
      { value: "6.2x", label: "Average ROAS", color: "bg-blue-600 text-white" },
      { value: "-42%", label: "Cost Per Lead Reduction", color: "bg-teal-600 text-white" },
      { value: "48h", label: "Average Campaign Launch", color: "bg-slate-900 text-white" },
      { value: "Top 3", label: "Average Ad Position", color: "bg-slate-100 text-slate-900" },
    ],
    process: [
      { number: "01", title: "Account Audit", desc: "Full audit of your existing campaigns (or competitor research for new accounts)" },
      { number: "02", title: "Strategy & Build", desc: "Campaign architecture, keyword selection, ad copy creation, and landing page recommendations" },
      { number: "03", title: "Launch & Test", desc: "Controlled launch with A/B ad testing and conversion tracking from week one" },
      { number: "04", title: "Weekly Optimisation", desc: "Bid adjustments, negative keyword builds, and performance refinement every week" },
      { number: "05", title: "Scale & Report", desc: "Monthly ROAS and lead reports — scaling budgets to winning campaigns" },
    ],
    faqs: [
      { question: "How much budget do I need for PPC in Dubai?", answer: "We recommend a minimum of AED 3,000–5,000/month in ad spend for the UAE market to generate statistically meaningful data. The right budget depends on your industry competitiveness, target CPA, and volume goals. We provide a specific budget recommendation before launch." },
      { question: "How quickly will PPC campaigns generate leads?", answer: "You'll see impressions and clicks from day one. Qualified conversions typically develop within the first 1–2 weeks. We optimise aggressively in the first 90 days to hit your target cost per lead." },
      { question: "Do you manage Google Ads and Meta Ads together?", answer: "Yes — we manage Google Search, Performance Max, Shopping, and Meta (Facebook/Instagram) campaigns with a unified strategy. Most Dubai businesses benefit from combining Google for intent-driven leads and Meta for awareness and retargeting." },
      { question: "Will we keep the ad account if we stop working together?", answer: "Always. Your ad account is set up in your name — you retain full ownership of all campaigns, data, and conversion history. We work inside your account, not ours." },
      { question: "How do you reduce wasted ad spend?", answer: "Rigorous negative keyword management, match type control, landing page optimisation, device and location bid adjustments, and weekly spend reviews all combine to eliminate waste. We provide full search term reports every month." },
    ],
    relatedLinks: [
      { title: "Google Ads Management", href: "/google-adwords-management", desc: "Targeted Google campaigns for UAE and GCC markets" },
      { title: "SEO Services Dubai", href: "/seo", desc: "Organic search growth that compounds over time" },
      { title: "Social Media Marketing", href: "/social-media-marketing", desc: "Meta, Instagram, and LinkedIn campaigns" },
      { title: "Analytics & Reporting", href: "/analytics-reporting", desc: "Track every campaign back to revenue" },
    ],
    ctaText: "Get a Free PPC Audit",
    ctaHref: "/request-for-a-proposal",
  },
  "seo-services": {
    eyebrow: "SEO Services Dubai",
    headline: "SEO Services That Drive Sustainable Business Growth in Dubai",
    intro: "Our SEO team helps Dubai businesses rank for high-intent search terms that convert — building organic visibility that reduces reliance on paid ads and compounds over time.",
    benefits: [
      { title: "Compound Organic Growth", desc: "SEO results compound — rankings built today keep delivering traffic and leads for years" },
      { title: "High-Intent Audiences", desc: "Organic search visitors have the highest purchase intent of any digital marketing channel" },
      { title: "Brand Authority", desc: "First-page rankings signal credibility to prospects who trust organic results over ads" },
      { title: "Reduced Ad Dependency", desc: "Strong organic rankings progressively reduce your need for expensive paid traffic" },
    ],
    stats: [
      { value: "+380%", label: "Average Traffic Growth", color: "bg-blue-600 text-white" },
      { value: "Top 3", label: "Average Keyword Position", color: "bg-teal-600 text-white" },
      { value: "9.4x", label: "Average SEO ROI", color: "bg-slate-900 text-white" },
      { value: "6 Mo", label: "Avg. Time to Rankings", color: "bg-slate-100 text-slate-900" },
    ],
    process: [
      { number: "01", title: "Technical Audit", desc: "Full crawl of your site — Core Web Vitals, indexation, speed, and schema issues identified" },
      { number: "02", title: "Keyword Strategy", desc: "In-depth keyword research mapping commercial intent to pages across your site" },
      { number: "03", title: "On-Page Optimisation", desc: "Title tags, meta descriptions, heading structure, and content optimisation applied" },
      { number: "04", title: "Content & Links", desc: "Authority content created and high-quality backlinks acquired through editorial outreach" },
      { number: "05", title: "Monitor & Scale", desc: "Weekly rank tracking with monthly reporting — compounding growth month on month" },
    ],
    faqs: [
      { question: "How long does SEO take to work in Dubai?", answer: "Meaningful ranking improvements appear within 3–6 months. Full compounding results — consistent rankings, traffic, and leads — develop over 12+ months. Technical fixes often deliver visible gains within the first 8 weeks." },
      { question: "Is local SEO different from standard SEO for Dubai businesses?", answer: "Yes — local SEO targets location-specific search terms ('SEO agency Dubai', 'digital marketing near me') and optimises your Google Business Profile for map pack rankings. We include both local and broader keyword targeting in every Dubai SEO engagement." },
      { question: "How do you choose which keywords to target?", answer: "We research keywords by search volume, commercial intent, and ranking difficulty. We prioritise terms your target customers search when ready to buy — not just browse — focusing on enquiries and conversions, not vanity traffic." },
      { question: "Do you include link building in your SEO service?", answer: "Yes — backlinks remain one of Google's top ranking signals. We acquire links through editorial outreach, digital PR, and content partnerships — never paid link schemes that risk penalties." },
      { question: "Can SEO work alongside our Google Ads campaigns?", answer: "Yes — SEO and Google Ads are complementary. Ads deliver immediate traffic while SEO builds long-term organic rankings. Together they maximise search engine coverage and reduce overall cost per lead as organic traffic grows." },
    ],
    relatedLinks: [
      { title: "Google Ads Management", href: "/google-adwords-management", desc: "Immediate lead flow via paid search" },
      { title: "Content Marketing", href: "/content-marketing", desc: "Authority content that supports SEO rankings" },
      { title: "Web Design Dubai", href: "/web-design", desc: "Technical SEO foundations built into every website" },
      { title: "Analytics & Reporting", href: "/analytics-reporting", desc: "Full ranking and traffic attribution" },
    ],
    ctaText: "Get a Free SEO Audit",
    ctaHref: "/request-for-a-proposal",
  },
  "google-ads": {
    eyebrow: "Google Ads Management",
    headline: "Google Ads Management for UAE & GCC Businesses",
    intro: "We manage Google Ads campaigns that generate qualified leads and measurable ROI for businesses across Dubai, Abu Dhabi, Riyadh, and the wider GCC — from initial setup to ongoing optimisation and scaling.",
    benefits: [
      { title: "Day-One Lead Flow", desc: "Google Ads puts your business in front of ready buyers immediately — no waiting for organic growth" },
      { title: "Qualified Traffic Only", desc: "Intent-based targeting ensures you reach prospects actively searching for what you offer" },
      { title: "Scalable Performance", desc: "Scale your budget into your best-performing campaigns with confidence and predictability" },
      { title: "Full Transparency", desc: "Every search term, bid, and pound spent is fully visible — no black-box reporting" },
    ],
    stats: [
      { value: "6.2x", label: "Average ROAS", color: "bg-blue-600 text-white" },
      { value: "-42%", label: "Cost Per Lead Reduction", color: "bg-teal-600 text-white" },
      { value: "48h", label: "Campaign Launch Time", color: "bg-slate-900 text-white" },
      { value: "100%", label: "Certified Google Partners", color: "bg-slate-100 text-slate-900" },
    ],
    process: [
      { number: "01", title: "Discovery & Audit", desc: "We audit existing accounts (or research from scratch) and map your highest-value keyword opportunities" },
      { number: "02", title: "Campaign Build", desc: "Structured campaigns, ad groups, and ad copy engineered for maximum Quality Score" },
      { number: "03", title: "Launch & Test", desc: "Controlled launch with A/B ad testing and full conversion tracking from day one" },
      { number: "04", title: "Optimise Weekly", desc: "Bid management, negative keyword updates, landing page refinement — every week" },
      { number: "05", title: "Scale & Report", desc: "Monthly ROAS and lead attribution reports — scaling budgets into winning campaigns" },
    ],
    faqs: [
      { question: "What types of Google Ads campaigns do you manage?", answer: "We manage Google Search, Performance Max, Google Shopping, Display and Remarketing, YouTube, and Google Hotel Ads — recommending the right campaign mix based on your business type and goals." },
      { question: "How much should we budget for Google Ads in the UAE?", answer: "We recommend AED 3,000–10,000/month in ad spend as a minimum for the UAE market, depending on industry competitiveness. We provide a specific starting budget recommendation based on your target CPA and search volume data." },
      { question: "What is Quality Score and why does it affect our costs?", answer: "Quality Score is Google's rating of your ad relevance, expected click-through rate, and landing page experience. Higher scores mean lower cost-per-click for the same ad position. Our campaign architecture is specifically designed to maximise Quality Score over time." },
      { question: "Do we keep ownership of the Google Ads account?", answer: "Always. The account is set up under your Google account — you retain full ownership, all historical data, and complete access. We work in your account, not ours. If you part ways with us, everything stays with you." },
      { question: "How quickly will Google Ads generate leads for our business?", answer: "Impressions and clicks begin from day one. Meaningful conversion data develops within the first 2–4 weeks as the algorithm learns. Most clients see significant cost-per-lead improvement within the first 60–90 days of optimisation." },
    ],
    relatedLinks: [
      { title: "SEO Services Dubai", href: "/seo", desc: "Long-term organic growth alongside paid search" },
      { title: "PPC Management", href: "/google-adwords-management", desc: "Full paid media management across all platforms" },
      { title: "Social Media Advertising", href: "/social-media-marketing", desc: "Meta and LinkedIn campaigns for brand reach" },
      { title: "Analytics & Reporting", href: "/analytics-reporting", desc: "Full conversion tracking and attribution setup" },
    ],
    ctaText: "Get a Free Google Ads Audit",
    ctaHref: "/request-for-a-proposal",
  },
  "local-seo": {
    eyebrow: "Local SEO Dubai",
    headline: "Local SEO Services That Dominate Dubai Search Results",
    intro: "Our local SEO service helps Dubai businesses rank at the top of Google Maps and local search results — driving calls, visits, and leads from customers in your exact area.",
    benefits: [
      { title: "Google Maps Dominance", desc: "Rank in the Google Maps 3-pack for your key service areas and convert map searchers into leads" },
      { title: "Neighbourhood-Level Targeting", desc: "Optimise for specific suburbs, districts, and service areas across Dubai and the wider UAE" },
      { title: "Review Profile Management", desc: "Build a 5-star review profile that beats competitors and converts searchers into callers" },
      { title: "Mobile-First Visibility", desc: "Over 70% of local searches happen on mobile — we optimise your presence for on-the-go searchers" },
    ],
    stats: [
      { value: "+260%", label: "Average Local Lead Growth", color: "bg-blue-600 text-white" },
      { value: "Top 3", label: "Average Maps Pack Position", color: "bg-teal-600 text-white" },
      { value: "4.9★", label: "Average Client Review Score", color: "bg-slate-900 text-white" },
      { value: "90 Days", label: "Avg. Time to Local Rankings", color: "bg-slate-100 text-slate-900" },
    ],
    process: [
      { number: "01", title: "Local Audit", desc: "Full review of your Google Business Profile, local citations, review profile, and competitor rankings" },
      { number: "02", title: "GBP Optimisation", desc: "Complete Google Business Profile setup — categories, photos, posts, Q&A, and service areas" },
      { number: "03", title: "Local SEO", desc: "Location-specific on-page optimisation and local keyword targeting for your suburb and service areas" },
      { number: "04", title: "Citation Building", desc: "Consistent NAP (Name, Address, Phone) citations built across key UAE directories and platforms" },
      { number: "05", title: "Review Strategy", desc: "Systematic review generation and management to build your rating and local ranking signals" },
    ],
    faqs: [
      { question: "How long does local SEO take to work in Dubai?", answer: "Google Business Profile improvements are visible within 4–8 weeks. Local organic rankings typically improve meaningfully within 3–6 months. Google Maps pack positions usually move faster than standard organic rankings." },
      { question: "Do you manage our Google Business Profile?", answer: "Yes — we fully manage your Google Business Profile including weekly posts, photo uploads, Q&A management, review responses, and service area updates. A well-managed GBP is one of the highest-leverage local SEO activities." },
      { question: "How important are reviews for local SEO in Dubai?", answer: "Reviews are critical — they directly influence both Google Maps rankings and the decision to call you vs. a competitor. We implement systematic post-job review requests via SMS and email to build your profile consistently." },
      { question: "Can you target multiple locations across Dubai?", answer: "Yes — we build separate optimisation strategies for each suburb or district you serve, with location-specific landing pages, GBP service area updates, and geo-targeted content targeting each area's search volume." },
      { question: "What's the difference between local SEO and standard SEO?", answer: "Local SEO specifically targets location-based searches ('dentist in JBR', 'plumber near me'), optimises your Google Business Profile for Maps visibility, and builds local citations. Standard SEO targets broader informational and commercial keywords without geographic intent." },
    ],
    relatedLinks: [
      { title: "SEO Services Dubai", href: "/seo", desc: "Full organic search optimisation beyond local" },
      { title: "Google Ads for Local Businesses", href: "/google-adwords-management", desc: "Google Local Services Ads and search campaigns" },
      { title: "Web Design Dubai", href: "/web-design", desc: "Location-optimised websites for local businesses" },
      { title: "Content Marketing", href: "/content-marketing", desc: "Local content that builds authority and rankings" },
    ],
    ctaText: "Get a Free Local SEO Audit",
    ctaHref: "/request-for-a-proposal",
  },
};

// ─── Slug → resource key mapping ─────────────────────────────────────────────

function getResourceKey(slug: string): string | null {
  if (/ppc[-_]management/i.test(slug)) return "ppc-management";
  if (/seo[-_]services|best[-_]seo[-_]services|seo[-_]agency/i.test(slug)) return "seo-services";
  if (/google[-_]ads[-_](?:agency|management)|maximize[-_]your[-_]roi.*google/i.test(slug)) return "google-ads";
  if (/local[-_]seo.*dubai|local[-_]seo[-_]guide/i.test(slug)) return "local-seo";
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ResourceArticleBlockProps {
  slug: string;
}

export function ResourceArticleBlock({ slug }: ResourceArticleBlockProps) {
  const key = getResourceKey(slug);
  if (!key) return null;

  const data = RESOURCE_DATA[key];
  if (!data) return null;

  return (
    <div className="border-t border-slate-200">

      {/* Eyebrow header */}
      <div className="bg-blue-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-teal-400 rounded-full" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-200">Resource Hub</p>
              <p className="text-sm font-bold text-white">{data.eyebrow}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-6 text-center">Results We Deliver</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((stat, i) => (
              <div key={i} className={`rounded-xl p-5 text-center ${stat.color}`}>
                <div className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
                <div className="text-xs font-medium opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Why It Matters</p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{data.headline}</h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl">{data.intro}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.benefits.map((b, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{b.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">How It Works</p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8">Our Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.process.map((step, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="text-2xl font-black text-blue-600 mb-2 font-mono">{step.number}</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <FaqAccordion
        items={data.faqs}
        eyebrow="Common Questions"
        title="Frequently Asked Questions"
      />

      {/* Related Resources */}
      <div className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Related Services</p>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Explore Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {data.relatedLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="group flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-0.5">{link.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-2xl p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-200 mb-2">Ready to Start?</p>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Get a Free Consultation</h3>
            <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">
              30 minutes with a senior specialist. We&apos;ll review your current performance and show you exactly where to focus for the biggest impact.
            </p>
            <Link
              href={data.ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3 ems-gradient-bg text-white text-sm font-bold rounded-lg transition-colors"
            >
              {data.ctaText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
