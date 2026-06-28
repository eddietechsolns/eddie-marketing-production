// ─── Content Gap Engine ───────────────────────────────────────────────────────
// Pure deterministic logic — no external APIs, no DB calls.
// DB queries live in the page; this file receives arrays and returns analysis.

import { TOOLS } from "@/lib/tools-data";
import { ACADEMY_CATEGORIES } from "@/lib/academy-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClusterType = "service" | "industry" | "location" | "special";
export type ContentType = "blog" | "case-study" | "portfolio" | "tool" | "academy";
export type CoverageStatus = "strong" | "moderate" | "weak" | "critical";

export interface RecommendationDef {
  contentType: ContentType;
  title: string;
  slug: string;
  supportingPage: string;
  reason: string;
  difficulty: number; // 1 (easy) – 10 (hard)
}

export interface ClusterDef {
  id: string;
  name: string;
  type: ClusterType;
  color: string;
  keywords: string[];          // match against BlogPost.title (lowercase)
  serviceTypes: string[];      // match against CaseStudy.serviceType (lowercase)
  industryMatch: string[];     // match against CaseStudy.industry (lowercase)
  portfolioKeywords: string[]; // match against PortfolioProject.title + services[]
  toolCategory: string | null; // match Tool.category
  academySlug: string | null;  // match AcademyCategory.slug
  commercialValue: number;     // 1–10
  leadGenPotential: number;    // 1–10
  recommendations: RecommendationDef[];
}

export interface ClusterCoverage {
  cluster: ClusterDef;
  blogCount: number;
  caseStudyCount: number;
  portfolioCount: number;
  toolCount: number;
  academyCount: number;
  coverageScore: number;
  status: CoverageStatus;
}

export interface ScoredRecommendation extends RecommendationDef {
  clusterId: string;
  clusterName: string;
  clusterType: ClusterType;
  coverageScore: number;
  priorityScore: number;
  commercialValue: number;
}

// ─── Cluster definitions ──────────────────────────────────────────────────────

