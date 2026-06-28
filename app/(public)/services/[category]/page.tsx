import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import ServiceHeroIllustration from "@/components/services/ServiceHeroIllustration";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { AuthorityStrip } from "@/components/trust/AuthorityStrip";
import { ClientResultsStrip } from "@/components/trust/ClientResultsStrip";
import { ServiceTrustBlock } from "@/components/trust/ServiceTrustBlock";
import { TrustSidebarWidget } from "@/components/trust/TrustSidebarWidget";

const SERVICE_CASE_STUDY_TYPES: Record<string, string[]> = {
  seo: ["SEO", "Search Engine Optimization", "Organic"],
  "google-ads": ["Google Ads", "PPC", "Pay Per Click", "Google Adwords", "Paid Search"],
  "social-media": ["Social Media Marketing", "Social Media", "Facebook", "Instagram", "TikTok"],
  "content-marketing": ["Content Marketing", "Content"],
  "email-marketing": ["Email Marketing", "Email"],
  analytics: ["Analytics", "Data"],
  "web-design": ["Web Design", "Web Development", "Website"],
  "local-seo": ["Local SEO", "Google My Business"],
};

// ─── Per-service configuration ────────────────────────────────────────────────

interface Deliverable {
  title: string;
  description: string;
  iconPath: string;
}

interface ServiceConfig {
  eyebrow: string;
  tagline: string;
  description: string;
  deliverables: Deliverable[];
  articleKeywords: string[];
}

// Heroicons (solid) path data
const ICON = {
  search: "M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z",
  chart: "M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z",
  bars: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  link: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
  document: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z",
  cursor: "M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59",
  calendar: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
  email: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  map: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
  star: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  shield: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  code: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  lightning: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  eye: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  target: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM3.344 12.986a.75.75 0 0 1 .736-.736l.007.007-.007-.007ZM21 12.75a9.004 9.004 0 0 1-8.25 8.982V22.5h-.75V21.73A9.004 9.004 0 0 1 3.018 13.5H2.25v-.75h.768A9.004 9.004 0 0 1 11.25 4.268V3.75h.75v.518A9.004 9.004 0 0 1 20.982 12.75H21.75v.75H21Z",
};

// Simpler icon set using correct Heroicons paths
const ICONS = {
  audit: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z",
  keyword: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
  onpage: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  link: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
  report: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  campaign: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  ad: "M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59",
  social: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
  content: "M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
  email: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  automation: "M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 6 0m-6 0H2.25m11.25 0h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H2.25m9 0h9.75",
  map: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
  wire: "M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  shield: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  eye: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  star: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  code: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  qa: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  calendar: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
  review: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
};

