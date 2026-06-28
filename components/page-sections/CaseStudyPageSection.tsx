import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CaseStudyCardData {
  slug: string;
  title: string;
  clientName: string | null;
  serviceType: string | null;
  industry: string | null;
  trafficIncreasePercent: number | null;
  leadIncreasePercent: number | null;
}

interface CaseMeta {
  industry: string | null;
  industryLabel: string | null;
  service: string | null;
  serviceLabel: string | null;
}

interface ChallengeItem {
  title: string;
  desc: string;
}

interface TemplateData {
  challenges: ChallengeItem[];
  strategyTitle: string;
  strategyDesc: string;
  deliverables: string[];
  outcomeDesc: string;
}

// ─── Classification ────────────────────────────────────────────────────────────

function detectCaseStudyMeta(slug: string): CaseMeta {
  const s = slug.toLowerCase();

  let industry: string | null = null;
  let industryLabel: string | null = null;

  if (/medical|healthcare|clinic|physician|surgeon|psychologist|massage|fitness|yoga|dentist/.test(s)) {
    industry = "healthcare"; industryLabel = "Healthcare";
  } else if (/\blaw\b|legal|attorney|lawyer/.test(s)) {
    industry = "legal"; industryLabel = "Legal";
  } else if (/real.estate|property|commercial.real|home.builder/.test(s)) {
    industry = "real-estate"; industryLabel = "Real Estate";
  } else if (/construction|contractor|cabinetry|decking|window.and.door|industrial|manufacturing/.test(s)) {
    industry = "construction"; industryLabel = "Construction";
  } else if (/ecommerce|e.commerce|jewelry|cpg|hair.salon|cbd|retail/.test(s)) {
    industry = "ecommerce"; industryLabel = "E-Commerce";
  } else if (/nonprofit|non.profit|charitable|charity/.test(s)) {
    industry = "nonprofit"; industryLabel = "Nonprofit";
  } else if (/education|higher.education|university|school/.test(s)) {
    industry = "education"; industryLabel = "Education";
  } else if (/financial|finance|atm|bank|insurance|accounting/.test(s)) {
    industry = "finance"; industryLabel = "Finance";
  } else if (/automotive|car.wash/.test(s)) {
    industry = "automotive"; industryLabel = "Automotive";
  } else if (/saas|software|crypto/.test(s)) {
    industry = "tech"; industryLabel = "Tech & SaaS";
  } else if (/band|musician|orchestra|wedding.band|wedding.musician|entertainment|photographer|convention|cafe|bar/.test(s)) {
    industry = "hospitality"; industryLabel = "Hospitality & Entertainment";
  }

  let service: string | null = null;
  let serviceLabel: string | null = null;

  if (/\bseo\b|search.engine.optim/.test(s)) {
    service = "seo"; serviceLabel = "SEO";
  } else if (/paid.search|ppc|google.ads|google.adwords/.test(s)) {
    service = "paid-search"; serviceLabel = "Paid Search";
  } else if (/web.design|website.design/.test(s)) {
    service = "web-design"; serviceLabel = "Web Design";
  } else if (/web.development|website.development/.test(s)) {
    service = "web-dev"; serviceLabel = "Web Development";
  } else if (/social.media/.test(s)) {
    service = "social-media"; serviceLabel = "Social Media";
  } else if (/local.search|local.optim/.test(s)) {
    service = "local-seo"; serviceLabel = "Local SEO";
  } else if (/advertising|marketing/.test(s)) {
    service = "marketing"; serviceLabel = "Digital Marketing";
  }

  return { industry, industryLabel, service, serviceLabel };
}

// ─── Neutral Metrics ──────────────────────────────────────────────────────────

const NEUTRAL_METRICS = [
  {
    label: "Visibility Improved",
    note: "Search presence and brand awareness grew measurably across target channels",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    ),
  },
  {
    label: "Leads Increased",
    note: "Qualified enquiry volume rose consistently across the engagement period",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    label: "Campaign Efficiency",
    note: "Cost-per-acquisition improved as campaigns were refined and optimised",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
  },
  {
    label: "Search Presence",
    note: "Organic rankings improved across high-intent keyword clusters",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
  },
];

