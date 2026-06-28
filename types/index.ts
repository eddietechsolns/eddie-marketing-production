export type { Page, Service, Industry, Location, BlogPost, PortfolioProject } from "@prisma/client";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface MetaProps {
  title: string;
  description?: string;
  canonical?: string;
}

export interface ServiceCategory {
  slug: string;
  label: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { slug: "seo", label: "SEO" },
  { slug: "google-ads", label: "Google Ads" },
  { slug: "social-media", label: "Social Media" },
  { slug: "web-design", label: "Web Design" },
  { slug: "content-marketing", label: "Content Marketing" },
  { slug: "email-marketing", label: "Email Marketing" },
  { slug: "local-seo", label: "Local SEO" },
  { slug: "analytics", label: "Analytics" },
];
