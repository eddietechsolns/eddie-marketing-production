// ─── Internship Hub & Child Page classification ────────────────────────────
// Hub:   /internships
// Child: any slug ending in "-internship" (e.g. digital-marketing-internship)

export const INTERNSHIP_HUB_SLUG = "internships";

export function isInternshipHub(slug: string): boolean {
  return slug === INTERNSHIP_HUB_SLUG;
}

export function isInternshipChild(slug: string): boolean {
  return slug !== INTERNSHIP_HUB_SLUG && slug.endsWith("-internship");
}

// ─── Card metadata ─────────────────────────────────────────────────────────

export interface InternshipCard {
  slug: string;
  title: string;
  department: string;
  description: string;
  duration: string;
  location: string;
  employmentType: string;
  experience: string;
}

function deriveDepartment(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("seo") || t.includes("ppc") || t.includes("google ads")) return "Performance Marketing";
  if (t.includes("social media")) return "Social Media";
  if (t.includes("content") || t.includes("writing") || t.includes("copywriting")) return "Content & Copywriting";
  if (t.includes("graphic") || t.includes("design") || t.includes("ui") || t.includes("ux")) return "Creative & Design";
  if (t.includes("web dev") || t.includes("web development")) return "Technology";
  if (t.includes("analytics") || t.includes("data")) return "Analytics & Data";
  if (t.includes("email")) return "Email Marketing";
  if (t.includes("digital marketing")) return "Digital Marketing";
  return "Marketing";
}

function deriveDescription(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("seo")) return "Learn technical SEO, keyword research, link building, and on-page optimisation for UAE clients.";
  if (t.includes("google ads") || t.includes("ppc")) return "Build, manage, and optimise Google Ads campaigns across Search, Display, and Shopping.";
  if (t.includes("social media")) return "Plan and execute social media strategies across Instagram, LinkedIn, TikTok, and Facebook.";
  if (t.includes("content") || t.includes("writing")) return "Create high-impact blog posts, landing pages, and marketing copy for B2B and B2C clients.";
  if (t.includes("graphic") || t.includes("design")) return "Design brand assets, social visuals, and campaign creatives using industry-standard tools.";
  if (t.includes("web dev")) return "Build and maintain client websites using WordPress, HTML/CSS, and modern web frameworks.";
  if (t.includes("analytics") || t.includes("data")) return "Analyse campaign performance using Google Analytics 4, Looker Studio, and Excel.";
  if (t.includes("email")) return "Design and automate email campaigns using industry-leading platforms for measurable results.";
  if (t.includes("ui") || t.includes("ux")) return "Design intuitive user interfaces and experiences for web and mobile marketing assets.";
  return "Gain hands-on experience in a high-growth digital marketing environment in the UAE.";
}

export function deriveInternshipCard(slug: string, title: string): InternshipCard {
  return {
    slug,
    title,
    department: deriveDepartment(title),
    description: deriveDescription(title),
    duration: "3–6 Months",
    location: "Dubai, UAE · Hybrid",
    employmentType: "Internship",
    experience: "Students & Recent Graduates",
  };
}

export function getInternshipCards(
  allPages: { slug: string; title: string }[]
): InternshipCard[] {
  return allPages
    .filter((p) => isInternshipChild(p.slug))
    .map((p) => deriveInternshipCard(p.slug, p.title))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getRelatedInternships(
  currentSlug: string,
  allPages: { slug: string; title: string }[]
): InternshipCard[] {
  return allPages
    .filter((p) => isInternshipChild(p.slug) && p.slug !== currentSlug)
    .map((p) => deriveInternshipCard(p.slug, p.title))
    .slice(0, 4);
}
