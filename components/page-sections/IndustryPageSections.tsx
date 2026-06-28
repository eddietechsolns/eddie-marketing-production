import Link from "next/link";
import { ServiceCard, StatCard, FeatureCard } from "@/components/ui/Card";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { FaqItem } from "@/components/ui/FaqAccordion";

// ─── Industry-specific content data ──────────────────────────────────────────

interface IndustryStat {
  value: string;
  label: string;
  accent: "blue" | "orange" | "green";
}

interface IndustryChallenge {
  title: string;
  desc: string;
}

interface IndustrySolution {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface ProcessStep {
  number: string;
  title: string;
  desc: string;
}

interface IndustryData {
  tagline: string;
  stats: IndustryStat[];
  challenges: IndustryChallenge[];
  solutions: IndustrySolution[];
  services: { title: string; description: string; href: string }[];
  whyEddie: { title: string; desc: string }[];
  process: ProcessStep[];
  faqs: FaqItem[];
}

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const TrendIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
const BoltIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const INDUSTRY_DATA: Record<string, IndustryData> = {
  healthcare: {
    tagline: "Helping healthcare providers attract patients and grow their practice",
    stats: [
      { value: "300+", label: "Healthcare Clients Served", accent: "blue" },
      { value: "97%", label: "Client Retention Rate", accent: "orange" },
      { value: "+380%", label: "Average Traffic Growth", accent: "green" },
      { value: "12 Yrs", label: "Healthcare Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Strict Advertising Compliance", desc: "Navigating healthcare ad regulations without sacrificing campaign reach and impact" },
      { title: "Building Patient Trust Online", desc: "Establishing credibility in a high-stakes environment where patients scrutinise every claim" },
      { title: "Intense Competition", desc: "Standing out in a crowded market where clinics and hospitals all claim to be the best" },
      { title: "Multi-Location Coordination", desc: "Maintaining brand consistency and campaign performance across multiple practice locations" },
    ],
    solutions: [
      { title: "Compliant Ad Campaigns", desc: "Campaigns engineered to meet healthcare advertising standards while maximising patient reach", icon: <ShieldIcon /> },
      { title: "Patient Acquisition Funnels", desc: "Data-driven funnels designed to convert interested visitors into booked appointments", icon: <TrendIcon /> },
      { title: "Reputation Management", desc: "Proactive review generation and monitoring to build lasting online credibility", icon: <StarIcon /> },
      { title: "Unified Location Marketing", desc: "A cohesive digital strategy scaled consistently across all your clinic or hospital locations", icon: <UsersIcon /> },
    ],
    services: [
      { title: "Healthcare SEO", description: "Rank for high-intent patient searches in your specialty and location", href: "/seo" },
      { title: "Google Ads for Clinics", description: "Targeted PPC campaigns that drive qualified patient appointment requests", href: "/google-adwords-management" },
      { title: "Medical Social Media", description: "Build trust and engage patients on Facebook, Instagram, and LinkedIn", href: "/social-media-marketing" },
      { title: "Medical Web Design", description: "Conversion-focused clinic websites that build trust and generate leads", href: "/web-design" },
    ],
    whyEddie: [
      { title: "Deep Healthcare Expertise", desc: "We've run campaigns for hospitals, clinics, and specialist practices across UAE and GCC" },
      { title: "Compliance-First Campaigns", desc: "Every ad and landing page is reviewed against healthcare advertising guidelines before launch" },
      { title: "Real Outcome Focus", desc: "We measure appointment bookings and patient leads — not just traffic and impressions" },
      { title: "Dedicated Senior Strategist", desc: "A dedicated account manager with healthcare sector experience handles your campaigns" },
    ],
    process: [
      { number: "01", title: "Digital Audit", desc: "Analyse your current online presence, patient search rankings, and competitor positioning" },
      { number: "02", title: "Compliance Strategy", desc: "Build a healthcare-compliant digital strategy across all channels — SEO, PPC, and social" },
      { number: "03", title: "Campaign Launch", desc: "Deploy targeted Google Ads and SEO campaigns capturing patients at the point of search" },
      { number: "04", title: "Lead Nurturing", desc: "Convert enquiries into booked appointments via optimised landing pages and follow-up sequences" },
      { number: "05", title: "Report & Scale", desc: "Monthly performance reviews tracking patient acquisition cost, bookings, and channel ROI" },
    ],
    faqs: [
      { question: "How long does healthcare SEO take to show results?", answer: "Meaningful ranking improvements typically appear within 3–6 months. Full compounding results — consistent rankings, traffic, and appointment leads — develop over 6–12 months. Google Ads delivers qualified leads from week one, so most healthcare clients run both channels simultaneously." },
      { question: "Can Google Ads be used to promote medical services?", answer: "Yes — with careful compliance review. We ensure every campaign meets Google's healthcare advertising policies and local healthcare promotion regulations before launch. This includes verifying claims, avoiding prohibited health terms, and using approved call-to-action language." },
      { question: "How do you generate appointment bookings online?", answer: "We combine targeted PPC campaigns with high-converting landing pages, call tracking integration, and appointment booking CTAs. For clinics, we often integrate directly with booking platforms so patients can schedule immediately from the ad or landing page." },
      { question: "Do you manage marketing for multi-location clinics?", answer: "Yes — we build unified strategies that maintain brand consistency while targeting each location's local patient audience separately. Each location gets its own local SEO optimisation, Google Business Profile management, and geo-targeted ad campaigns." },
      { question: "What makes healthcare marketing different from general digital marketing?", answer: "Healthcare marketing requires strict compliance with advertising regulations, patient trust signals (credentials, reviews, before/after results handled carefully), and outcome-focused messaging. Volume-based acquisition tactics don't work — quality and trust matter more than raw traffic numbers." },
    ],
  },
  hospitality: {
    tagline: "Filling rooms and tables with targeted digital marketing for hospitality brands",
    stats: [
      { value: "200+", label: "Hotels & Restaurants Served", accent: "blue" },
      { value: "+290%", label: "Average Direct Booking Growth", accent: "orange" },
      { value: "35+", label: "UAE Hospitality Campaigns", accent: "green" },
      { value: "8 Yrs", label: "Hospitality Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "OTA Dependency", desc: "Over-reliance on booking platforms cuts into margins with high commission fees" },
      { title: "Seasonal Demand Swings", desc: "Managing occupancy and revenue across peak and low-demand seasons" },
      { title: "Review Management", desc: "A single negative TripAdvisor or Google review can cost significant bookings" },
      { title: "Target Audience Reach", desc: "Reaching the right traveller profile — leisure, business, luxury, or budget" },
    ],
    solutions: [
      { title: "Direct Booking Campaigns", desc: "Google and Meta campaigns that drive direct reservations, bypassing OTA fees", icon: <BoltIcon /> },
      { title: "Seasonal Revenue Strategy", desc: "Data-driven campaigns that smooth revenue across high and low seasons", icon: <TrendIcon /> },
      { title: "Review & Reputation Management", desc: "Automated review generation and response management to protect your rating", icon: <StarIcon /> },
      { title: "Audience-Targeted Advertising", desc: "Hyper-targeted ads reaching your ideal guest profile across all channels", icon: <UsersIcon /> },
    ],
    services: [
      { title: "Hotel SEO", description: "Rank for high-intent travel searches and drive direct organic bookings", href: "/seo" },
      { title: "Google Ads for Hotels", description: "Google Hotel Ads and Search campaigns to capture booking-ready travellers", href: "/google-adwords-management" },
      { title: "Social Media for Hospitality", description: "Instagram, Facebook, and LinkedIn campaigns that showcase your property", href: "/social-media-marketing" },
      { title: "Hospitality Web Design", description: "Visually stunning hotel websites optimised for direct conversion", href: "/web-design" },
    ],
    whyEddie: [
      { title: "UAE & GCC Hospitality Expertise", desc: "We understand the nuances of marketing hotels and restaurants in the Middle East" },
      { title: "Direct Booking Focus", desc: "We prioritise campaigns that reduce OTA dependency and maximise direct revenue" },
      { title: "Multi-Channel Approach", desc: "Coordinated Google, Meta, and SEO campaigns for maximum visibility" },
      { title: "Proven Results", desc: "Our hospitality clients see an average 290% increase in direct bookings within 6 months" },
    ],
    process: [
      { number: "01", title: "Property Audit", desc: "Analyse your OTA dependency, organic rankings, social presence, and direct booking rates" },
      { number: "02", title: "Revenue Strategy", desc: "Build a multi-channel strategy focused on reducing OTA commissions and growing direct revenue" },
      { number: "03", title: "Campaign Activation", desc: "Launch Google Hotel Ads, Meta campaigns, and local SEO across your target geographies" },
      { number: "04", title: "Booking Optimisation", desc: "Improve direct booking conversion through A/B-tested landing pages and retargeting sequences" },
      { number: "05", title: "Report & Scale", desc: "Monthly reports tracking direct booking revenue, ROAS, and channel-by-channel contribution" },
    ],
    faqs: [
      { question: "How do you reduce a hotel's OTA dependency?", answer: "We shift budget toward direct booking channels — Google Hotel Ads, organic SEO, Meta retargeting, and email sequences — systematically growing the proportion of commission-free direct reservations. Most clients see OTA share decline by 15–30% within the first year." },
      { question: "Can you target specific traveller profiles like luxury or business guests?", answer: "Yes — our campaigns are built around detailed audience personas defined by travel purpose, origin geography, booking behaviour, and spend level. Luxury travellers, corporate guests, and leisure families require different platforms, messaging, and targeting parameters." },
      { question: "How quickly can you launch a campaign for a new hotel opening?", answer: "We can activate a full launch campaign within 2 weeks of receiving your brief and brand assets — including Google Hotel Ads setup, Google Business Profile, Meta campaigns, and local SEO foundations. Pre-opening SEO and social building should ideally start 3–4 months before opening." },
      { question: "Do you manage social media content for hotels?", answer: "Yes — we handle content creation, photography briefing, copywriting, community management, and paid social campaigns across Instagram, Facebook, and LinkedIn. We work from a 30-day content calendar approved by your team before posting." },
      { question: "How do you manage low season marketing for hotels?", answer: "We build seasonal revenue strategies in advance — shifting focus to long-stay promotions, staycation audiences, corporate travel, and domestic tourism during low-demand periods. Retargeting of past guests is often the highest-ROI tactic during off-peak windows." },
    ],
  },
  legal: {
    tagline: "Helping law firms attract high-value clients through strategic digital marketing",
    stats: [
      { value: "150+", label: "Law Firms Served", accent: "blue" },
      { value: "+520%", label: "Average Lead Growth", accent: "orange" },
      { value: "95%", label: "Client Retention Rate", accent: "green" },
      { value: "10 Yrs", label: "Legal Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Bar Advertising Rules", desc: "Legal advertising is heavily regulated — every claim must meet professional conduct standards" },
      { title: "Client Acquisition Cost", desc: "Legal services keywords are among the most competitive and expensive in Google Ads" },
      { title: "Building Authority", desc: "Prospects need to trust your firm before making contact — authority content is critical" },
      { title: "Practice Area Targeting", desc: "Reaching exactly the right clients for your specific practice areas and jurisdictions" },
    ],
    solutions: [
      { title: "Compliant Legal Marketing", desc: "Ad copy and landing pages crafted to comply with bar association advertising rules", icon: <ShieldIcon /> },
      { title: "High-Intent PPC Campaigns", desc: "Smart bidding strategies that maximise ROI on competitive legal keywords", icon: <TrendIcon /> },
      { title: "Authority Content Strategy", desc: "Legal blog content and resources that position your firm as the trusted expert", icon: <StarIcon /> },
      { title: "Practice Area Targeting", desc: "Precise targeting by practice area, location, and client profile for maximum relevance", icon: <BoltIcon /> },
    ],
    services: [
      { title: "Law Firm SEO", description: "Rank for high-value legal search terms in your practice areas and locations", href: "/seo" },
      { title: "Legal PPC Advertising", description: "Targeted Google Ads campaigns for high-intent legal service queries", href: "/google-adwords-management" },
      { title: "Content Marketing for Law Firms", description: "Legal content that builds authority and generates qualified enquiries", href: "/content-marketing" },
      { title: "Law Firm Web Design", description: "Professional law firm websites that convert visitors into client consultations", href: "/web-design" },
    ],
    whyEddie: [
      { title: "Legal Sector Expertise", desc: "We understand the complexities of marketing legal services within professional conduct rules" },
      { title: "High-Value Client Focus", desc: "We optimise for client quality and case value, not just lead volume" },
      { title: "Confidentiality by Design", desc: "All campaigns and reporting are handled with full client confidentiality" },
      { title: "Proven GCC Track Record", desc: "Trusted by law firms across Dubai, Abu Dhabi, Riyadh, and Doha" },
    ],
    process: [
      { number: "01", title: "Practice Audit", desc: "Analyse your current case types, target client profile, and competitive landscape by practice area" },
      { number: "02", title: "Compliance Strategy", desc: "Build bar association-compliant campaign strategy tailored to your jurisdiction and practice areas" },
      { number: "03", title: "Campaign Launch", desc: "Deploy targeted SEO and PPC campaigns for your highest-value practice areas and client queries" },
      { number: "04", title: "Authority Building", desc: "Produce legal articles, guides, and case studies that build trust and search engine authority" },
      { number: "05", title: "Report & Scale", desc: "Monthly reports tracking qualified leads, consultation bookings, and cost per new client enquiry" },
    ],
    faqs: [
      { question: "Are your legal marketing campaigns bar association compliant?", answer: "Yes — every ad, landing page, and piece of content is reviewed against bar association advertising guidelines before launch. We never make prohibited claims, avoid misleading superlatives, and include required disclaimers appropriate to your jurisdiction." },
      { question: "How do you generate high-value client enquiries for law firms?", answer: "We combine targeted SEO for practice area keywords, PPC for high-intent search queries, and authority content — articles, guides, and case insights — that builds trust before first contact. High-value clients conduct significant research before engaging a firm; we ensure you're visible and credible at every stage." },
      { question: "How long does law firm SEO take to work?", answer: "For competitive legal search terms, meaningful ranking movements typically appear within 6–9 months. PPC delivers qualified consultation requests from day one. Most law firms run both simultaneously — SEO for long-term authority, PPC for immediate lead flow." },
      { question: "Can you target specific practice areas and client types?", answer: "Yes — we build separate campaigns per practice area, targeting audiences by legal need, jurisdiction, business type, or personal situation. A commercial litigation campaign looks completely different from a family law or employment law campaign in terms of keywords, messaging, and audience targeting." },
      { question: "How do you handle client confidentiality in legal marketing?", answer: "All client data, campaign details, and performance reporting are handled with full professional confidentiality. We never reference specific client matters in our work, and all access to your systems is restricted to named team members under NDA." },
    ],
  },
  "real-estate": {
    tagline: "Generating qualified property enquiries and buyer leads for real estate brands",
    stats: [
      { value: "400+", label: "Property Campaigns Delivered", accent: "blue" },
      { value: "+340%", label: "Average Lead Growth", accent: "orange" },
      { value: "AED 2B+", label: "Property Value Marketed", accent: "green" },
      { value: "9 Yrs", label: "Real Estate Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Lead Quality vs. Volume", desc: "Generating large volumes of enquiries is easy — generating serious buyers is the challenge" },
      { title: "Seasonal Market Shifts", desc: "The property market fluctuates with economic conditions and seasonal demand patterns" },
      { title: "Off-Plan vs. Ready Property", desc: "Marketing strategies differ significantly between off-plan launches and ready secondary stock" },
      { title: "Competitive Dubai Market", desc: "Hundreds of developers and agents are competing for the same buyer audiences" },
    ],
    solutions: [
      { title: "Qualified Lead Generation", desc: "Targeted campaigns designed to attract serious buyers and investors, not tyre-kickers", icon: <CheckIcon /> },
      { title: "Developer Launch Campaigns", desc: "Full-funnel launch strategies for off-plan projects — from awareness to registration", icon: <BoltIcon /> },
      { title: "Secondary Market Strategy", desc: "SEO and PPC campaigns optimised for ready property searches and immediate buyers", icon: <TrendIcon /> },
      { title: "Investor Audience Targeting", desc: "Reach high-net-worth investors across UAE, GCC, Europe, and Asia", icon: <UsersIcon /> },
    ],
    services: [
      { title: "Real Estate SEO", description: "Rank for high-intent property search terms in your target locations", href: "/seo" },
      { title: "Property PPC Campaigns", description: "Google and Meta campaigns that drive qualified property enquiries", href: "/google-adwords-management" },
      { title: "Real Estate Social Media", description: "Property showcase campaigns on Instagram, Facebook, and LinkedIn", href: "/social-media-marketing" },
      { title: "Property Web Design", description: "High-converting property websites and landing pages for off-plan launches", href: "/web-design" },
    ],
    whyEddie: [
      { title: "UAE Real Estate Specialists", desc: "We've marketed properties from studios to luxury villas and commercial developments" },
      { title: "Investor Audience Access", desc: "We reach qualified buyers and investors across UAE, GCC, Europe, and Asia-Pacific" },
      { title: "Launch-Ready Campaigns", desc: "Full-funnel launch campaigns ready to activate on your development timeline" },
      { title: "Measurable ROI", desc: "Every campaign is tracked from ad impression to signed contract — full transparency" },
    ],
    process: [
      { number: "01", title: "Portfolio Audit", desc: "Analyse your property portfolio, target buyer profile, and competitive market positioning" },
      { number: "02", title: "Launch Strategy", desc: "Build targeted multi-channel campaigns for each development type and buyer audience" },
      { number: "03", title: "Lead Generation", desc: "Deploy Google, Meta, and LinkedIn campaigns reaching qualified buyers and investors" },
      { number: "04", title: "Lead Qualification", desc: "Filter and qualify leads through CRM integration and structured follow-up sequences" },
      { number: "05", title: "Report & Scale", desc: "Track cost per qualified enquiry and scale campaigns based on conversion and sales data" },
    ],
    faqs: [
      { question: "How do you generate qualified property buyers rather than time-wasters?", answer: "We use intent-based keyword targeting, lead qualification forms with qualifying questions (budget, timeline, purpose), and CRM integration to filter serious buyers before they reach your sales team. Lookalike audiences built from your existing buyer profiles also significantly improve lead quality." },
      { question: "Can you run campaigns for off-plan property launches?", answer: "Yes — we specialise in full-funnel off-plan launch campaigns covering pre-launch awareness, registration campaigns, EOI collection, and launch-day activation. We build the audience before the launch so interest converts to registrations from day one." },
      { question: "How do you reach international property investors?", answer: "We run targeted campaigns in key investor source markets — UK, India, Pakistan, Russia, France, Germany, and China — using translated ad content where appropriate, localised landing pages, and platform-specific targeting by nationality and market behaviour." },
      { question: "What is a realistic cost per qualified lead for UAE real estate?", answer: "In the UAE market, qualified property enquiries typically range from AED 150–600 depending on property type, location, and price point. Luxury and ultra-prime properties have higher costs per lead but dramatically higher deal values. We report cost per qualified lead (not just form fill) and optimise continuously to improve it." },
      { question: "Can you market both residential and commercial properties?", answer: "Yes — we build separate campaign strategies for residential and commercial portfolios. Commercial property buyers and tenants are typically reached on LinkedIn and through industry-specific search terms; residential campaigns focus on Google, Meta, and property portals." },
    ],
  },
  finance: {
    tagline: "Driving qualified leads for financial services brands through compliant digital marketing",
    stats: [
      { value: "180+", label: "Financial Services Clients", accent: "blue" },
      { value: "+290%", label: "Average Lead Growth", accent: "orange" },
      { value: "96%", label: "Client Retention Rate", accent: "green" },
      { value: "11 Yrs", label: "Financial Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Strict FCA & Regulatory Rules", desc: "Financial promotions must comply with FCA, DFSA, and SCA advertising regulations" },
      { title: "Trust & Credibility", desc: "Prospects need significant confidence before engaging a financial services provider" },
      { title: "Highly Competitive Keywords", desc: "Financial services terms rank among the most expensive in paid search" },
      { title: "Complex Audience Targeting", desc: "Reaching the right clients by net worth, investment horizon, and financial need" },
    ],
    solutions: [
      { title: "Compliant Financial Marketing", desc: "Ad creative and landing pages that meet all financial promotion regulations", icon: <ShieldIcon /> },
      { title: "Authority Content Strategy", desc: "Thought leadership content that builds credibility and nurtures long sales cycles", icon: <StarIcon /> },
      { title: "Smart Bidding PPC", desc: "Data-driven Google Ads campaigns that maximise ROI on competitive finance keywords", icon: <TrendIcon /> },
      { title: "High-Value Audience Targeting", desc: "Precise targeting reaching HNW individuals, business owners, and corporate clients", icon: <UsersIcon /> },
    ],
    services: [
      { title: "Financial Services SEO", description: "Rank for high-intent financial search terms and build organic authority", href: "/seo" },
      { title: "Finance PPC Campaigns", description: "Compliant Google Ads campaigns that generate qualified financial enquiries", href: "/google-adwords-management" },
      { title: "Content Marketing for Finance", description: "Educational content that builds trust and accelerates client decisions", href: "/content-marketing" },
      { title: "Financial Web Design", description: "Professional, trust-building websites for financial brands", href: "/web-design" },
    ],
    whyEddie: [
      { title: "Financial Regulatory Expertise", desc: "We understand FCA, DFSA, and regional financial promotion requirements" },
      { title: "Compliance-Led Creative", desc: "Every ad, landing page, and content piece is cleared against regulatory requirements" },
      { title: "High-Value Client Focus", desc: "We target qualified, high-intent prospects — not just lead volume" },
      { title: "Long-Term Client Nurturing", desc: "We build strategies for the long financial services sales cycle, not just quick wins" },
    ],
    process: [
      { number: "01", title: "Regulatory Audit", desc: "Review all existing marketing against FCA, DFSA, and SCA financial promotion requirements" },
      { number: "02", title: "Compliant Strategy", desc: "Build a regulatory-approved digital marketing strategy with compliance built in from the start" },
      { number: "03", title: "Campaign Launch", desc: "Deploy SEO, compliant PPC campaigns, and thought leadership content simultaneously" },
      { number: "04", title: "Nurture & Convert", desc: "Email nurturing sequences designed for the long financial services decision cycle" },
      { number: "05", title: "Report & Scale", desc: "Monthly compliance-verified reporting with lead quality attribution by channel and campaign" },
    ],
    faqs: [
      { question: "How do you ensure financial marketing is FCA/DFSA compliant?", answer: "Every ad, landing page, and content piece is reviewed against financial promotion requirements before publishing. We flag risk items, resolve them before launch, and maintain a compliance log for each campaign. No financial promotion goes live without explicit compliance sign-off from our team." },
      { question: "Can you run Google Ads for financial services?", answer: "Yes — we are experienced in navigating Google's financial services advertising policies and have successfully launched campaigns for investment firms, insurance providers, banking products, and wealth management services. We obtain necessary Google certifications and approvals where required." },
      { question: "How long does financial services content marketing take to generate leads?", answer: "Thought leadership content typically begins generating organic enquiries within 4–8 months. We supplement organic content with PPC campaigns for immediate lead flow while the content authority builds over time. The combination typically delivers 3–5x more leads than either channel alone." },
      { question: "Do you work with regulated financial businesses?", answer: "Yes — we regularly work with FCA-regulated firms, DFSA-licensed businesses, SCA-regulated entities, and insurance intermediaries across the UAE, UK, and broader GCC. All campaigns are structured to meet the relevant regulatory framework for your licence type." },
      { question: "How do you target high-net-worth individuals online?", answer: "We use a combination of LinkedIn targeting by job title and seniority, Google keyword targeting for premium financial search terms, and lookalike audiences built from your existing client profiles. Private banking and wealth management campaigns also use select financial publications for contextual display advertising." },
    ],
  },
  construction: {
    tagline: "Helping construction and contracting businesses win more projects through digital marketing",
    stats: [
      { value: "220+", label: "Construction Clients Served", accent: "blue" },
      { value: "+310%", label: "Average Lead Growth", accent: "orange" },
      { value: "AED 5B+", label: "Project Value Won by Clients", accent: "green" },
      { value: "10 Yrs", label: "Construction Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Project Lead Generation", desc: "Finding quality project leads against intense competition from established players" },
      { title: "B2B Decision-Maker Targeting", desc: "Reaching developers, project managers, and procurement teams — not consumers" },
      { title: "Long Sales Cycles", desc: "Construction deals take months to close — nurturing matters as much as lead generation" },
      { title: "Portfolio Showcase", desc: "Effectively showcasing project capabilities and past work to win new tenders" },
    ],
    solutions: [
      { title: "B2B Lead Generation", desc: "Targeted campaigns reaching developers, consultants, and procurement decision-makers", icon: <UsersIcon /> },
      { title: "LinkedIn & Google Campaigns", desc: "Multi-channel campaigns across LinkedIn, Google, and industry platforms", icon: <TrendIcon /> },
      { title: "Portfolio & Capability Marketing", desc: "Compelling portfolio showcases that demonstrate expertise and win confidence", icon: <StarIcon /> },
      { title: "Long-Cycle Nurturing", desc: "Email and retargeting strategies that keep your brand front-of-mind through long sales cycles", icon: <BoltIcon /> },
    ],
    services: [
      { title: "Construction SEO", description: "Rank for high-value project tender and contractor search terms", href: "/seo" },
      { title: "Google Ads for Contractors", description: "Targeted PPC campaigns reaching developers and procurement teams", href: "/google-adwords-management" },
      { title: "LinkedIn Marketing", description: "B2B campaigns reaching construction decision-makers on LinkedIn", href: "/social-media-marketing" },
      { title: "Construction Web Design", description: "Professional construction company websites that showcase your portfolio", href: "/web-design" },
    ],
    whyEddie: [
      { title: "Construction Sector Expertise", desc: "We understand the B2B buying process and decision-maker audience in construction" },
      { title: "B2B-First Strategy", desc: "Our campaigns target the right decision-makers, not consumer audiences" },
      { title: "Portfolio-Driven Marketing", desc: "We make your past projects your most powerful sales tool" },
      { title: "Long-Term Partnership Approach", desc: "We build ongoing strategies that support your project pipeline year-round" },
    ],
    process: [
      { number: "01", title: "Portfolio Audit", desc: "Assess your past project portfolio and identify your strongest capability showcases for marketing" },
      { number: "02", title: "B2B Strategy", desc: "Define your ideal project client profile and build a targeting approach around decision-maker roles" },
      { number: "03", title: "Campaign Launch", desc: "Deploy LinkedIn, Google, and SEO campaigns targeting developers and procurement teams" },
      { number: "04", title: "Lead Nurturing", desc: "Email and retargeting sequences to maintain visibility through the long construction sales cycle" },
      { number: "05", title: "Report & Scale", desc: "Monthly pipeline reporting tracking project enquiries, RFP submissions, and campaign ROI" },
    ],
    faqs: [
      { question: "How do you reach procurement managers and property developers online?", answer: "LinkedIn is our primary channel for reaching construction decision-makers by job title, company size, and industry vertical. We supplement this with Google search campaigns targeting project-specific queries and industry news platforms for display retargeting." },
      { question: "Can you help us win more project tenders through digital marketing?", answer: "Yes — we help construction businesses build the digital credibility and market visibility that puts you on the shortlist before RFPs are even issued. A strong portfolio website, active LinkedIn presence, and strong Google rankings all signal credibility to procurement teams during supplier research." },
      { question: "How do you showcase a construction company's past projects online?", answer: "We produce compelling portfolio content — professional photography, video walkthroughs, before-and-after comparisons, and written case studies with project metrics (size, value, timeline, challenge solved). This content performs across your website, LinkedIn, and Google Search." },
      { question: "How long does B2B construction marketing take to generate project enquiries?", answer: "Construction sales cycles typically run 3–12 months from initial enquiry to contract. We build a consistent enquiry pipeline so qualified project opportunities are flowing within 90 days of launch, even if those enquiries convert over a longer timeline." },
      { question: "Do you specialise in LinkedIn campaigns for construction companies?", answer: "Yes — LinkedIn is one of our highest-performing channels for construction B2B, reaching developers, project managers, quantity surveyors, and procurement directors. We run Sponsored Content, Message Ads, and Lead Gen Forms campaigns optimised for your specific project type and region." },
    ],
  },
  ecommerce: {
    tagline: "Driving revenue and customer acquisition for ecommerce and retail brands",
    stats: [
      { value: "350+", label: "Ecommerce Clients Served", accent: "blue" },
      { value: "+420%", label: "Average Revenue Growth", accent: "orange" },
      { value: "6.2x", label: "Average ROAS Achieved", accent: "green" },
      { value: "11 Yrs", label: "Ecommerce Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Rising Customer Acquisition Costs", desc: "Ad costs are increasing while margins stay flat — ROI is under constant pressure" },
      { title: "Cart Abandonment", desc: "The average ecommerce store loses over 70% of potential sales at checkout" },
      { title: "Marketplace Competition", desc: "Competing with Amazon, Noon, and large retailers for customer attention and sales" },
      { title: "Customer Retention", desc: "Acquiring customers once is expensive — retaining and re-activating them is the key to profitability" },
    ],
    solutions: [
      { title: "ROAS-Optimised Campaigns", desc: "Google Shopping and Meta campaigns engineered for maximum return on ad spend", icon: <TrendIcon /> },
      { title: "Cart Recovery Funnels", desc: "Automated email and retargeting flows that recover abandoned carts and lost revenue", icon: <BoltIcon /> },
      { title: "Full-Funnel Strategy", desc: "Awareness through retention — campaigns covering every stage of the customer journey", icon: <CheckIcon /> },
      { title: "Customer LTV Optimisation", desc: "Email marketing and loyalty campaigns that maximise lifetime customer value", icon: <StarIcon /> },
    ],
    services: [
      { title: "Ecommerce SEO", description: "Rank product and category pages for high-intent buying search terms", href: "/seo" },
      { title: "Google Shopping Campaigns", description: "Product listing campaigns that put your products in front of ready buyers", href: "/google-adwords-management" },
      { title: "Social Commerce", description: "Instagram and Facebook campaigns that drive direct product sales", href: "/social-media-marketing" },
      { title: "Email Marketing for Ecommerce", description: "Automated sequences that recover carts and grow customer lifetime value", href: "/email-marketing" },
    ],
    whyEddie: [
      { title: "Ecommerce Revenue Focus", desc: "We measure success in revenue and ROAS — not traffic and impressions" },
      { title: "Platform Expertise", desc: "Deep experience with Shopify, WooCommerce, Magento, and custom ecommerce platforms" },
      { title: "Full-Funnel Approach", desc: "We build strategies covering awareness, conversion, and retention" },
      { title: "UAE & GCC Market Knowledge", desc: "We understand local payment methods, logistics, and consumer behaviour" },
    ],
    process: [
      { number: "01", title: "Store Audit", desc: "Full audit of your store's SEO, ad accounts, email flows, and conversion rate against benchmarks" },
      { number: "02", title: "Revenue Strategy", desc: "Identify the highest-ROI channels and tactics for your category, margin profile, and seasonality" },
      { number: "03", title: "Campaign Activation", desc: "Launch Google Shopping, Meta, and email campaigns simultaneously for full-funnel coverage" },
      { number: "04", title: "Conversion Optimisation", desc: "Improve checkout flow, product page conversion, and cart abandonment recovery rates" },
      { number: "05", title: "Scale & Retain", desc: "Scale winning campaigns and build customer lifetime value through email, loyalty, and repeat purchase sequences" },
    ],
    faqs: [
      { question: "What is ROAS and what's a realistic benchmark for my store?", answer: "ROAS (Return on Ad Spend) measures revenue generated per unit of ad spend. Benchmarks vary significantly by product category and margin — but our ecommerce clients average 6.2x ROAS across Google Shopping and Meta campaigns. We set your specific ROAS target based on your margins and CPA requirements before launch." },
      { question: "How do you reduce cart abandonment rates?", answer: "We implement automated email and SMS abandonment sequences, retargeting ad campaigns, and on-site conversion optimisation (checkout flow, trust signals, shipping clarity). Typical cart recovery improvements of 15–35% within the first 90 days mean significant recovered revenue from an audience that had already decided to buy." },
      { question: "Can you manage both Google Shopping and Meta ads together?", answer: "Yes — we manage fully integrated Google Shopping, Performance Max, and Meta (Facebook and Instagram) campaigns from a single unified strategy. This ensures consistent messaging, shared audience data, and coordinated budget allocation based on where each channel performs best for your specific product." },
      { question: "How do you optimise product pages for SEO?", answer: "We optimise product titles, descriptions, and schema markup; build internal linking between related products and categories; create supporting category content targeting head-term keywords; and fix technical issues like duplicate content and canonicalisation. For large catalogues, we prioritise highest-revenue and highest-potential SKUs first." },
      { question: "Do you work with Shopify, WooCommerce, and other ecommerce platforms?", answer: "Yes — we work across Shopify, WooCommerce, Magento, BigCommerce, Salesforce Commerce Cloud, and custom ecommerce platforms. Our technical recommendations are adapted to the specific platform's capabilities and limitations." },
    ],
  },
  "home-services": {
    tagline: "Generating consistent local leads for home service and maintenance businesses",
    stats: [
      { value: "500+", label: "Home Service Clients Served", accent: "blue" },
      { value: "+260%", label: "Average Lead Growth", accent: "orange" },
      { value: "4.8/5", label: "Average Client Rating", accent: "green" },
      { value: "8 Yrs", label: "Home Services Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Local Competition", desc: "Home services markets are hyper-local and intensely competitive in every suburb" },
      { title: "Seasonal Demand Peaks", desc: "Managing enquiry flow and team capacity through seasonal demand spikes" },
      { title: "Trust & Credibility", desc: "Homeowners are inviting you into their homes — trust signals are critical" },
      { title: "Review Management", desc: "Online reviews directly determine whether a prospect calls you or your competitor" },
    ],
    solutions: [
      { title: "Local Search Domination", desc: "Google Business Profile and Local SEO strategies to dominate local search results", icon: <TrendIcon /> },
      { title: "Google Local Services Ads", desc: "Verified local ads that appear at the top of Google for your service area", icon: <BoltIcon /> },
      { title: "Trust-Building Campaigns", desc: "Review generation, testimonials, and credentials that build prospect confidence", icon: <ShieldIcon /> },
      { title: "Seasonal Campaign Management", desc: "Planned campaign adjustments to capture peak seasonal demand in advance", icon: <CheckIcon /> },
    ],
    services: [
      { title: "Local SEO", description: "Dominate local search results in your service area and suburbs", href: "/local-seo" },
      { title: "Google Ads for Home Services", description: "Local search campaigns that generate immediate phone calls and bookings", href: "/google-adwords-management" },
      { title: "Review Management", description: "Generate and manage online reviews to build trust and win more jobs", href: "/social-media-marketing" },
      { title: "Home Services Web Design", description: "Fast, mobile-optimised websites that convert local visitors into leads", href: "/web-design" },
    ],
    whyEddie: [
      { title: "Local Market Specialists", desc: "We understand the hyper-local competitive dynamics of home service markets" },
      { title: "Lead Quality Focus", desc: "We target homeowners with genuine intent, not casual browsers" },
      { title: "Review & Reputation Strategy", desc: "We help you build the review profile that makes you the obvious local choice" },
      { title: "Fast Campaign Activation", desc: "We can have your Google Local Services Ads running within 5 business days" },
    ],
    process: [
      { number: "01", title: "Local Audit", desc: "Analyse your Google Business Profile, local rankings, review profile, and competitor visibility" },
      { number: "02", title: "Local SEO Strategy", desc: "Optimise for local search intent across your service areas, suburbs, and service-specific keywords" },
      { number: "03", title: "Campaign Launch", desc: "Activate Google Local Services Ads and search campaigns for immediate local lead flow" },
      { number: "04", title: "Review Building", desc: "Implement systematic review generation to improve local trust signals and ranking factors" },
      { number: "05", title: "Report & Scale", desc: "Monthly local lead tracking with cost per booked job and seasonal performance comparisons" },
    ],
    faqs: [
      { question: "How do you generate local leads for a home services business?", answer: "We combine Google Local Services Ads (which appear above standard paid ads as 'Google Guaranteed'), local SEO for your suburb and service keywords, and Google Business Profile optimisation to dominate local search results. Most home service clients start receiving calls within the first week of campaign launch." },
      { question: "How important are online reviews for home services marketing?", answer: "Online reviews are critical — they directly influence both Google local search rankings and the conversion decision when a prospect is choosing between you and a competitor. We implement systematic, automated review generation via SMS and email follow-up to build your review profile consistently after every completed job." },
      { question: "How quickly can we expect new leads after launching?", answer: "Google Local Services Ads and Google Search campaigns typically start delivering calls within the first 3–7 days of launch. SEO improvements to local organic rankings build over 3–6 months. We recommend launching paid campaigns immediately for fast results while SEO compounds in the background." },
      { question: "Can you manage marketing across multiple service areas or suburbs?", answer: "Yes — we build geo-targeted campaigns for each suburb or service area, with distinct landing pages and ad sets for your highest-value locations. This ensures your ads appear to homeowners within your actual service radius, not wasted impressions outside your coverage area." },
      { question: "What's the most effective marketing channel for home services?", answer: "Google search (including Local Services Ads) dominates for emergency and high-intent services like plumbing, electrical, and HVAC — people search the moment they have a problem. For planned services like renovations and landscaping, we add Meta retargeting to stay visible during the longer consideration period." },
    ],
  },
  tech: {
    tagline: "Accelerating growth for SaaS and technology companies through precision B2B marketing",
    stats: [
      { value: "160+", label: "SaaS & Tech Clients Served", accent: "blue" },
      { value: "+390%", label: "Average Pipeline Growth", accent: "orange" },
      { value: "98%", label: "Client Retention Rate", accent: "green" },
      { value: "9 Yrs", label: "Tech Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Technical Audience Targeting", desc: "Reaching developers, CTOs, and technical decision-makers with relevant messaging" },
      { title: "Long B2B Sales Cycles", desc: "Enterprise software sales take months — consistent nurturing is essential" },
      { title: "Complex Product Communication", desc: "Making technical products understandable and compelling to business buyers" },
      { title: "Competitive SaaS Market", desc: "Standing out in a crowded market where every competitor claims to be the best" },
    ],
    solutions: [
      { title: "Technical Audience Campaigns", desc: "LinkedIn and Google campaigns targeting developers, engineers, and CTOs by role and seniority", icon: <UsersIcon /> },
      { title: "Demand Generation Strategy", desc: "Full-funnel content and ad strategies that build pipeline from awareness to demo", icon: <TrendIcon /> },
      { title: "Thought Leadership Content", desc: "Technical content, white papers, and case studies that build authority and trust", icon: <StarIcon /> },
      { title: "Product-Led Growth Campaigns", desc: "Free trial and freemium acquisition campaigns optimised for activation and upgrade", icon: <BoltIcon /> },
    ],
    services: [
      { title: "SaaS SEO", description: "Rank for high-intent software and solution search terms at scale", href: "/seo" },
      { title: "B2B Google Ads", description: "Targeted campaigns reaching technology decision-makers and buyers", href: "/google-adwords-management" },
      { title: "LinkedIn for Tech", description: "LinkedIn campaigns targeting CXO, VP, and technical decision-maker audiences", href: "/social-media-marketing" },
      { title: "Tech Content Marketing", description: "Technical content that builds authority and accelerates sales cycles", href: "/content-marketing" },
    ],
    whyEddie: [
      { title: "Tech Sector Expertise", desc: "We've marketed SaaS, enterprise software, and technology services across B2B markets" },
      { title: "Technical Communication Skills", desc: "We translate complex products into compelling, accessible marketing messages" },
      { title: "B2B Pipeline Focus", desc: "We measure success in qualified pipeline and MQLs, not just traffic" },
      { title: "Global & GCC Market Reach", desc: "We run campaigns across Europe, US, and GCC markets simultaneously" },
    ],
    process: [
      { number: "01", title: "Product Audit", desc: "Analyse your positioning, ICP definition, and current pipeline generation channels" },
      { number: "02", title: "GTM Strategy", desc: "Define your go-to-market approach by channel, audience segment, and funnel stage" },
      { number: "03", title: "Pipeline Activation", desc: "Launch LinkedIn, Google, and content campaigns targeting your ideal customer profile" },
      { number: "04", title: "Demo Nurturing", desc: "Conversion sequences moving trial users and demo prospects to paid subscriptions" },
      { number: "05", title: "Report & Scale", desc: "Monthly MQL, pipeline value, and CAC reporting with recommendations to scale winning channels" },
    ],
    faqs: [
      { question: "How do you generate qualified B2B SaaS leads online?", answer: "We combine LinkedIn campaigns targeting decision-makers by job title, seniority, and company size; Google Ads for high-intent software search terms; and content marketing to capture research-stage prospects. Each channel plays a different role in the funnel — we align budget to where each performs best for your specific ICP." },
      { question: "What's the best channel for SaaS free trial sign-ups?", answer: "It depends on your ICP and price point. LinkedIn works best for enterprise and mid-market B2B; Google captures intent-based search demand; content and SEO drive organic sign-up volume over time. We test multiple channels in parallel and scale based on activation rates and CAC, not just sign-up volume." },
      { question: "How do you market a complex technical product to non-technical buyers?", answer: "We translate technical features into business outcomes — what it achieves for the buyer, not how it works internally. Messaging is developed separately for economic buyers (CFO, CEO) and technical evaluators (CTO, engineers), with distinct value propositions, content, and channels for each audience." },
      { question: "Can you run account-based marketing (ABM) campaigns?", answer: "Yes — we build ABM programmes targeting named account lists on LinkedIn and Google, with personalised ad creative and landing pages matched to each account tier or vertical segment. ABM works particularly well for enterprise deals above AED 500K ARR where the investment per account is justified by deal size." },
      { question: "How do you reduce SaaS customer acquisition cost over time?", answer: "By investing in organic channels (SEO and content) that compound rather than switch off when budgets stop; building retargeting audiences from trial users to lower re-acquisition cost; and improving activation and conversion rates through lifecycle email sequences so existing trial traffic converts at a higher rate." },
    ],
  },
  education: {
    tagline: "Helping educational institutions attract students and grow enrolments",
    stats: [
      { value: "80+", label: "Education Institutions Served", accent: "blue" },
      { value: "+340%", label: "Average Enrolment Enquiry Growth", accent: "orange" },
      { value: "94%", label: "Client Retention Rate", accent: "green" },
      { value: "8 Yrs", label: "Education Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "International Student Recruitment", desc: "Reaching prospective students across multiple countries and language markets" },
      { title: "Brand Differentiation", desc: "Standing out in a market where every institution claims academic excellence" },
      { title: "Enrolment Cycle Timing", desc: "Reaching prospective students at exactly the right point in their decision journey" },
      { title: "ROI on Marketing Spend", desc: "Demonstrating clear returns on education marketing investment to institution leadership" },
    ],
    solutions: [
      { title: "International Recruitment Campaigns", desc: "Multi-market campaigns reaching prospective students across your target geographies", icon: <UsersIcon /> },
      { title: "Programme-Specific Landing Pages", desc: "High-converting landing pages for each programme that drive qualified applications", icon: <BoltIcon /> },
      { title: "Enrolment Cycle Campaigns", desc: "Seasonal campaign strategies timed to key application and decision periods", icon: <TrendIcon /> },
      { title: "Parent & Student Targeting", desc: "Separate campaigns reaching both student and parent audiences with relevant messaging", icon: <CheckIcon /> },
    ],
    services: [
      { title: "Education SEO", description: "Rank for programme and institution search terms in your target markets", href: "/seo" },
      { title: "Google Ads for Education", description: "Targeted campaigns generating qualified student enrolment enquiries", href: "/google-adwords-management" },
      { title: "Social Media for Education", description: "Instagram, Facebook, and YouTube campaigns showcasing your institution", href: "/social-media-marketing" },
      { title: "Education Web Design", description: "Modern, fast institution websites with clear enrolment conversion paths", href: "/web-design" },
    ],
    whyEddie: [
      { title: "Education Sector Expertise", desc: "We've supported universities, colleges, schools, and online learning platforms" },
      { title: "International Market Experience", desc: "We run student recruitment campaigns across Europe, GCC, South Asia, and Southeast Asia" },
      { title: "Enrolment-Focused Strategy", desc: "We measure success in enrolment enquiries and application starts, not just clicks" },
      { title: "Parent & Student Communication", desc: "We craft separate, resonant messaging for students and their parents simultaneously" },
    ],
    process: [
      { number: "01", title: "Institution Audit", desc: "Review your enrolment funnel, programme pages, and campaign history across all channels" },
      { number: "02", title: "Programme Strategy", desc: "Map each programme to a targeted student audience, channel mix, and enrolment cycle timeline" },
      { number: "03", title: "Campaign Launch", desc: "Deploy search, social, and content campaigns aligned to your upcoming enrolment deadlines" },
      { number: "04", title: "Application Nurturing", desc: "Email sequences moving prospective students from initial enquiry through to completed application" },
      { number: "05", title: "Report & Scale", desc: "Enrolment cycle tracking with enquiry-to-application conversion rates reported per programme" },
    ],
    faqs: [
      { question: "How do you attract international students online?", answer: "We run multi-market search and social campaigns in your target student geographies with localised ad copy and landing pages. We also leverage scholarship directories, course comparison platforms, and education-specific display networks to reach students in the research phase of their decision." },
      { question: "What's the best time to run student recruitment campaigns?", answer: "Campaign timing should align with your enrolment calendar — ideally 4–6 months before application deadlines for awareness and brand building, intensifying to conversion messaging 6–8 weeks before closing dates. We build a 12-month campaign calendar mapped to your intake cycles." },
      { question: "Do you target parents as well as students in your campaigns?", answer: "Yes — for secondary and undergraduate programmes especially, parents are often co-decision-makers. We run separate campaigns with different messaging for parents and students, as their concerns differ significantly: parents focus on outcomes, reputation, and value; students focus on experience, community, and career prospects." },
      { question: "How do you track enrolment applications back to specific marketing campaigns?", answer: "We implement UTM tracking across all campaigns and CRM integration (or your student information system) to trace every enquiry and application back to its originating campaign, channel, and keyword. This gives you clear marketing ROI by programme, market, and channel." },
      { question: "Can you market both online and on-campus programmes through the same campaigns?", answer: "Yes — but they require different targeting strategies. Online programmes can target students globally with location-independent messaging; campus programmes need localised campaigns targeting students within commuting or relocation distance, with messaging addressing campus life and local opportunities." },
    ],
  },
  nonprofit: {
    tagline: "Helping nonprofits raise awareness, attract donors, and grow community impact through digital marketing",
    stats: [
      { value: "80+", label: "Nonprofit Clients Served", accent: "blue" },
      { value: "+280%", label: "Average Donor Reach Growth", accent: "orange" },
      { value: "93%", label: "Client Retention Rate", accent: "green" },
      { value: "8 Yrs", label: "Nonprofit Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Limited Marketing Budgets", desc: "Nonprofits must maximise impact with restricted resources and justify every spend to trustees" },
      { title: "Donor Acquisition & Retention", desc: "Attracting new donors while keeping existing supporters engaged and giving" },
      { title: "Volunteer Recruitment", desc: "Reaching people who want to give their time and skills to your cause" },
      { title: "Impact Storytelling", desc: "Communicating mission and outcomes compellingly enough to inspire action and ongoing support" },
    ],
    solutions: [
      { title: "Google Ad Grants Management", desc: "Up to $10,000 per month in free Google Ads spend available to eligible nonprofits", icon: <TrendIcon /> },
      { title: "Donor Acquisition Campaigns", desc: "Targeted social and search campaigns reaching your most likely donors by interest and behaviour", icon: <UsersIcon /> },
      { title: "Impact-Driven Content", desc: "Stories, case studies, and video content that bring your mission to life and drive donations", icon: <StarIcon /> },
      { title: "Community Building", desc: "Social media and email strategies that build loyal communities of supporters and advocates", icon: <BoltIcon /> },
    ],
    services: [
      { title: "Nonprofit SEO", description: "Rank for cause-related and donation search terms to attract organic supporters", href: "/seo" },
      { title: "Google Ad Grants", description: "Maximise your free Google Ads budget to drive donations and volunteer sign-ups", href: "/google-adwords-management" },
      { title: "Social Media for Nonprofits", description: "Community-building campaigns that grow your supporter base and donor network", href: "/social-media-marketing" },
      { title: "Nonprofit Web Design", description: "Mission-first websites with clear donation paths and impact storytelling", href: "/web-design" },
    ],
    whyEddie: [
      { title: "Nonprofit Sector Experience", desc: "We understand the unique challenges of charity marketing including budget constraints and compliance" },
      { title: "Google Ad Grants Specialists", desc: "We help eligible nonprofits claim and maximise the full $10,000 monthly free ad credit" },
      { title: "Impact-First Strategy", desc: "Every campaign is built around your mission outcomes, not just traffic metrics" },
      { title: "Donor Journey Focus", desc: "We build journeys from first awareness through to loyal, recurring donor relationships" },
    ],
    process: [
      { number: "01", title: "Mission Audit", desc: "Review your current digital presence, donor journey, and impact communication across all channels" },
      { number: "02", title: "Donor Strategy", desc: "Define your ideal supporter profile and build a channel mix around cost-effective acquisition" },
      { number: "03", title: "Campaign Launch", desc: "Activate Google Ad Grants, social campaigns, and SEO simultaneously for full-channel presence" },
      { number: "04", title: "Donor Nurturing", desc: "Email and social sequences that convert one-time donors into loyal recurring supporters" },
      { number: "05", title: "Report & Scale", desc: "Monthly impact reporting tracking donation value, volunteer sign-ups, and cost per supporter acquired" },
    ],
    faqs: [
      { question: "Is my nonprofit eligible for Google Ad Grants?", answer: "Most registered charities and nonprofits are eligible for Google Ad Grants, which provides up to $10,000 per month in free Google Search advertising. Eligibility requires Google for Nonprofits registration, which we help you obtain. Government entities, hospitals, and schools are generally excluded but may have alternative options." },
      { question: "How do you help nonprofits attract more donors online?", answer: "We combine Google Ad Grants for high-intent donation searches, Meta campaigns targeting lookalike audiences based on your existing donor base, and content marketing that demonstrates your mission impact. Each channel targets a different stage of the donor journey from awareness through to first gift and recurring donation." },
      { question: "Can digital marketing help with volunteer recruitment?", answer: "Yes — we run dedicated volunteer recruitment campaigns on Facebook and Instagram targeting local audiences by interest and cause alignment. Landing pages are optimised for volunteer sign-up conversion, and follow-up email sequences keep prospective volunteers engaged until they take action." },
      { question: "How do you measure the ROI of nonprofit marketing?", answer: "We track donations directly attributed to each campaign channel, volunteer sign-ups, and community growth metrics (email subscribers, social followers, event registrations). All reporting is structured to help you demonstrate marketing effectiveness to trustees and grant funders." },
      { question: "Do you work with international charities and foundations?", answer: "Yes — we support nonprofits and foundations operating locally, regionally, and internationally. For organisations with multilingual audiences, we develop localised campaign assets and landing pages in the required languages to maximise relevance and conversion across each market." },
    ],
  },
  faith: {
    tagline: "Connecting mosques, temples, and faith communities with their congregation through digital outreach",
    stats: [
      { value: "60+", label: "Faith Communities Served", accent: "blue" },
      { value: "+340%", label: "Average Congregation Reach", accent: "orange" },
      { value: "4.9/5", label: "Average Client Rating", accent: "green" },
      { value: "7 Yrs", label: "Faith Community Marketing Experience", accent: "blue" },
    ],
    challenges: [
      { title: "Congregation Engagement", desc: "Keeping community members informed, engaged, and connected in a fragmented digital landscape" },
      { title: "Event Promotion", desc: "Effectively promoting prayers, events, classes, and fundraisers to the wider community" },
      { title: "Multilingual Outreach", desc: "Reaching congregation members across multiple languages and cultural backgrounds" },
      { title: "Digital Literacy", desc: "Adopting digital tools that committee members can manage with confidence after launch" },
    ],
    solutions: [
      { title: "Community Social Media Management", desc: "Facebook, Instagram, and WhatsApp strategies that keep your congregation connected and informed", icon: <UsersIcon /> },
      { title: "Event Promotion Campaigns", desc: "Targeted local campaigns promoting prayers, Ramadan programmes, fundraisers, and community events", icon: <BoltIcon /> },
      { title: "Multilingual Content", desc: "Arabic, Urdu, Tamil, and English content creation to reach all segments of your congregation", icon: <StarIcon /> },
      { title: "Local SEO & Google Profile", desc: "Optimised Google Business Profile and local search rankings so your community can find you easily", icon: <TrendIcon /> },
    ],
    services: [
      { title: "Local SEO for Faith Organisations", description: "Rank prominently when community members search for your services in the local area", href: "/local-seo" },
      { title: "Social Media Management", description: "Regular, engaging content keeping your congregation informed and connected online", href: "/social-media-marketing" },
      { title: "Faith Community Web Design", description: "Welcoming, accessible websites with prayer times, event calendars, and donation integration", href: "/web-design" },
      { title: "Email & Community Newsletters", description: "Regular digital newsletters keeping your community informed about events and programmes", href: "/email-marketing" },
    ],
    whyEddie: [
      { title: "Culturally Sensitive Approach", desc: "We understand the values, sensitivities, and communication needs of faith communities" },
      { title: "Multilingual Capability", desc: "We produce content in Arabic, Urdu, Tamil, and other languages to reach your full congregation" },
      { title: "Community-First Strategy", desc: "Our campaigns prioritise genuine community connection over commercial metrics" },
      { title: "Simple, Manageable Systems", desc: "We build digital tools and workflows your committee can manage confidently day to day" },
    ],
    process: [
      { number: "01", title: "Community Audit", desc: "Understand your congregation profile, current digital presence, and key communication needs" },
      { number: "02", title: "Channel Strategy", desc: "Select the right platforms and content formats for your community's age profile and preferences" },
      { number: "03", title: "Presence Launch", desc: "Set up and optimise your website, Google profile, and social channels consistently" },
      { number: "04", title: "Content Programme", desc: "Establish a regular content calendar covering events, programmes, and community stories" },
      { number: "05", title: "Report & Grow", desc: "Monthly reach and engagement reporting showing congregation growth across all digital channels" },
    ],
    faqs: [
      { question: "How can a mosque or temple use digital marketing to grow its congregation?", answer: "Digital presence helps faith communities reach new residents, reconnect with lapsed members, and promote events to a wider audience. We focus on local SEO so your venue appears in searches, social media to keep your community engaged, and event promotion campaigns for key dates like Ramadan, Eid, Diwali, and religious festivals." },
      { question: "Do you create content in Arabic and Urdu?", answer: "Yes — we produce community content in Arabic, Urdu, Tamil, Hindi, and English depending on your congregation's language profile. Multilingual content significantly increases engagement among community members whose first language is not English, and is particularly important for social media and email newsletters." },
      { question: "Can you help promote fundraising campaigns for a mosque or temple?", answer: "Yes — we run targeted social media and Google campaigns for Zakat, Sadaqah, building fund drives, and other fundraising appeals. Campaigns are designed with cultural sensitivity and targeted to reach both regular congregation members and the wider Muslim or Hindu community in your local area." },
      { question: "How do we make it easier for community members to find prayer times and events?", answer: "We build or optimise your website with clear prayer time displays, event calendars, and location information. Your Google Business Profile is also set up with accurate opening times, directions, and photos so new community members can easily find and connect with your centre." },
      { question: "Can you manage our social media consistently without us doing the work?", answer: "Yes — we offer fully managed social media services where we handle content creation, scheduling, and community responses on your behalf. You approve content before it is published via a simple review process, and we handle the day-to-day management so your committee can focus on community work." },
    ],
  },
};

const DEFAULT_DATA: IndustryData = {
  tagline: "Data-driven digital marketing that delivers measurable business growth",
  stats: [
    { value: "1,000+", label: "Clients Served", accent: "blue" },
    { value: "+320%", label: "Average Traffic Growth", accent: "orange" },
    { value: "96%", label: "Client Retention Rate", accent: "green" },
    { value: "12 Yrs", label: "Industry Experience", accent: "blue" },
  ],
  challenges: [
    { title: "Cutting Through Digital Noise", desc: "Standing out in a crowded market where every competitor is also investing in digital marketing" },
    { title: "Proving Marketing ROI", desc: "Connecting digital marketing activity to real business outcomes and revenue growth" },
    { title: "Keeping Up With Platform Changes", desc: "Google, Meta, and other platforms change their algorithms constantly — strategy must adapt" },
    { title: "Finding Quality Leads", desc: "Volume without quality is wasted spend — finding the right prospects matters most" },
  ],
  solutions: [
    { title: "Differentiated Brand Strategy", desc: "Positioning and messaging that clearly separates your brand from the competition", icon: <StarIcon /> },
    { title: "ROI-Linked Reporting", desc: "Every campaign is tracked back to business outcomes — leads, sales, and revenue", icon: <TrendIcon /> },
    { title: "Adaptive Campaign Management", desc: "Weekly optimisation and platform monitoring keeps your campaigns ahead of changes", icon: <BoltIcon /> },
    { title: "Quality Lead Targeting", desc: "Precise audience targeting to reach only your most valuable potential customers", icon: <UsersIcon /> },
  ],
  services: [
    { title: "SEO", description: "Rank for high-value search terms and build lasting organic visibility", href: "/seo" },
    { title: "Google Ads", description: "Targeted PPC campaigns delivering qualified leads and measurable ROI", href: "/google-adwords-management" },
    { title: "Social Media Marketing", description: "Engaging campaigns across all major social platforms", href: "/social-media-marketing" },
    { title: "Content Marketing", description: "Strategic content that builds authority and drives organic growth", href: "/content-marketing" },
  ],
  whyEddie: [
    { title: "Full-Service Expertise", desc: "SEO, paid media, social, content, web design — everything under one roof" },
    { title: "Results-First Approach", desc: "We focus on the metrics that matter to your business, not vanity numbers" },
    { title: "Senior Team Access", desc: "Your account is managed by senior strategists, not juniors reading from playbooks" },
    { title: "UAE & GCC Market Knowledge", desc: "Deep understanding of consumer behaviour and market dynamics in the region" },
  ],
  process: [
    { number: "01", title: "Discovery", desc: "We learn your business, goals, target audience, and competitive landscape in detail" },
    { number: "02", title: "Strategy", desc: "We develop a customised, data-backed strategy targeting your highest-value opportunities" },
    { number: "03", title: "Launch", desc: "We implement the strategy with precision — campaigns live within 2 weeks of sign-off" },
    { number: "04", title: "Optimise", desc: "We continuously test, refine, and improve based on real performance data weekly" },
    { number: "05", title: "Scale", desc: "We scale what's working, compound your results, and report full ROI monthly" },
  ],
  faqs: [
    { question: "How long before we see results from digital marketing?", answer: "PPC campaigns typically show results within 2–4 weeks. SEO takes 3–6 months for meaningful ranking improvements, with compounding growth over 12+ months. We provide a clear timeline for each channel in your strategy so you know exactly what to expect and when." },
    { question: "What's the minimum engagement period?", answer: "Our engagements are structured around 6-month strategies — the minimum time needed to properly build, optimise, and demonstrate clear ROI. Many clients work with us for years as they scale. We provide a full strategy, channel plan, and projected KPIs before you sign anything." },
    { question: "Do you work with businesses outside the UAE?", answer: "Yes — while we specialise in UAE and GCC markets, we run campaigns for clients in the UK, US, Europe, and globally. Our team includes specialists with regional expertise across all major markets." },
    { question: "How transparent is your reporting?", answer: "Completely transparent — you receive a full monthly report covering every channel's performance against agreed KPIs, and your live dashboard is accessible 24/7. We don't hide data behind agency jargon; you always know exactly what your investment is returning." },
    { question: "What makes Eddie different from other digital marketing agencies?", answer: "Our clients work directly with senior specialists — the strategist who presents your plan is the one managing your campaigns. We combine full-service capability (SEO, PPC, social, content, web) with the strategic focus of a boutique specialist, without the overhead of a large agency." },
  ],
};

// ─── Helper icon for challenge items ─────────────────────────────────────────

function ChallengeIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

// ─── Case Study Card ──────────────────────────────────────────────────────────

interface CaseStudyCardData {
  slug: string;
  title: string;
  clientName: string | null;
  serviceType: string | null;
  trafficIncreasePercent: number | null;
  leadIncreasePercent?: number | null;
}

function CaseStudyCard({ cs }: { cs: CaseStudyCardData }) {
  return (
    <Link
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
        {cs.clientName}
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
        View case study →
      </span>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface IndustryPageSectionsProps {
  industrySlug: string;
  industryName: string;
  caseStudies: CaseStudyCardData[];
}

export function IndustryPageSections({
  industrySlug,
  industryName,
  caseStudies,
}: IndustryPageSectionsProps) {
  const data = INDUSTRY_DATA[industrySlug] ?? DEFAULT_DATA;

  return (
    <>
      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2 text-center">
            {industryName} Marketing Results
          </p>
          <p className="text-center text-sm text-slate-500 mb-8 max-w-xl mx-auto">
            {data.tagline}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((stat, i) => (
              <StatCard
                key={i}
                value={stat.value}
                label={stat.label}
                accent={stat.accent}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Core Services ─────────────────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
              What We Do
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              {industryName} Marketing Services
            </h2>
            <p className="text-slate-500 leading-relaxed">
              Specialist digital marketing services designed for the unique challenges and opportunities of your sector.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.services.map((svc, i) => (
              <ServiceCard
                key={i}
                title={svc.title}
                description={svc.description}
                href={svc.href}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Challenges & Solutions ────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Challenges */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
                The Problem
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">
                {industryName} Marketing Challenges
              </h2>
              <div className="space-y-5">
                {data.challenges.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <ChallengeIcon />
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-0.5">{c.title}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                Our Approach
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">
                How Eddie Solves Them
              </h2>
              <div className="space-y-4">
                {data.solutions.map((s, i) => (
                  <div key={i} className="flex gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="w-8 h-8 ems-gradient-bg rounded-lg flex items-center justify-center shrink-0 text-white mt-0.5">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{s.title}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Why Choose Eddie ──────────────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
              Why Work With Us
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Why {industryName} Businesses Choose Eddie
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.whyEddie.map((item, i) => (
              <FeatureCard
                key={i}
                title={item.title}
                description={item.desc}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Marketing Process ─────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
              How It Works
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Our {industryName} Marketing Process
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
              A structured, proven approach to building your {industryName.toLowerCase()} marketing engine from audit to scale.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.process.map((step, i) => (
              <div key={i} className="relative">
                {i < data.process.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-blue-100 z-0" style={{ width: "calc(100% - 1.5rem)" }} />
                )}
                <div className="bg-white border border-slate-200 rounded-xl p-5 relative z-10 h-full hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="text-2xl font-black text-blue-600 mb-3 font-mono">{step.number}</div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Case Studies ──────────────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <div className="bg-white py-14 md:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
                  Success Stories
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {industryName} Marketing Results
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                All case studies →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {caseStudies.slice(0, 3).map((cs) => (
                <CaseStudyCard key={cs.slug} cs={cs} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <FaqAccordion
        items={data.faqs}
        eyebrow={`${industryName} Marketing`}
        title={`${industryName} Marketing FAQs`}
      />

      {/* ── Resource Library ──────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                Related Resources
              </p>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Related {industryName} Resources
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                Explore our guides and services most relevant to {industryName.toLowerCase()} businesses.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.services.map((svc, i) => (
              <Link
                key={i}
                href={svc.href}
                className="group flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                    {svc.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">{svc.description}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