const SERVICE_CONFIG: Record<string, ServiceConfig> = {
  seo: {
    eyebrow: "SEO & Organic Search",
    tagline: "Rank higher. Drive more organic traffic.",
    description:
      "We build data-led SEO strategies that get UAE businesses found online. From technical audits to link building, every action is tied to organic growth and measurable ranking improvements.",
    articleKeywords: ["SEO", "search engine", "organic", "keyword", "link building", "ranking", "technical"],
    deliverables: [
      { title: "Technical SEO Audit", description: "Full crawl analysis, Core Web Vitals review, and structured fixes roadmap.", iconPath: ICONS.audit },
      { title: "Keyword Research", description: "UAE-focused keyword mapping with intent analysis and opportunity scoring.", iconPath: ICONS.keyword },
      { title: "On-Page Optimisation", description: "Title tags, meta descriptions, heading structure, and internal linking.", iconPath: ICONS.onpage },
      { title: "Link Building", description: "White-hat outreach to earn high-authority backlinks in your niche.", iconPath: ICONS.link },
      { title: "Content Strategy", description: "Editorial plan aligned to search intent — blog posts, landing pages, and pillars.", iconPath: ICONS.content },
      { title: "Monthly Reporting", description: "Ranking progress, traffic data, and clear next steps every month.", iconPath: ICONS.report },
    ],
  },
  "local-seo": {
    eyebrow: "Local SEO",
    tagline: "Dominate local search. Win more nearby customers.",
    description:
      "We help UAE businesses appear at the top of Google Maps and local search results. From Google Business Profile optimisation to local citations and review management — we cover every touchpoint.",
    articleKeywords: ["local SEO", "Google Business", "local search", "GMB", "citations", "reviews", "map"],
    deliverables: [
      { title: "Google Business Optimisation", description: "Complete GBP setup, category selection, and keyword-rich description.", iconPath: ICONS.map },
      { title: "Local Citation Building", description: "Consistent NAP across 200+ UAE business directories.", iconPath: ICONS.link },
      { title: "Review Management", description: "Strategy for generating authentic reviews and responding professionally.", iconPath: ICONS.star },
      { title: "Geo-Targeted Content", description: "Location pages and locally-relevant blog content that ranks.", iconPath: ICONS.onpage },
      { title: "Local Link Building", description: "Backlinks from UAE-based publications, directories, and partners.", iconPath: ICONS.link },
      { title: "Monthly Local Report", description: "Ranking positions, map pack visibility, and call/direction tracking.", iconPath: ICONS.report },
    ],
  },
  "google-ads": {
    eyebrow: "Paid Advertising",
    tagline: "Turn ad spend into measurable revenue.",
    description:
      "We manage Google Ads campaigns that generate qualified leads and sales — not just clicks. Every dirham of your budget is tracked, optimised, and reported against real business outcomes.",
    articleKeywords: ["Google Ads", "PPC", "pay per click", "AdWords", "paid search", "remarketing", "campaign"],
    deliverables: [
      { title: "Campaign Architecture", description: "Structured campaigns built around your services, locations, and customer intent.", iconPath: ICONS.campaign },
      { title: "Keyword Mapping", description: "Precision match-type strategy to maximise relevance and minimise waste.", iconPath: ICONS.keyword },
      { title: "Ad Copywriting", description: "High-converting headlines and descriptions tested across ad variations.", iconPath: ICONS.ad },
      { title: "Bid Management", description: "Smart bidding strategies adjusted to your cost-per-lead targets.", iconPath: ICONS.report },
      { title: "Conversion Tracking", description: "Full GA4 + GTM setup so every call, form, and sale is attributed.", iconPath: ICONS.eye },
      { title: "Performance Reports", description: "Clear monthly dashboard: impressions, clicks, conversions, ROAS.", iconPath: ICONS.report },
    ],
  },
  "social-media": {
    eyebrow: "Social Media Marketing",
    tagline: "Build community. Accelerate brand growth.",
    description:
      "We create and manage social media strategies that grow your following, build brand authority, and generate leads across Instagram, LinkedIn, Facebook, and TikTok.",
    articleKeywords: ["social media", "Facebook", "Instagram", "LinkedIn", "TikTok", "paid social", "community"],
    deliverables: [
      { title: "Platform Strategy", description: "Channel selection, audience profiling, and content pillars unique to your brand.", iconPath: ICONS.social },
      { title: "Content Calendar", description: "Monthly plan with post ideas, formats, and scheduling across all channels.", iconPath: ICONS.calendar },
      { title: "Creative Production", description: "Professional graphics, videos, and copy designed for each platform.", iconPath: ICONS.content },
      { title: "Community Management", description: "Timely responses to comments, DMs, and brand mentions.", iconPath: ICONS.review },
      { title: "Paid Social Campaigns", description: "Meta and LinkedIn ad campaigns targeting your exact customer profile.", iconPath: ICONS.campaign },
      { title: "Monthly Analytics", description: "Follower growth, engagement rate, reach, and lead attribution.", iconPath: ICONS.report },
    ],
  },
  "content-marketing": {
    eyebrow: "Content Marketing",
    tagline: "Create content that ranks, converts, and builds authority.",
    description:
      "We develop content strategies and produce long-form assets that establish your brand as the go-to authority in your market — driving organic traffic, leads, and trust.",
    articleKeywords: ["content marketing", "content strategy", "blog", "copywriting", "editorial", "authority"],
    deliverables: [
      { title: "Content Strategy", description: "Audience research, topic clusters, and a content roadmap aligned to SEO.", iconPath: ICONS.onpage },
      { title: "Editorial Calendar", description: "Month-by-month publishing plan with topics, formats, and ownership.", iconPath: ICONS.calendar },
      { title: "Long-Form Content", description: "Blog posts, guides, whitepapers, and case studies — SEO-optimised.", iconPath: ICONS.content },
      { title: "Content Optimisation", description: "Updating existing content to improve rankings and click-through rates.", iconPath: ICONS.keyword },
      { title: "Distribution Plan", description: "Amplification via email, social, and paid promotion channels.", iconPath: ICONS.campaign },
      { title: "Performance Review", description: "Monthly content audit: traffic, rankings, leads, and engagement.", iconPath: ICONS.report },
    ],
  },
  "email-marketing": {
    eyebrow: "Email Marketing",
    tagline: "Nurture leads and boost retention with targeted email.",
    description:
      "We design, build, and manage email marketing campaigns that keep your brand top of mind — from welcome automations to promotional campaigns with industry-leading open rates.",
    articleKeywords: ["email marketing", "email campaign", "newsletter", "automation", "email", "open rate"],
    deliverables: [
      { title: "List Segmentation", description: "Clean, tagged subscriber lists segmented by behaviour and lifecycle stage.", iconPath: ICONS.social },
      { title: "Template Design", description: "Mobile-first email templates that match your brand and convert.", iconPath: ICONS.email },
      { title: "Automation Flows", description: "Welcome series, abandoned cart, re-engagement, and nurture sequences.", iconPath: ICONS.automation },
      { title: "A/B Testing", description: "Subject line, CTA, and content testing to improve open and click rates.", iconPath: ICONS.eye },
      { title: "Deliverability Audit", description: "SPF, DKIM, DMARC, and sender reputation checks.", iconPath: ICONS.shield },
      { title: "Campaign Reports", description: "Opens, clicks, conversions, and revenue attribution every send.", iconPath: ICONS.report },
    ],
  },
  "web-design": {
    eyebrow: "Web Design & Development",
    tagline: "Build websites that convert visitors into customers.",
    description:
      "We design and develop fast, conversion-optimised websites for UAE businesses — from corporate sites to e-commerce platforms. Every project is built mobile-first, SEO-ready, and focused on results.",
    articleKeywords: ["web design", "website", "WordPress", "UX", "landing page", "responsive", "conversion"],
    deliverables: [
      { title: "Discovery & Brief", description: "Goals, audience, competitor review, and technical requirements scoped.", iconPath: ICONS.review },
      { title: "UX Wireframes", description: "Page-by-page wireframes showing layout, navigation, and conversion flow.", iconPath: ICONS.wire },
      { title: "UI Design", description: "High-fidelity designs in your brand — desktop and mobile, for every key page.", iconPath: ICONS.star },
      { title: "Development", description: "Clean, fast code built on the platform that suits your business.", iconPath: ICONS.code },
      { title: "QA & Testing", description: "Cross-browser, cross-device testing before launch.", iconPath: ICONS.qa },
      { title: "Launch & Handover", description: "Live deployment, GA4 setup, CMS training, and post-launch support.", iconPath: ICONS.shield },
    ],
  },
  analytics: {
    eyebrow: "Analytics & Reporting",
    tagline: "Turn data into decisions that drive growth.",
    description:
      "We audit, configure, and visualise your marketing data so you always know what's working. From GA4 setup to custom Looker Studio dashboards — we make analytics actionable.",
    articleKeywords: ["analytics", "Google Analytics", "GA4", "data", "reporting", "tracking", "dashboard"],
    deliverables: [
      { title: "Analytics Audit", description: "Full review of your existing tracking — gaps, errors, and quick wins.", iconPath: ICONS.audit },
      { title: "GA4 & Tag Manager Setup", description: "Clean, complete implementation of GA4, GTM, and conversion events.", iconPath: ICONS.eye },
      { title: "Custom Dashboards", description: "Looker Studio dashboards tailored to your KPIs and reporting cadence.", iconPath: ICONS.report },
      { title: "Goal Configuration", description: "Conversion goals, funnels, and event tracking aligned to business outcomes.", iconPath: ICONS.campaign },
      { title: "Audience Segmentation", description: "Behavioural segments for remarketing and content personalisation.", iconPath: ICONS.social },
      { title: "Monthly Insights Report", description: "Plain-English data interpretation — what happened and what to do next.", iconPath: ICONS.content },
    ],
  },
};