export const CLUSTERS: ClusterDef[] = [
  // ── Services ────────────────────────────────────────────────────────────────
  {
    id: "seo",
    name: "SEO",
    type: "service",
    color: "blue",
    keywords: ["seo", "search engine", "keyword ranking", "backlink", "on-page", "off-page", "technical seo", "organic traffic", "serp", "link building"],
    serviceTypes: ["seo", "search engine optimization", "organic"],
    industryMatch: [],
    portfolioKeywords: ["seo", "search engine"],
    toolCategory: "SEO",
    academySlug: "seo-guides",
    commercialValue: 10,
    leadGenPotential: 10,
    recommendations: [
      { contentType: "blog", title: "SEO for UAE Businesses: Complete 2025 Guide", slug: "seo-guide-uae-businesses-2025", supportingPage: "/services/seo", reason: "High-volume pillar page candidate for the UAE SEO cluster", difficulty: 3 },
      { contentType: "blog", title: "Technical SEO Checklist for Dubai Websites", slug: "technical-seo-checklist-dubai-websites", supportingPage: "/services/seo", reason: "Targets technical SEO searches from UAE webmasters", difficulty: 3 },
      { contentType: "blog", title: "How Long Does SEO Take? UAE Timeline Guide", slug: "how-long-does-seo-take-uae", supportingPage: "/services/seo", reason: "High-intent FAQ from UAE business owners evaluating SEO", difficulty: 2 },
      { contentType: "blog", title: "Local SEO vs National SEO: What's Right for Your UAE Business?", slug: "local-seo-vs-national-seo-uae", supportingPage: "/services/seo", reason: "Decision-stage keyword with high conversion intent", difficulty: 3 },
      { contentType: "case-study", title: "How We Grew Organic Traffic 340% for a Dubai Retailer", slug: "seo-dubai-retailer-case-study", supportingPage: "/case-studies", reason: "Proof point for SEO services page — missing industry-specific evidence", difficulty: 6 },
    ],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    type: "service",
    color: "orange",
    keywords: ["google ads", "ppc", "pay per click", "adwords", "paid search", "google advertising", "search ads", "display ads", "google ad"],
    serviceTypes: ["google ads", "ppc", "paid search", "sem"],
    industryMatch: [],
    portfolioKeywords: ["google ads", "ppc", "paid"],
    toolCategory: "Google Ads",
    academySlug: "google-ads-guides",
    commercialValue: 10,
    leadGenPotential: 10,
    recommendations: [
      { contentType: "blog", title: "Google Ads for UAE Businesses: 2025 Beginner Guide", slug: "google-ads-beginners-guide-uae", supportingPage: "/services/google-ads", reason: "Captures top-of-funnel searches from UAE businesses starting with paid ads", difficulty: 2 },
      { contentType: "blog", title: "How Much Does Google Ads Cost in the UAE?", slug: "google-ads-cost-uae", supportingPage: "/services/google-ads", reason: "Extremely high-intent FAQ — prospects researching budget before buying", difficulty: 2 },
      { contentType: "blog", title: "Google Ads vs Facebook Ads for UAE Businesses", slug: "google-ads-vs-facebook-ads-uae", supportingPage: "/services/google-ads", reason: "Comparison keyword with strong commercial intent", difficulty: 3 },
      { contentType: "blog", title: "Google Ads Quality Score: How to Improve It (UAE Guide)", slug: "google-ads-quality-score-guide-uae", supportingPage: "/services/google-ads", reason: "Long-tail keyword with high relevance to managed-service buyers", difficulty: 4 },
      { contentType: "case-study", title: "Google Ads Scale-Up: 4.2× ROAS for UAE E-Commerce", slug: "google-ads-ecommerce-uae-roas-case-study", supportingPage: "/case-studies", reason: "ROAS-focused proof point for the Ads services page", difficulty: 6 },
    ],
  },
  {
    id: "social-media",
    name: "Social Media",
    type: "service",
    color: "purple",
    keywords: ["social media", "instagram", "facebook", "tiktok", "linkedin", "twitter", "snapchat", "social advertising", "social marketing"],
    serviceTypes: ["social media", "social", "instagram", "facebook"],
    industryMatch: [],
    portfolioKeywords: ["social media", "instagram", "facebook"],
    toolCategory: "Social Media",
    academySlug: "social-media-guides",
    commercialValue: 8,
    leadGenPotential: 8,
    recommendations: [
      { contentType: "blog", title: "Social Media Marketing in the UAE: Platform Guide 2025", slug: "social-media-marketing-uae-platforms-2025", supportingPage: "/services/social-media", reason: "Comprehensive cluster anchor for UAE social media content", difficulty: 3 },
      { contentType: "blog", title: "Instagram Marketing for UAE Businesses: Step-by-Step", slug: "instagram-marketing-uae-businesses", supportingPage: "/services/social-media", reason: "Instagram is the #1 social platform for UAE consumers", difficulty: 2 },
      { contentType: "blog", title: "LinkedIn Marketing for B2B in the UAE: 2025 Playbook", slug: "linkedin-marketing-b2b-uae", supportingPage: "/services/social-media", reason: "UAE has one of the highest LinkedIn penetration rates globally", difficulty: 3 },
      { contentType: "blog", title: "TikTok Advertising for UAE Brands: Beginner's Guide", slug: "tiktok-advertising-uae-brands", supportingPage: "/services/social-media", reason: "Rapidly growing channel — high search intent from SMEs", difficulty: 3 },
      { contentType: "case-study", title: "Instagram Growth: From 8K to 85K Followers in 90 Days", slug: "instagram-growth-uae-fashion-case-study", supportingPage: "/case-studies", reason: "Social proof for social media services — follower growth resonates with buyers", difficulty: 6 },
    ],
  },
  {
    id: "web-design",
    name: "Web Design",
    type: "service",
    color: "teal",
    keywords: ["web design", "website design", "web development", "wordpress", "website", "landing page", "responsive design", "website redesign"],
    serviceTypes: ["web design", "website design", "web development", "development"],
    industryMatch: [],
    portfolioKeywords: ["web design", "website", "design", "development"],
    toolCategory: "Website Development",
    academySlug: "web-design-guides",
    commercialValue: 9,
    leadGenPotential: 9,
    recommendations: [
      { contentType: "blog", title: "Website Design Cost in the UAE: 2025 Price Guide", slug: "website-design-cost-uae-2025", supportingPage: "/services/web-design", reason: "High-intent keyword from buyers comparing agencies", difficulty: 2 },
      { contentType: "blog", title: "How to Choose a Web Design Agency in Dubai", slug: "how-to-choose-web-design-agency-dubai", supportingPage: "/services/web-design", reason: "Decision-stage content targeting agency selection queries", difficulty: 3 },
      { contentType: "blog", title: "E-Commerce Website Design UAE: WooCommerce vs Shopify", slug: "ecommerce-website-design-uae-woocommerce-shopify", supportingPage: "/services/web-design", reason: "Captures platform comparison searches from UAE store owners", difficulty: 4 },
      { contentType: "blog", title: "Landing Page Best Practices for UAE Businesses", slug: "landing-page-best-practices-uae", supportingPage: "/services/web-design", reason: "Supports both web design and Google Ads clusters", difficulty: 3 },
      { contentType: "portfolio", title: "B2B SaaS Website Redesign — Dubai Tech Company", slug: "b2b-saas-website-redesign-dubai", supportingPage: "/portfolio", reason: "Missing tech-sector portfolio proof for web design buyers", difficulty: 7 },
    ],
  },
  {
    id: "content-marketing",
    name: "Content Marketing",
    type: "service",
    color: "green",
    keywords: ["content marketing", "blog writing", "copywriting", "content strategy", "content creation", "blogging", "seo content", "article"],
    serviceTypes: ["content marketing", "content", "blogging", "copywriting"],
    industryMatch: [],
    portfolioKeywords: ["content", "blogging", "copywriting"],
    toolCategory: "Content Marketing",
    academySlug: "content-marketing-guides",
    commercialValue: 7,
    leadGenPotential: 7,
    recommendations: [
      { contentType: "blog", title: "Content Marketing for UAE Businesses: 2025 Strategy Guide", slug: "content-marketing-uae-businesses-guide", supportingPage: "/services/content-marketing", reason: "Cluster anchor page for UAE content marketing searches", difficulty: 3 },
      { contentType: "blog", title: "How to Create a Content Calendar for UAE Businesses", slug: "content-calendar-uae-businesses", supportingPage: "/services/content-marketing", reason: "Tactical keyword with high search volume from SME decision-makers", difficulty: 2 },
      { contentType: "blog", title: "Blog SEO: How to Rank Your Business Blog in the UAE", slug: "blog-seo-rank-uae-business", supportingPage: "/services/content-marketing", reason: "Bridges content marketing and SEO clusters", difficulty: 3 },
      { contentType: "blog", title: "Arabic Content Marketing for UAE Businesses", slug: "arabic-content-marketing-uae", supportingPage: "/services/content-marketing", reason: "Unique UAE angle — Arabic audience is underserved in agency blogs", difficulty: 4 },
    ],
  },
  {
    id: "email-marketing",
    name: "Email Marketing",
    type: "service",
    color: "rose",
    keywords: ["email marketing", "email campaign", "email automation", "newsletter", "email list", "drip campaign", "mailchimp", "klaviyo"],
    serviceTypes: ["email marketing", "email", "newsletter"],
    industryMatch: [],
    portfolioKeywords: ["email", "newsletter"],
    toolCategory: "Email Marketing",
    academySlug: null,
    commercialValue: 7,
    leadGenPotential: 7,
    recommendations: [
      { contentType: "blog", title: "Email Marketing for UAE Businesses: Complete Guide", slug: "email-marketing-uae-businesses-guide", supportingPage: "/services/email-marketing", reason: "Cluster anchor — email marketing is underrepresented on the site", difficulty: 2 },
      { contentType: "blog", title: "Email Automation for E-Commerce Brands in the UAE", slug: "email-automation-ecommerce-uae", supportingPage: "/services/email-marketing", reason: "High commercial value — e-commerce email automation has strong ROI proof", difficulty: 3 },
      { contentType: "blog", title: "Email Segmentation Strategy: A Guide for UAE Marketers", slug: "email-segmentation-strategy-uae", supportingPage: "/services/email-marketing", reason: "Practical guide that builds authority before a sales conversation", difficulty: 3 },
      { contentType: "blog", title: "Welcome Email Sequence Guide: Best Practices for UAE Brands", slug: "welcome-email-sequence-guide-uae", supportingPage: "/services/email-marketing", reason: "Tactical content that attracts business owners who run email themselves", difficulty: 2 },
      { contentType: "blog", title: "Klaviyo vs Mailchimp for UAE E-Commerce: 2025 Comparison", slug: "klaviyo-vs-mailchimp-uae-ecommerce", supportingPage: "/services/email-marketing", reason: "High-intent comparison keyword — buyers who've narrowed their tool selection", difficulty: 3 },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    type: "service",
    color: "indigo",
    keywords: ["analytics", "ga4", "google analytics", "tracking", "utm", "attribution", "reporting", "dashboard", "data"],
    serviceTypes: ["analytics", "tracking", "reporting"],
    industryMatch: [],
    portfolioKeywords: ["analytics", "reporting", "data"],
    toolCategory: "Analytics",
    academySlug: "analytics-guides",
    commercialValue: 7,
    leadGenPotential: 6,
    recommendations: [
      { contentType: "blog", title: "GA4 Setup for UAE Businesses: Step-by-Step Guide", slug: "ga4-setup-guide-uae-businesses", supportingPage: "/services/analytics", reason: "GA4 migration created massive demand — UAE businesses still setting up", difficulty: 3 },
      { contentType: "blog", title: "UTM Tracking Guide for UAE Marketers", slug: "utm-tracking-guide-uae-marketers", supportingPage: "/services/analytics", reason: "Pairs naturally with the UTM Builder tool — strong internal linking opportunity", difficulty: 2 },
      { contentType: "blog", title: "Marketing Attribution Models: Which is Right for UAE Businesses?", slug: "marketing-attribution-models-uae", supportingPage: "/services/analytics", reason: "Decision-stage content for analytics buyers comparing attribution approaches", difficulty: 4 },
      { contentType: "blog", title: "Marketing Dashboard Reporting Best Practices", slug: "marketing-dashboard-reporting-best-practices", supportingPage: "/services/analytics", reason: "Positions the agency as analytics experts — supports retention conversations", difficulty: 3 },
    ],
  },
  {
    id: "local-seo",
    name: "Local SEO",
    type: "service",
    color: "amber",
    keywords: ["local seo", "google business profile", "google my business", "gmb", "local search", "maps ranking", "local listing", "near me"],
    serviceTypes: ["local seo", "local search", "gmb"],
    industryMatch: [],
    portfolioKeywords: ["local", "maps", "google business"],
    toolCategory: null,
    academySlug: "local-seo-guides",
    commercialValue: 9,
    leadGenPotential: 9,
    recommendations: [
      { contentType: "blog", title: "Local SEO for UAE Businesses: 2025 Complete Guide", slug: "local-seo-uae-businesses-2025", supportingPage: "/services/seo", reason: "High commercial intent from UAE businesses targeting local customers", difficulty: 2 },
      { contentType: "blog", title: "Google Business Profile Optimisation for Dubai Businesses", slug: "google-business-profile-optimisation-dubai", supportingPage: "/locations/dubai", reason: "Location-specific content that bridges Local SEO and Dubai location cluster", difficulty: 2 },
      { contentType: "blog", title: "How to Rank in Google Maps in the UAE", slug: "rank-google-maps-uae", supportingPage: "/services/seo", reason: "Maps ranking is the #1 goal for UAE SME local search queries", difficulty: 3 },
      { contentType: "blog", title: "NAP Consistency: Why It Matters for UAE Local SEO", slug: "nap-consistency-uae-local-seo", supportingPage: "/services/seo", reason: "Tactical guide — builds trust with business owners managing their own listings", difficulty: 2 },
    ],
  },

  // ── Industries ───────────────────────────────────────────────────────────────
  {
    id: "healthcare",
    name: "Healthcare",
    type: "industry",
    color: "red",
    keywords: ["healthcare", "medical", "hospital", "clinic", "dental", "doctor", "health", "pharma", "wellness"],
    serviceTypes: [],
    industryMatch: ["healthcare", "medical", "health", "clinic", "dental", "hospital"],
    portfolioKeywords: ["healthcare", "medical", "clinic", "hospital"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 9,
    leadGenPotential: 9,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing for Healthcare Clinics in the UAE", slug: "digital-marketing-healthcare-clinics-uae", supportingPage: "/industries/healthcare", reason: "Healthcare is the top-revenue industry vertical — needs content anchor", difficulty: 3 },
      { contentType: "blog", title: "Google Ads for Medical Clinics UAE: What Works in 2025", slug: "google-ads-medical-clinics-uae", supportingPage: "/industries/healthcare", reason: "Medical Google Ads is a high-CPC, high-intent segment", difficulty: 4 },
      { contentType: "blog", title: "SEO for Dental Clinics in Dubai: Local Search Guide", slug: "seo-dental-clinics-dubai", supportingPage: "/industries/healthcare", reason: "Dental is the most searched healthcare vertical in the UAE", difficulty: 3 },
      { contentType: "case-study", title: "How We Reduced CPL by 65% for a UAE Healthcare Group", slug: "healthcare-clinic-cpl-reduction-uae", supportingPage: "/industries/healthcare", reason: "Healthcare case study proves ROI for risk-averse buyers", difficulty: 7 },
    ],
  },
  {
    id: "legal",
    name: "Legal",
    type: "industry",
    color: "slate",
    keywords: ["legal", "law firm", "lawyer", "attorney", "legal services", "solicitor"],
    serviceTypes: [],
    industryMatch: ["legal", "law", "lawyer", "attorney"],
    portfolioKeywords: ["legal", "law firm"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 10,
    leadGenPotential: 9,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing for Law Firms in the UAE", slug: "digital-marketing-law-firms-uae", supportingPage: "/industries/legal", reason: "Legal services is highest-CPC industry — content anchors the cluster", difficulty: 3 },
      { contentType: "blog", title: "SEO for Law Firms UAE: Ranking for High-Value Keywords", slug: "seo-law-firms-uae", supportingPage: "/industries/legal", reason: "Legal SEO is extremely competitive — positions the agency as specialist", difficulty: 4 },
      { contentType: "blog", title: "Google Ads for Legal Services UAE: Compliance & Best Practices", slug: "google-ads-legal-services-uae", supportingPage: "/industries/legal", reason: "Google Ads for lawyers has strict policies — showing expertise builds trust", difficulty: 4 },
      { contentType: "case-study", title: "SEO Case Study: 340% Traffic Growth for UAE Law Firm", slug: "seo-case-study-uae-law-firm", supportingPage: "/industries/legal", reason: "Legal case study fills a critical proof gap in the highest-value vertical", difficulty: 8 },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    type: "industry",
    color: "emerald",
    keywords: ["real estate", "property", "developer", "agent", "realty", "apartments", "villas", "commercial property"],
    serviceTypes: [],
    industryMatch: ["real estate", "property", "developer", "realty"],
    portfolioKeywords: ["real estate", "property"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 10,
    leadGenPotential: 10,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing for Real Estate Developers in Dubai", slug: "digital-marketing-real-estate-developers-dubai", supportingPage: "/industries/real-estate", reason: "Dubai real estate is one of the most competitive and lucrative markets", difficulty: 3 },
      { contentType: "blog", title: "SEO for Real Estate Agents UAE: Ranking for Property Keywords", slug: "seo-real-estate-agents-uae", supportingPage: "/industries/real-estate", reason: "Agents searching for SEO solutions are high-value agency prospects", difficulty: 3 },
      { contentType: "blog", title: "Google Ads for Property Developers UAE: Lead Generation Guide", slug: "google-ads-property-developers-uae", supportingPage: "/industries/real-estate", reason: "Property developers spend heavily on Google Ads — high-value segment", difficulty: 4 },
      { contentType: "case-study", title: "45% More Property Enquiries via SEO — Dubai Developer Case Study", slug: "seo-case-study-dubai-property-developer", supportingPage: "/industries/real-estate", reason: "Missing real estate case study is a gap for the top-revenue sector", difficulty: 7 },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    type: "industry",
    color: "yellow",
    keywords: ["construction", "contractor", "builder", "fitout", "fit out", "interior design", "architecture", "civil"],
    serviceTypes: [],
    industryMatch: ["construction", "contractor", "builder", "fitout"],
    portfolioKeywords: ["construction", "contractor"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 8,
    leadGenPotential: 8,
    recommendations: [
      { contentType: "blog", title: "SEO for Construction Companies UAE", slug: "seo-construction-companies-uae", supportingPage: "/industries/construction", reason: "Construction is an underserved industry vertical in the content plan", difficulty: 3 },
      { contentType: "blog", title: "Google Ads for Contractors in Dubai: Lead Generation Guide", slug: "google-ads-contractors-dubai", supportingPage: "/industries/construction", reason: "UAE construction boom creates high demand for contractor leads", difficulty: 3 },
      { contentType: "blog", title: "Website Design for Construction Companies UAE", slug: "website-design-construction-companies-uae", supportingPage: "/industries/construction", reason: "Construction buyers research agencies online before calling", difficulty: 3 },
      { contentType: "blog", title: "Digital Marketing for Fit-Out Companies Dubai", slug: "digital-marketing-fitout-companies-dubai", supportingPage: "/industries/construction", reason: "Fit-out is a high-ticket segment with unique marketing needs", difficulty: 3 },
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality",
    type: "industry",
    color: "pink",
    keywords: ["hotel", "hospitality", "restaurant", "tourism", "travel", "resort", "f&b", "food and beverage"],
    serviceTypes: [],
    industryMatch: ["hospitality", "hotel", "restaurant", "tourism", "travel", "resort"],
    portfolioKeywords: ["hotel", "restaurant", "hospitality"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 8,
    leadGenPotential: 8,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing for Hotels in Dubai: 2025 Guide", slug: "digital-marketing-hotels-dubai", supportingPage: "/industries/hospitality", reason: "Dubai's hospitality sector is one of the largest marketing spenders", difficulty: 3 },
      { contentType: "blog", title: "Social Media Marketing for Restaurants in the UAE", slug: "social-media-marketing-restaurants-uae", supportingPage: "/industries/hospitality", reason: "Restaurants are heavy social spenders — practical advice earns trust", difficulty: 2 },
      { contentType: "blog", title: "Google Ads for Hotels UAE: Direct Booking Strategy", slug: "google-ads-hotels-uae-direct-booking", supportingPage: "/industries/hospitality", reason: "Hotels actively seek direct booking alternatives to OTA commissions", difficulty: 4 },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    type: "industry",
    color: "cyan",
    keywords: ["finance", "bank", "fintech", "insurance", "investment", "financial services", "wealth management"],
    serviceTypes: [],
    industryMatch: ["finance", "financial", "bank", "fintech", "insurance"],
    portfolioKeywords: ["finance", "financial", "bank"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 10,
    leadGenPotential: 9,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing for Finance Companies UAE", slug: "digital-marketing-finance-companies-uae", supportingPage: "/industries/finance", reason: "Finance is a high-CPC vertical — content positions the agency as specialist", difficulty: 4 },
      { contentType: "blog", title: "Google Ads for Financial Services UAE: Compliance Guide", slug: "google-ads-financial-services-uae", supportingPage: "/industries/finance", reason: "Financial Google Ads has strict policies — specialist content builds trust", difficulty: 5 },
      { contentType: "blog", title: "SEO for Banks and Fintech Companies in the UAE", slug: "seo-banks-fintech-companies-uae", supportingPage: "/industries/finance", reason: "Fintech SEO is growing rapidly — establishes expertise in the sector", difficulty: 4 },
      { contentType: "blog", title: "Social Media Strategy for UAE Financial Brands", slug: "social-media-strategy-uae-financial-brands", supportingPage: "/industries/finance", reason: "Finance brands struggle with social — practical guide generates leads", difficulty: 3 },
    ],
  },
  {
    id: "education",
    name: "Education",
    type: "industry",
    color: "violet",
    keywords: ["education", "school", "university", "training", "e-learning", "edtech", "college", "institute"],
    serviceTypes: [],
    industryMatch: ["education", "school", "university", "college", "training"],
    portfolioKeywords: ["school", "university", "education", "training"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 7,
    leadGenPotential: 8,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing for Schools and Universities UAE", slug: "digital-marketing-schools-universities-uae", supportingPage: "/industries/education", reason: "UAE's private education sector is a significant marketing spender", difficulty: 3 },
      { contentType: "blog", title: "Student Enrolment Marketing: Google Ads Strategy for UAE Colleges", slug: "student-enrolment-marketing-google-ads-uae", supportingPage: "/industries/education", reason: "Enrolment season creates concentrated high-spend periods", difficulty: 4 },
      { contentType: "blog", title: "SEO for Training Institutes in Dubai", slug: "seo-training-institutes-dubai", supportingPage: "/industries/education", reason: "Training institutes need local search ranking for course-specific keywords", difficulty: 3 },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    type: "industry",
    color: "sky",
    keywords: ["technology", "tech", "software", "saas", "startup", "app", "b2b tech", "it company"],
    serviceTypes: [],
    industryMatch: ["technology", "tech", "software", "saas", "startup"],
    portfolioKeywords: ["tech", "software", "app", "saas"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 9,
    leadGenPotential: 8,
    recommendations: [
      { contentType: "blog", title: "B2B SaaS Marketing UAE: Growth Strategies for Tech Companies", slug: "b2b-saas-marketing-uae-growth-strategies", supportingPage: "/industries/technology", reason: "UAE tech sector is fast-growing and underserved in agency content", difficulty: 4 },
      { contentType: "blog", title: "LinkedIn Ads for Tech Companies in Dubai", slug: "linkedin-ads-tech-companies-dubai", supportingPage: "/industries/technology", reason: "LinkedIn is the primary B2B acquisition channel for tech companies", difficulty: 3 },
      { contentType: "blog", title: "SEO for SaaS Companies: UAE-Specific Strategy", slug: "seo-saas-companies-uae", supportingPage: "/industries/technology", reason: "SaaS SEO has unique challenges — specialist content attracts tech buyers", difficulty: 4 },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    type: "industry",
    color: "lime",
    keywords: ["ecommerce", "e-commerce", "online store", "shopify", "woocommerce", "online retail", "amazon", "marketplace"],
    serviceTypes: [],
    industryMatch: ["ecommerce", "e-commerce", "online retail", "shopify", "retail"],
    portfolioKeywords: ["ecommerce", "online store", "shopify"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 9,
    leadGenPotential: 9,
    recommendations: [
      { contentType: "blog", title: "E-Commerce Marketing UAE: Complete Growth Strategy 2025", slug: "ecommerce-marketing-uae-growth-strategy-2025", supportingPage: "/industries/ecommerce", reason: "UAE e-commerce grew 23% in 2024 — massive content opportunity", difficulty: 3 },
      { contentType: "blog", title: "Google Shopping Ads for UAE Online Stores", slug: "google-shopping-ads-uae-online-stores", supportingPage: "/industries/ecommerce", reason: "Shopping ads are the primary e-commerce Google Ads format — missing guide", difficulty: 3 },
      { contentType: "blog", title: "Shopify SEO: How to Rank Your UAE Store in Google", slug: "shopify-seo-uae-online-store", supportingPage: "/industries/ecommerce", reason: "Shopify is the dominant platform for UAE e-commerce SMEs", difficulty: 3 },
      { contentType: "blog", title: "Email Marketing for UAE E-Commerce: Abandoned Cart to Revenue", slug: "email-marketing-uae-ecommerce-abandoned-cart", supportingPage: "/industries/ecommerce", reason: "Bridges email marketing and e-commerce clusters — high commercial intent", difficulty: 3 },
      { contentType: "case-study", title: "E-Commerce Google Ads: From AED 35K to AED 180K Monthly Revenue", slug: "ecommerce-google-ads-revenue-growth-uae", supportingPage: "/industries/ecommerce", reason: "Revenue-focused case study for e-commerce buyers evaluating paid ads", difficulty: 7 },
    ],
  },
  {
    id: "home-services",
    name: "Home Services",
    type: "industry",
    color: "orange",
    keywords: ["home services", "hvac", "plumbing", "cleaning", "pest control", "maintenance", "landscaping", "home improvement"],
    serviceTypes: [],
    industryMatch: ["home services", "hvac", "cleaning", "pest control", "plumbing", "maintenance"],
    portfolioKeywords: ["home services", "hvac", "cleaning"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 7,
    leadGenPotential: 8,
    recommendations: [
      { contentType: "blog", title: "Local SEO for Home Services Businesses in the UAE", slug: "local-seo-home-services-uae", supportingPage: "/industries/home-services", reason: "Home services businesses depend entirely on local search — high intent", difficulty: 2 },
      { contentType: "blog", title: "Google Ads for HVAC Companies in Dubai: Lead Generation", slug: "google-ads-hvac-companies-dubai", supportingPage: "/industries/home-services", reason: "HVAC is year-round in Dubai — high and consistent lead generation demand", difficulty: 3 },
      { contentType: "blog", title: "Digital Marketing for Cleaning Companies UAE", slug: "digital-marketing-cleaning-companies-uae", supportingPage: "/industries/home-services", reason: "Cleaning is the largest home services segment in the UAE by search volume", difficulty: 2 },
    ],
  },

  // ── Locations ────────────────────────────────────────────────────────────────
  {
    id: "dubai",
    name: "Dubai",
    type: "location",
    color: "blue",
    keywords: ["dubai", "dxb"],
    serviceTypes: [],
    industryMatch: [],
    portfolioKeywords: ["dubai"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 10,
    leadGenPotential: 10,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing Agency in Dubai: How to Choose the Right Partner", slug: "choose-digital-marketing-agency-dubai", supportingPage: "/locations/dubai", reason: "'Digital marketing agency Dubai' is the highest-volume commercial keyword for this location", difficulty: 3 },
      { contentType: "blog", title: "SEO Agency Dubai: What to Look For in 2025", slug: "seo-agency-dubai-what-to-look-for", supportingPage: "/locations/dubai", reason: "Agency comparison keyword from buyers late in the decision process", difficulty: 3 },
      { contentType: "blog", title: "Google Ads Agency Dubai: Questions to Ask Before You Sign", slug: "google-ads-agency-dubai-questions", supportingPage: "/locations/dubai", reason: "High commercial intent — buyers comparing agencies before committing", difficulty: 2 },
      { contentType: "blog", title: "Marketing Budget Guide for Dubai SMEs in 2025", slug: "marketing-budget-guide-dubai-smes-2025", supportingPage: "/locations/dubai", reason: "Decision-stage content that attracts SME owner searches", difficulty: 2 },
    ],
  },
  {
    id: "abu-dhabi",
    name: "Abu Dhabi",
    type: "location",
    color: "teal",
    keywords: ["abu dhabi", "abudhabi"],
    serviceTypes: [],
    industryMatch: [],
    portfolioKeywords: ["abu dhabi"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 9,
    leadGenPotential: 9,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing Agency in Abu Dhabi: 2025 Guide", slug: "digital-marketing-agency-abu-dhabi-2025", supportingPage: "/locations/abu-dhabi", reason: "Abu Dhabi is the second-largest UAE market — anchor content is missing", difficulty: 3 },
      { contentType: "blog", title: "SEO for Abu Dhabi Businesses: Local Search Strategy", slug: "seo-abu-dhabi-businesses-local-search", supportingPage: "/locations/abu-dhabi", reason: "Geo-specific SEO content supports both the location page and organic rankings", difficulty: 3 },
      { contentType: "blog", title: "Google Ads for Abu Dhabi Businesses: Cost and Strategy", slug: "google-ads-abu-dhabi-businesses", supportingPage: "/locations/abu-dhabi", reason: "Government and corporate buyers in Abu Dhabi are high-ticket prospects", difficulty: 3 },
    ],
  },
  {
    id: "sharjah",
    name: "Sharjah",
    type: "location",
    color: "green",
    keywords: ["sharjah"],
    serviceTypes: [],
    industryMatch: [],
    portfolioKeywords: ["sharjah"],
    toolCategory: null,
    academySlug: null,
    commercialValue: 7,
    leadGenPotential: 7,
    recommendations: [
      { contentType: "blog", title: "Digital Marketing for Sharjah Businesses: 2025 Guide", slug: "digital-marketing-sharjah-businesses-2025", supportingPage: "/locations/sharjah", reason: "Sharjah is an underserved market — geo-targeted content ranks quickly", difficulty: 2 },
      { contentType: "blog", title: "SEO for Sharjah Businesses: Local Search Ranking Guide", slug: "seo-sharjah-businesses-local-search", supportingPage: "/locations/sharjah", reason: "Local SEO is the primary need for Sharjah businesses", difficulty: 2 },
    ],
  },

  // ── Special ──────────────────────────────────────────────────────────────────
  {
    id: "tools",
    name: "Free Tools",
    type: "special",
    color: "fuchsia",
    keywords: ["calculator", "tool", "generator", "checker", "template"],
    serviceTypes: [],
    industryMatch: [],
    portfolioKeywords: [],
    toolCategory: null,
    academySlug: null,
    commercialValue: 6,
    leadGenPotential: 8,
    recommendations: [
      { contentType: "tool", title: "Social Media ROI Calculator", slug: "social-media-roi-calculator", supportingPage: "/tools", reason: "Fills a gap in the Social Media cluster — no ROI tool exists", difficulty: 4 },
      { contentType: "tool", title: "Email Marketing ROI Calculator", slug: "email-marketing-roi-calculator", supportingPage: "/tools", reason: "Email cluster has no tool — calculator supports the service page", difficulty: 4 },
      { contentType: "tool", title: "Landing Page Conversion Rate Calculator", slug: "landing-page-conversion-calculator", supportingPage: "/tools", reason: "Supports both web design and Google Ads clusters — dual linking value", difficulty: 3 },
      { contentType: "tool", title: "Content Marketing ROI Calculator", slug: "content-marketing-roi-calculator", supportingPage: "/tools", reason: "Content marketing cluster has no dedicated ROI tool", difficulty: 4 },
      { contentType: "blog", title: "How to Use the SEO ROI Calculator: UAE Guide", slug: "how-to-use-seo-roi-calculator-uae", supportingPage: "/tools/seo-roi-calculator", reason: "Blog post linking to the calculator improves tool discoverability", difficulty: 1 },
      { contentType: "blog", title: "7 Free Marketing Tools Every UAE Business Should Use", slug: "free-marketing-tools-uae-businesses", supportingPage: "/tools", reason: "Roundup post drives traffic to the tools section", difficulty: 2 },
    ],
  },
  {
    id: "academy",
    name: "Academy",
    type: "special",
    color: "amber",
    keywords: ["guide", "tutorial", "learn", "how to", "beginner", "fundamentals", "course"],
    serviceTypes: [],
    industryMatch: [],
    portfolioKeywords: [],
    toolCategory: null,
    academySlug: null,
    commercialValue: 5,
    leadGenPotential: 7,
    recommendations: [
      { contentType: "academy", title: "Email Marketing Guides", slug: "email-marketing-guides", supportingPage: "/academy", reason: "Email marketing has no Academy category — the most glaring content gap", difficulty: 4 },
      { contentType: "academy", title: "Industry Marketing Guides", slug: "industry-marketing-guides", supportingPage: "/academy", reason: "No industry-specific learning content exists — high differentiation potential", difficulty: 6 },
      { contentType: "academy", title: "E-Commerce Marketing Guides", slug: "ecommerce-marketing-guides", supportingPage: "/academy", reason: "E-Commerce is the fastest-growing UAE market segment without Academy coverage", difficulty: 5 },
      { contentType: "blog", title: "Digital Marketing Glossary for UAE Businesses", slug: "digital-marketing-glossary-uae", supportingPage: "/academy", reason: "Glossary pages rank well for long-tail definition queries and support Academy", difficulty: 2 },
      { contentType: "blog", title: "How to Build a Digital Marketing Strategy for UAE SMEs", slug: "digital-marketing-strategy-uae-smes", supportingPage: "/academy", reason: "Beginner-friendly strategy guide earns trust and links to Academy categories", difficulty: 2 },
    ],
  },
];

// ─── Computation ──────────────────────────────────────────────────────────────

function matchesKeywords(text: string | null | undefined, keywords: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

interface RawData {
  blogPosts: Array<{ title: string; categories: Array<{ name: string }> }>;
  caseStudies: Array<{ title: string; serviceType: string | null; industry: string | null }>;
  portfolioProjects: Array<{ title: string; services: string[] }>;
}

export function computeCoverage(clusters: ClusterDef[], data: RawData): ClusterCoverage[] {
  const toolsByCategory = new Map<string, number>();
  for (const tool of TOOLS) {
    toolsByCategory.set(tool.category, (toolsByCategory.get(tool.category) ?? 0) + 1);
  }

  const academyGuidesBySlug = new Map<string, number>();
  for (const cat of ACADEMY_CATEGORIES) {
    academyGuidesBySlug.set(cat.slug, cat.sections.length);
  }

  return clusters.map((cluster) => {
    // Blog coverage — title OR category name matches any cluster keyword
    const blogCount = data.blogPosts.filter((p) => {
      if (matchesKeywords(p.title, cluster.keywords)) return true;
      return p.categories.some((c) => matchesKeywords(c.name, cluster.keywords));
    }).length;

    // Case study coverage
    const caseStudyCount = data.caseStudies.filter((cs) => {
      if (cluster.serviceTypes.length > 0 && matchesKeywords(cs.serviceType, cluster.serviceTypes)) return true;
      if (cluster.industryMatch.length > 0 && matchesKeywords(cs.industry, cluster.industryMatch)) return true;
      return matchesKeywords(cs.title, cluster.keywords);
    }).length;

    // Portfolio coverage
    const portfolioCount = data.portfolioProjects.filter((p) => {
      if (matchesKeywords(p.title, cluster.portfolioKeywords.concat(cluster.keywords))) return true;
      return p.services.some((s) => matchesKeywords(s, cluster.keywords));
    }).length;

    // Tool coverage
    const toolCount = cluster.toolCategory ? (toolsByCategory.get(cluster.toolCategory) ?? 0) : 0;

    // Academy coverage
    const academyCount = cluster.academySlug ? (academyGuidesBySlug.get(cluster.academySlug) ?? 0) : 0;

    // Weighted score (capped at 100)
    const score = Math.round(
      Math.min(blogCount / 5, 1) * 40 +
      Math.min(caseStudyCount / 2, 1) * 25 +
      Math.min(portfolioCount / 2, 1) * 15 +
      Math.min(toolCount / 3, 1) * 10 +
      Math.min(academyCount / 4, 1) * 10,
    );

    const status: CoverageStatus =
      score >= 75 ? "strong" :
      score >= 45 ? "moderate" :
      score >= 20 ? "weak" :
      "critical";

    return { cluster, blogCount, caseStudyCount, portfolioCount, toolCount, academyCount, coverageScore: score, status };
  });
}

export function scoredRecommendations(coverages: ClusterCoverage[]): ScoredRecommendation[] {
  const recs: ScoredRecommendation[] = [];
  for (const cov of coverages) {
    for (const rec of cov.cluster.recommendations) {
      const clusterWeakness = (100 - cov.coverageScore) / 100;
      const priority = Math.round(
        (cov.cluster.commercialValue / 10) * 30 +
        clusterWeakness * 40 +
        (cov.cluster.leadGenPotential / 10) * 20 +
        ((10 - rec.difficulty) / 10) * 10,
      );
      recs.push({
        ...rec,
        clusterId: cov.cluster.id,
        clusterName: cov.cluster.name,
        clusterType: cov.cluster.type,
        coverageScore: cov.coverageScore,
        priorityScore: Math.min(priority, 100),
        commercialValue: cov.cluster.commercialValue,
      });
    }
  }
  return recs.sort((a, b) => b.priorityScore - a.priorityScore);
}

export interface Roadmap {
  week: ScoredRecommendation[];
  month: ScoredRecommendation[];
  quarter: ScoredRecommendation[];
  year: ScoredRecommendation[];
}

export function buildRoadmap(recs: ScoredRecommendation[]): Roadmap {
  return {
    week:    recs.filter((r) => r.priorityScore >= 80).slice(0, 6),
    month:   recs.filter((r) => r.priorityScore >= 65 && r.priorityScore < 80).slice(0, 15),
    quarter: recs.filter((r) => r.priorityScore >= 45 && r.priorityScore < 65).slice(0, 30),
    year:    recs.filter((r) => r.priorityScore < 45),
  };
}

export function toCsvRow(r: ScoredRecommendation): string[] {
  return [
    r.clusterName,
    r.clusterType,
    r.contentType,
    r.title,
    String(r.priorityScore),
    String(r.commercialValue),
    String(r.difficulty),
    r.slug,
    r.supportingPage,
    r.reason,
  ];
}

export const CSV_HEADERS = [
  "Cluster", "Cluster Type", "Content Type", "Recommended Title",
  "Priority Score", "Commercial Value", "Difficulty",
  "Recommended URL Slug", "Supporting Page", "Reason",
];