// ─── Service Templates ────────────────────────────────────────────────────────

const SERVICE_TEMPLATES: Record<string, TemplateData> = {
  seo: {
    challenges: [
      { title: "Low Organic Visibility", desc: "The client had limited presence on Google for their target keywords, losing potential customers to better-ranked competitors." },
      { title: "Technical SEO Issues", desc: "Site speed problems, crawl errors, and poor internal linking were preventing search engines from properly indexing key pages." },
      { title: "Insufficient Content Depth", desc: "Limited content meant the site was not capturing mid and lower-funnel search demand from qualified prospects." },
    ],
    strategyTitle: "A Technical and Content-Led SEO Strategy",
    strategyDesc: "Eddie Marketing Solutions delivered a comprehensive SEO programme starting with a full technical audit to resolve crawlability and speed issues, followed by targeted on-page optimisation and a structured content strategy to capture high-intent search queries across the client's core service areas.",
    deliverables: ["Technical SEO Audit", "Keyword Research", "On-Page Optimisation", "Content Strategy", "Link Building", "Performance Reporting"],
    outcomeDesc: "The client achieved measurable improvements in organic search rankings, qualified traffic volume, and overall digital visibility within their target market. Search presence for priority keywords expanded, and the site began converting organic visitors into enquiries at a higher rate.",
  },
  "paid-search": {
    challenges: [
      { title: "High Ad Spend with Poor Returns", desc: "Existing campaigns were generating clicks but not converting them into qualified leads at a sustainable cost-per-acquisition." },
      { title: "Broad Targeting Wasting Budget", desc: "Campaigns were targeting keywords too broadly, attracting irrelevant traffic and driving unnecessary spend." },
      { title: "No Conversion Tracking", desc: "Without proper tracking in place, it was impossible to accurately attribute leads back to campaigns and channels." },
    ],
    strategyTitle: "A Data-Driven PPC Restructure",
    strategyDesc: "Eddie Marketing Solutions conducted a full paid search account audit and implemented a targeted restructure. Campaigns were rebuilt around high-intent keyword clusters, negative keyword lists were developed, and conversion tracking was implemented to accurately measure cost per qualified lead.",
    deliverables: ["Account Audit", "Campaign Restructure", "Keyword Research", "Negative Keyword Lists", "Bid Optimisation", "Conversion Tracking", "Monthly Reporting"],
    outcomeDesc: "The restructured campaigns delivered more qualified leads at a lower cost-per-acquisition. Budget wastage from irrelevant traffic was significantly reduced, and the client gained full visibility into which campaigns and keywords were generating their highest-quality enquiries.",
  },
  "web-design": {
    challenges: [
      { title: "Outdated Design Hurting Credibility", desc: "The existing website looked dated and did not reflect the quality of the client's services, undermining first impressions." },
      { title: "Poor Mobile Experience", desc: "The site was not optimised for mobile devices, causing high bounce rates from the majority of visitors." },
      { title: "Low Conversion Rate", desc: "Visitors were leaving without taking action due to unclear navigation and insufficient calls to action." },
    ],
    strategyTitle: "A Conversion-Focused Website Redesign",
    strategyDesc: "Eddie Marketing Solutions delivered a full website redesign with a mobile-first approach. The new site was built to reflect the client's brand identity, improve page speed, and guide visitors through a clear conversion path from landing to enquiry.",
    deliverables: ["UX & UI Design", "Mobile-First Development", "Page Speed Optimisation", "CMS Integration", "SEO Foundation", "Launch Support"],
    outcomeDesc: "The new website delivered a significantly improved user experience across all devices. Engagement metrics improved, bounce rates decreased, and the site began converting a higher proportion of visitors into qualified enquiries for the client's team.",
  },
  "web-dev": {
    challenges: [
      { title: "Missing Functionality", desc: "The client needed specific technical capabilities that their existing website platform could not support." },
      { title: "Performance and Speed Issues", desc: "Slow load times were negatively impacting both user experience and search engine performance." },
      { title: "Scalability Constraints", desc: "The existing technology stack was not capable of supporting the client's anticipated growth plans." },
    ],
    strategyTitle: "A Purpose-Built Web Development Solution",
    strategyDesc: "Eddie Marketing Solutions scoped and built a custom web solution tailored to the client's specific functional requirements. The build prioritised performance, scalability, and integration with the client's existing business systems from the ground up.",
    deliverables: ["Technical Discovery", "Custom Development", "Performance Optimisation", "Third-Party Integrations", "Testing & QA", "Ongoing Support"],
    outcomeDesc: "The completed development project delivered all required functionality on time and within scope. Site performance improved substantially and the client gained a scalable platform capable of supporting their growth plans into the future.",
  },
  "social-media": {
    challenges: [
      { title: "Low Engagement", desc: "The client's social media presence lacked consistency, resulting in low engagement and limited organic reach." },
      { title: "No Content Strategy", desc: "Content was posted without a defined strategy, making it difficult to build audience connection or brand authority." },
      { title: "Unclear Social ROI", desc: "Paid social campaigns were running without proper targeting or conversion tracking, making ROI measurement impossible." },
    ],
    strategyTitle: "A Structured Social Media Strategy",
    strategyDesc: "Eddie Marketing Solutions developed a content calendar, defined brand voice guidelines, and launched targeted paid social campaigns with proper audience segmentation and tracking. Community management was implemented to drive meaningful engagement.",
    deliverables: ["Content Strategy", "Content Calendar", "Social Management", "Paid Social Campaigns", "Community Management", "Analytics Reporting"],
    outcomeDesc: "The client's social media presence became consistent, on-brand, and measurably engaging. Paid campaigns delivered qualified traffic and enquiries at defined target costs, and organic follower growth followed the improved content quality and consistency.",
  },
  "local-seo": {
    challenges: [
      { title: "Invisible in Local Search", desc: "The client was not appearing in Google local search results or Google Maps for their primary service area keywords." },
      { title: "Incomplete Google Business Profile", desc: "An unoptimised profile was limiting local search visibility and preventing effective review acquisition." },
      { title: "Inconsistent Business Listings", desc: "NAP inconsistencies across directories were undermining local search trust signals with search engines." },
    ],
    strategyTitle: "A Comprehensive Local SEO Programme",
    strategyDesc: "Eddie Marketing Solutions optimised the client's Google Business Profile, corrected NAP inconsistencies across all key directories, and implemented a local content and review generation strategy to build local search authority.",
    deliverables: ["Google Business Profile", "NAP Consistency Audit", "Local Citation Building", "Review Strategy", "Local Content", "Ranking Reports"],
    outcomeDesc: "The client achieved improved visibility in local search and Google Maps for their priority service area keywords. The optimised profile drove increased calls and enquiries, and the review strategy built a stronger trust signal for prospective customers.",
  },
  marketing: {
    challenges: [
      { title: "Limited Digital Presence", desc: "The client lacked a cohesive digital marketing strategy, resulting in inconsistent visibility and missed lead opportunities." },
      { title: "Strong Competitor Presence", desc: "Well-established competitors were capturing the majority of search demand, making it difficult to win visibility organically." },
      { title: "No Marketing Attribution", desc: "Without proper tracking, the client could not identify which channels were actually generating their business enquiries." },
    ],
    strategyTitle: "A Multi-Channel Digital Marketing Strategy",
    strategyDesc: "Eddie Marketing Solutions developed a comprehensive digital marketing strategy combining SEO, paid search, and content marketing. Full attribution tracking was implemented to give the client clear visibility into each channel's performance and contribution to lead generation.",
    deliverables: ["Digital Strategy", "SEO", "Google Ads", "Content Marketing", "Conversion Tracking", "Performance Reporting"],
    outcomeDesc: "The client gained a structured, measurable digital marketing programme that consistently generated qualified leads. Visibility across search channels improved significantly, and the client could for the first time accurately identify which activities were driving their business results.",
  },
};