// ─── Related-page keyword map (fallback when no Service records exist) ─────────
const RELATED_PAGE_KEYWORDS: Record<string, string[]> = {
  // Note: "Adobe Analytics", "Tableau", "Search Console" removed — those are
  // third-party tool pages imported from WP, not Eddie's service pages.
  analytics: ["Analytics and Reporting", "Analytics Strategy", "Marketing Attribution", "Conversion Tracking", "Reporting", "KPI"],
  "content-marketing": ["Content Marketing", "Content Creation", "Blog Writing", "Copywriting", "Sponsored Content", "Business Writing", "Product Pages"],
  "email-marketing": ["Email Marketing", "Email Campaign", "Newsletter", "Email"],
  "local-seo": ["Google My Business", "Bing Places", "Local SEO", "Local Search", "Agency for Local Search"],
  "web-design": ["Website Development", "Web Design", "WordPress", "Shopify", "Joomla", "Squarespace", "HTML5", "Responsive"],
  "google-ads": ["Google Adwords", "Adwords Management", "Pay Per Click", "PPC", "Display Advertising", "Bing Ads", "Remarketing"],
  seo: ["On Page SEO", "On-Page SEO", "Link Building", "SEO Analysis", "Off Page SEO", "Keyword Research", "SEO Packages", "SEO Strategy"],
  "social-media": ["Facebook Advertising", "Instagram Advertising", "LinkedIn Advertising", "Snapchat Advertising", "YouTube Advertising", "Twitter Marketing", "Paid Social"],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function estimateReadTime(excerpt: string | null | undefined): string {
  const words = (excerpt ?? "").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(3, Math.min(12, Math.round((words * 15) / 200)));
  return `${mins} min read`;
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.serviceCategory.findUnique({ where: { slug: category } });
  if (!cat) return { title: "Not Found" };
  const config = SERVICE_CONFIG[category];
  return buildMetadata({
    title: `${cat.name} Services`,
    description:
      config?.description ??
      cat.description ??
      `Browse all ${cat.name} services from Eddie Marketing Solutions. Expert digital marketing that drives real results.`,
    path: `/services/${category}`,
  });
}

export async function generateStaticParams() {
  const cats = await prisma.serviceCategory.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return cats.map((c) => ({ category: c.slug }));
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { category } = await params;

  const config = SERVICE_CONFIG[category];
  const serviceContent = SERVICE_CONTENT[category];
  const articleKeywords = config?.articleKeywords ?? [];

  const [cat, services, otherCategories] = await Promise.all([
    prisma.serviceCategory.findUnique({ where: { slug: category } }),
    prisma.service.findMany({
      where: { category: { slug: category }, status: "published" },
      orderBy: { title: "asc" },
      select: { id: true, slug: true, title: true, excerpt: true },
    }),
    prisma.serviceCategory.findMany({
      where: { status: "published", NOT: { slug: category } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  if (!cat || cat.status !== "published") notFound();

  // ── Contextual related articles (keyword-matched, with recent fallback) ──────
  let relatedPosts = articleKeywords.length > 0
    ? await prisma.blogPost.findMany({
        where: {
          status: "published",
          OR: articleKeywords.map((kw) => ({
            title: { contains: kw, mode: "insensitive" as const },
          })),
        },
        orderBy: { publishedAt: "desc" },
        take: 4,
        select: {
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          categories: { select: { name: true } },
        },
      })
    : [];

  if (relatedPosts.length === 0) {
    relatedPosts = await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        categories: { select: { name: true } },
      },
    });
  }

  // ── Related Case Studies (by serviceType matching) ─────────────────────────
  const caseStudyTypes = SERVICE_CASE_STUDY_TYPES[category] ?? [];
  const relatedCaseStudies = caseStudyTypes.length > 0
    ? await prisma.caseStudy.findMany({
        where: {
          status: "published",
          OR: caseStudyTypes.map((t) => ({
            serviceType: { contains: t, mode: "insensitive" as const },
          })),
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          slug: true,
          title: true,
          clientName: true,
          serviceType: true,
          industry: true,
          trafficIncreasePercent: true,
          leadIncreasePercent: true,
          revenueGenerated: true,
        },
      })
    : [];

  // ── Related imported Pages (used when no Service records exist) ──────────────
  let relatedPages: Array<{ slug: string; title: string; excerpt: string | null }> = [];
  if (services.length === 0) {
    const keywords = RELATED_PAGE_KEYWORDS[category] ?? [];
    if (keywords.length > 0) {
      relatedPages = await prisma.page.findMany({
        where: {
          status: "published",
          importStatus: { not: "failed" },
          NOT: [
            { slug: { contains: "case-study" } },
            { title: { contains: "Case Study", mode: "insensitive" } },
            { title: { contains: "Training", mode: "insensitive" } },
          ],
          OR: keywords.map((kw) => ({
            title: { contains: kw, mode: "insensitive" as const },
          })),
        },
        select: { slug: true, title: true, excerpt: true },
        take: 8,
        orderBy: { title: "asc" },
      });
    }
  }

  const tagline = config?.tagline ?? "";
  const heroDescription = config?.description ?? cat.description ?? "";
  const deliverables = config?.deliverables ?? [];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/services/${category}#page`,
            name: `${cat.name} Services`,
            url: `${SITE_URL}/services/${category}`,
            description: heroDescription || undefined,
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: cat.name, path: `/services/${category}` },
          ]),
          ...(serviceContent?.faqs && serviceContent.faqs.length > 0
            ? [{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: serviceContent.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }]
            : []),
        ]}
      />

      {/* ── Hero (two-column) ─────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/services" className="hover:text-slate-300 transition-colors">Services</Link>
                <span>/</span>
                <span className="text-slate-300">{cat.name}</span>
              </nav>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
                {config?.eyebrow ?? cat.name}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                {cat.name} Services
              </h1>
              {tagline && (
                <p className="text-lg md:text-xl text-white/90 font-medium mb-3 leading-snug">
                  {tagline}
                </p>
              )}
              {heroDescription && (
                <p className="text-base text-slate-300 max-w-lg leading-relaxed mb-8">
                  {heroDescription}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="accent" size="lg" href="/request-for-a-proposal">
                  Get a Free Strategy Session
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  href="/portfolio"
                  className="text-slate-300 hover:text-white hover:bg-white/10 border border-slate-600 hover:border-slate-400"
                >
                  See Our Work →
                </Button>
              </div>
            </div>
            {/* Right: illustration */}
            <div className="hidden lg:block">
              <ServiceHeroIllustration category={category} />
            </div>
          </div>
        </div>
      </div>

      <AuthorityStrip />
      <ClientResultsStrip />

      {/* ── Deliverables strip ───────────────────────────────────────────────── */}
      {deliverables.length > 0 && (
        <div className="bg-slate-50 border-b border-slate-200 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">
                  What We Deliver
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  {cat.name} Service Deliverables
                </h2>
              </div>
              <Link
                href="/request-for-a-proposal"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors shrink-0"
              >
                Book a Free Consultation →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliverables.map((d) => (
                <div
                  key={d.title}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={d.iconPath} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">{d.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{d.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Primary column */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {services.length > 0
                ? `${cat.name} Services`
                : relatedPages.length > 0
                ? `${cat.name} Resources`
                : `${cat.name} Services`}
            </h2>

            {/* Service records */}
            {services.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${category}/${service.slug}`}
                    className="group block p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {service.title}
                    </h3>
                    {service.excerpt && (
                      <p className="text-sm text-slate-500 line-clamp-2">{service.excerpt}</p>
                    )}
                    <span className="inline-block mt-3 text-sm text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                      Learn more &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Related imported Pages (when no Service records) */}
            {services.length === 0 && relatedPages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {relatedPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className="group block p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {page.title}
                      </h3>
                      <span className="shrink-0 inline-block text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                        {cat.name}
                      </span>
                    </div>
                    {page.excerpt && (
                      <p className="text-sm text-slate-500 line-clamp-2">{page.excerpt}</p>
                    )}
                    <span className="inline-block mt-3 text-sm text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                      Learn more &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty state */}
            {services.length === 0 && relatedPages.length === 0 && (
              <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-slate-500">Contact us to discuss your {cat.name.toLowerCase()} needs.</p>
                <Link
                  href="/request-for-a-proposal"
                  className="inline-block mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Get a free consultation &rarr;
                </Link>
              </div>
            )}

            {/* ── Section 1: Business Case ──────────────────────────────────── */}
            {serviceContent?.businessCase && serviceContent.businessCase.length > 0 && (
              <div className="mt-14 pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Why {cat.name} Matters for Your Business
                </h2>
                <div className="space-y-4">
                  {serviceContent.businessCase.map((para, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section 2: Common Challenges ──────────────────────────────── */}
            {serviceContent?.challenges && serviceContent.challenges.length > 0 && (
              <div className="mt-14 pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Common {cat.name} Challenges
                </h2>
                <div className="space-y-4">
                  {serviceContent.challenges.map((c) => (
                    <div key={c.title} className="flex gap-4 p-5 bg-red-50 border border-red-100 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section 3: How Eddie Solves Them ──────────────────────────── */}
            {serviceContent?.solutions && serviceContent.solutions.length > 0 && (
              <div className="mt-14 pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  How Eddie Marketing Solves These Challenges
                </h2>
                <div className="space-y-4">
                  {serviceContent.solutions.map((para, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section 4: Our Process ────────────────────────────────────── */}
            {serviceContent?.process && serviceContent.process.length > 0 && (
              <div className="mt-14 pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                  Our {cat.name} Process
                </h2>
                <div className="space-y-0">
                  {serviceContent.process.map((step, i) => (
                    <div key={step.title} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                          {i + 1}
                        </div>
                        {i < serviceContent.process.length - 1 && (
                          <div className="w-0.5 flex-1 bg-blue-100 mt-1 mb-1 min-h-[2rem]" />
                        )}
                      </div>
                      <div className="pb-6 pt-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section 5: Why Choose Eddie ───────────────────────────────── */}
            {serviceContent?.whyEddie && serviceContent.whyEddie.length > 0 && (
              <div className="mt-14 pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Why Choose Eddie for {cat.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceContent.whyEddie.map((point) => (
                    <div key={point.title} className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-start gap-3 mb-2">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 className="font-semibold text-slate-900 text-sm leading-snug">{point.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pl-8">{point.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ServiceTrustBlock serviceSlug={category} />

            {/* ── Section 6: Results Framework ──────────────────────────────── */}
            {serviceContent?.results && serviceContent.results.length > 0 && (
              <div className="mt-14 pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  What Success Looks Like
                </h2>
                <p className="text-slate-500 mb-6 text-sm">
                  The KPIs we track and the benchmarks we work toward for {cat.name.toLowerCase()} clients.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceContent.results.map((kpi) => (
                    <div key={kpi.metric} className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
                      <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2">{kpi.metric}</div>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">{kpi.description}</p>
                      <p className="text-xs text-slate-400 italic leading-relaxed">{kpi.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Contextual Related Articles ───────────────────────────────── */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">
                      From the Blog
                    </p>
                    <h2 className="text-xl font-bold text-slate-900">
                      Related Articles
                    </h2>
                  </div>
                  <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    View all &rarr;
                  </Link>
                </div>
                <div className="space-y-4">
                  {relatedPosts.map((post) => {
                    const readTime = estimateReadTime(post.excerpt);
                    const categoryName = post.categories?.[0]?.name;
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {categoryName && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                {categoryName}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">{readTime}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-1">
                            {post.title}
                          </p>
                          {post.excerpt && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                          )}
                          {post.publishedAt && (
                            <time className="text-[10px] text-slate-400 mt-2 block" dateTime={post.publishedAt.toISOString()}>
                              {post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </time>
                          )}
                        </div>
                        <div className="shrink-0 flex items-center">
                          <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <div className="ems-gradient-bg rounded-xl p-6 text-white">
              <h3 className="text-base font-bold mb-2">Free Strategy Session</h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                30 minutes with a senior {cat.name} strategist. No obligation, just actionable insights.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                Book Free Session
              </Button>
            </div>

            {/* Other service categories */}
            {otherCategories.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Other Services</h3>
                <ul className="space-y-2.5">
                  {otherCategories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/services/${c.slug}`}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick links */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Explore More</h3>
              <ul className="space-y-2">
                {[
                  { href: "/portfolio", label: "Case Studies" },
                  { href: "/industries", label: "Industries We Serve" },
                  { href: "/blog", label: "Marketing Blog" },
                  { href: "/request-for-a-proposal", label: "Get a Free Strategy Session" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                      {link.label} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <TrustSidebarWidget />
          </div>
        </div>
      </div>

      {/* ── Section 7: FAQs ──────────────────────────────────────────────────── */}
      {serviceContent?.faqs && serviceContent.faqs.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                Have Questions?
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Frequently Asked Questions about {cat.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceContent.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-200 transition-colors"
                >
                  <h3 className="font-semibold text-slate-900 mb-3 leading-snug">{faq.question}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Client Case Studies ──────────────────────────────────────────────── */}
      {relatedCaseStudies.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">
                  Proven Results
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  {cat.name} Case Studies
                </h2>
              </div>
              <Link href="/portfolio" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors shrink-0">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedCaseStudies.map((cs) => (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
                >
                  {cs.industry && (
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 mb-3">
                      {cs.industry}
                    </span>
                  )}
                  {cs.clientName && (
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                      {cs.clientName}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-3">
                    {cs.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs font-bold">
                    {cs.trafficIncreasePercent && (
                      <span className="text-teal-600">+{cs.trafficIncreasePercent}% traffic</span>
                    )}
                    {cs.leadIncreasePercent && (
                      <span className="text-blue-600">+{cs.leadIncreasePercent}% leads</span>
                    )}
                    {cs.revenueGenerated && (
                      <span className="text-emerald-600">{cs.revenueGenerated} revenue</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Internal linking — cluster-based */}
      <ClusterLinksSection
        variant="category"
        categorySlug={cat.slug}
        categoryName={cat.name}
        categoryDescription={cat.description}
        excludeSlug={cat.slug}
      />

      {/* Lead capture — 8 bullets by default */}
      <LeadCaptureSection
        title={`Get a Free ${cat.name} Strategy Session`}
        description={`Tell us about your business and we'll put together a custom ${cat.name.toLowerCase()} plan with clear targets and timelines.`}
        defaultService={cat.name}
        submitLabel="Request Strategy Session"
        eyebrow="Free Consultation"
      />

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Ready to Grow?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Let&apos;s build your {cat.name.toLowerCase()} strategy
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Our team of {cat.name.toLowerCase()} specialists is ready to help you outrank, outgrow, and outperform the competition.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              Get a Free Consultation
            </Button>
            <Button variant="ghost" size="lg" href="/portfolio" className="text-slate-400 hover:text-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