const DEFAULT_TEMPLATE = SERVICE_TEMPLATES.marketing;

// ─── Related Case Studies ─────────────────────────────────────────────────────

function getRelatedCaseStudies(
  currentSlug: string,
  meta: CaseMeta,
  caseStudies: CaseStudyCardData[]
): CaseStudyCardData[] {
  const others = caseStudies.filter((cs) => cs.slug !== currentSlug);
  const matched = others.filter((cs) => {
    if (meta.industryLabel && cs.industry) {
      if (cs.industry.toLowerCase().includes((meta.industry ?? "").replace("-", " "))) return true;
    }
    if (meta.serviceLabel && cs.serviceType) {
      if (cs.serviceType.toLowerCase().includes(meta.serviceLabel.toLowerCase())) return true;
    }
    return false;
  });
  return (matched.length >= 2 ? matched : others).slice(0, 3);
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface CaseStudyPageSectionProps {
  slug: string;
  title: string;
  caseStudies: CaseStudyCardData[];
}

export function CaseStudyPageSection({ slug, title, caseStudies }: CaseStudyPageSectionProps) {
  const meta = detectCaseStudyMeta(slug);
  const template =
    meta.service && SERVICE_TEMPLATES[meta.service]
      ? SERVICE_TEMPLATES[meta.service]
      : DEFAULT_TEMPLATE;
  const related = getRelatedCaseStudies(slug, meta, caseStudies);

  const categoryLabel = [meta.serviceLabel, meta.industryLabel].filter(Boolean).join(" \u00b7 ");

  return (
    <>
      {/* ── Results Snapshot ──────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
              Results
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">What Was Achieved</h2>
            {categoryLabel && (
              <p className="text-sm text-slate-500 mt-1">{categoryLabel}</p>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {NEUTRAL_METRICS.map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {m.icon}
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">{m.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Challenge & Strategy ───────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Challenge */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
                The Challenge
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">
                {meta.industryLabel
                  ? `${meta.industryLabel} Marketing Challenges`
                  : "The Client's Situation"}
              </h2>
              <div className="space-y-5">
                {template.challenges.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-0.5">{c.title}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                Our Approach
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-5">
                {template.strategyTitle}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                {template.strategyDesc}
              </p>
              <div className="flex flex-wrap gap-2">
                {meta.serviceLabel && (
                  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                    <span className="text-xs font-semibold text-teal-400 uppercase tracking-wide">Service</span>
                    <span className="text-sm text-white">{meta.serviceLabel}</span>
                  </span>
                )}
                {meta.industryLabel && (
                  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Industry</span>
                    <span className="text-sm text-white">{meta.industryLabel}</span>
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Work Delivered ────────────────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
              Deliverables
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Work Delivered
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl text-sm">
              The specific services and activities executed as part of this engagement.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {template.deliverables.map((d, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Outcome ───────────────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
              The Outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Results Delivered
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">{template.outcomeDesc}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/request-for-a-proposal"
                className="inline-flex items-center justify-center px-6 py-3 ems-btn-gradient text-white font-semibold text-sm rounded-lg"
              >
                Get a Free Strategy Session
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm rounded-lg transition-colors"
              >
                View All Case Studies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Case Studies ──────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="bg-white py-14 md:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
                  More Results
                </p>
                <h2 className="text-2xl font-bold text-slate-900">Related Case Studies</h2>
              </div>
              <Link
                href="/case-studies"
                className="hidden sm:block text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((cs) => (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    {cs.serviceType && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {cs.serviceType}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1 leading-snug">
                    {cs.clientName ?? cs.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{cs.title}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {cs.trafficIncreasePercent && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        +{cs.trafficIncreasePercent}% traffic
                      </span>
                    )}
                    {cs.leadIncreasePercent && (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        +{cs.leadIncreasePercent}% leads
                      </span>
                    )}
                  </div>
                  <span className="mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    View case study &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
