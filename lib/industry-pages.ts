/**
 * Industry → imported Page classification and matching.
 *
 * Classification happens at render time with zero DB schema changes.
 * Keyword matching is case-insensitive title substring search.
 */

export type PageCategory = "industry" | "service" | "location" | "resource" | "other";

export interface PageStub {
  slug: string;
  title: string;
}

// ─── Location keywords ─────────────────────────────────────────────────────────
// Titles containing any of these phrases are classified as location pages.
const LOCATION_TITLE_KEYWORDS = [
  "al azra", "al basha", "al bateen", "al buheira", "al danah", "al falah",
  "al fayha", "al fisht", "al garhoud", "al ghafia", "al hamidiya", "al hazannah",
  "al jazzat", "al jerf", "al jurf", "al karama", "al khalidiyah", "al khan",
  "al layyeh", "al maffraq", "al majaz", "al manhal", "al mankhool", "al markaziyah",
  "al maryah island", "al mina", "al mirgab", "al mowaihat", "al muneera", "al muroor",
  "al mushrif", "al nahda", "al nahyan", "al najda", "al nakheel", "al nakhil",
  "al nuaimiya", "al nud", "al owan", "al qadisiya", "al qasba", "al quoz",
  "al qusaidat", "al raha", "al ramla", "al raqaib", "al rawda", "al reem island",
  "al rifaa", "al rigga", "al rolla", "al rowdah", "al safa", "al satwa",
  "al shahba", "al shamkha", "al sharq", "al suyoh", "al taawun", "al tallah",
  "al yarmook", "al zahiyah", "al zahra",
  "abu dhabi cities", "ajman cities", "ajman corniche",
  "bur dubai", "business bay", "corniche area", "deira marketing",
  "discovery gardens", "downtown dubai", "dubai cities", "dubai design district",
  "dubai festival city", "dubai healthcare city", "dubai international city",
  "dubai investment park", "dubai marina", "dubai production city",
  "dubai silicon oasis", "dubai sports city",
  "international media production zone", "jumeirah lake towers",
  "jumeirah village circle", "jumeirah marketing",
  "khalifa city", "madinat zayed", "masfout", "motor city", "mushairef",
  "muwaileh", "palm jumeirah", "ras al khaima", "saadiyat island",
  "sharjah cities", "yas island",
];

// Countries / regions — standalone titles that are location pages
const LOCATION_STANDALONE = new Set([
  "bahrain", "canada", "kenya", "oman", "qatar", "saudi arabia",
  "south africa", "tanzania", "uganda", "uk", "usa",
]);

// ─── Service keywords ──────────────────────────────────────────────────────────
const SERVICE_TITLE_KEYWORDS = [
  "seo analysis", "keyword research", "link building", "on page seo", "off page seo",
  "google adwords", "google ads training", "google ads certifications",
  "pay per click", "ppc management", "ppc glossary",
  "facebook advertising", "instagram advertising", "linkedin advertising",
  "snapchat advertising", "youtube advertising", "twitter marketing",
  "display advertising", "programmatic advertising", "remarketing services",
  "google analytics", "google tag manager", "google search console",
  "conversion rate optimization", "advanced website tracking",
  "web development dubai", "web design case", "html5 web development",
  "shopify web development", "shopify web developer",
  "wordpress website development", "wordpress web developer",
  "magento web development", "joomla web development", "squarespace web development",
  "graphic design", "videography", "professional photography",
  "custom content creation", "sponsored content", "website blog writing",
  "product pages for ecommerce", "geo landing pages", "local seo packages",
  "agency for local search", "search engine marketing", "search engine optimization",
  "effective seo services", "seo services in dubai", "dubai seo",
  "seo approach", "seo packages", "seo pricing",
  "online reputation management", "geofencing", "live chat solutions",
  "domain name checker", "website testing", "website hosting",
  "website backups", "website migrations", "website updates",
  "credit card processing", "google adsense", "google ad manager",
  "analytics and reporting", "tableau", "adobe analytics",
  "application development", "paid social media", "digital advertising",
  "digital marketing consulting", "digital marketing agency", "content marketing strategy",
  "email marketing", "content creation packages",
  "digital marketing training", "bing ads training", "wordpress training",
  "facebook ads training", "google analytics 4 training",
  "seo glossary", "ppc glossary",
  "check your seo", "seo score",
  "affiliate marketing",
  "landing page optim",
  "email marketing services",
  "google shopping",
  "bing advertising",
  "twitter advertising",
  "youtube advertising",
];

// ─── Resource keywords ─────────────────────────────────────────────────────────
const RESOURCE_TITLE_KEYWORDS = [
  "training", "glossary", "guide", "course", "certification",
];

// ─── Industry keyword map ──────────────────────────────────────────────────────
// Each industry slug maps to a list of case-insensitive title substrings.
// A page matches if its title contains ANY of the keywords.
export const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  healthcare: [
    "healthcare advertising", "healthcare marketing",
    "hospital advertising", "physician advertising", "doctor advertising",
    "medical practitioners", "medical supply", "cardiologist",
    "ob/gyn", "mental health professional",
    "pharmaceutical", "plastic surgeon", "surgeon marketing",
    "chiropractor", "podiatrist", "ambulatory services",
    "assisted living", "dentist advertising",
    "massage therapist", "fitness industry", "gym advertising",
    "personal trainer", "spa advertising",
  ],
  legal: [
    "lawyers advertising", "law firm", "attorney",
  ],
  "real-estate": [
    "real estate digital", "real estate advertising",
    "commercial real estate advertising", "home builder advertising",
    "mortgage companies",
  ],
  "home-services": [
    "hvac", "plumber advertising", "plumbing advertising",
    "electricians advertising", "carpet cleaning",
    "landscape business", "lawn and garden", "pest control",
    "locksmith advertising", "painting companies",
    "pressure washing", "roofing companies",
    "flooring advertising", "garden supply store",
    "scaffolding companies", "septic and plumbing",
    "window and door",
  ],
  education: [
    "education digital marketing", "nursery schools", "elearning services",
  ],
  finance: [
    "financial marketing agency", "insurance advertising",
    "credit unions advertising", "hedge fund advertising",
    "life insurance agency", "marketing for accountant",
    "bank marketing", "mortgage companies advertising",
  ],
  construction: [
    "construction marketing", "contractors digital marketing",
    "heavy equipment marketing", "manufacturing companies advertising",
    "machinery advertising", "fabricated metals advertising",
    "tool and die", "industrial", "warehousing advertising",
    "transportation business advertising", "transportation advertising",
    "trucking companies", "waste management advertising",
  ],
  hospitality: [
    "tourism and hospitality", "hotel advertising",
    "travel companies advertising", "cruise lines advertising",
    "restaurants digital marketing", "bar and nightclub",
    "musician advertising", "musician marketing",
    "dj advertising", "band advertising", "entertainment venue",
  ],
  ecommerce: [
    "retail companies advertising", "consumer packaged goods",
    "fashion brands advertising", "wine advertising",
    "jewelry advertising", "skincare advertising",
    "beauty lines advertising", "cosmetics advertising",
  ],
  tech: [
    "saas advertising", "software companies advertising",
    "crypto business advertising",
    "b2b advertising", "b2b marketing",
  ],
  nonprofit: [
    "nonprofit organisations advertising", "nonprofit advertising",
    "nonprofit marketing", "nonprofit search engine optimization",
    "non-profit advertising", "charitable organisations", "charity advertising",
  ],
  faith: [
    "mosques advertising", "mosque advertising", "mosque marketing",
    "advertising for temples", "temple advertising", "temple marketing",
    "faith-based advertising", "religious advertising", "church advertising",
  ],
};

// Pages whose titles exactly match these prefixes are "other" (utility/admin/WP)
const OTHER_SLUGS = new Set([
  "about-us", "contact-us", "multiple-addresses", "careers", "cart", "checkout",
  "my-account", "shop", "wishlist", "maintenance", "confirmation",
  "receipt", "transaction-failed", "order-history", "products", "pricing-table",
  "refund-and-returns-policy", "terms-and-conditions", "cookie-policy-eu",
  "our-privacy-policy", "html-sitemap", "lost-and-found", "our-blogs",
  "our-portifolio", "news", "our-locations", "our-team", "new-about-us",
  "new-home-page", "new-services", "softwares", "services",
  "digital-marketing-landing", "website-landingpage", "summary-of-eddie-tech-solutions",
  "partner-with-eddie-tech-solutions-today", "we-are-certified-google-partners",
  "how-to-make-a-payment", "internships",
]);

// ─── Classification ─────────────────────────────────────────────────────────────

export function classifyPage(slug: string, title: string): PageCategory {
  const t = title.toLowerCase();
  const s = slug.toLowerCase();

  if (OTHER_SLUGS.has(s)) return "other";

  // Location — standalone country/region pages
  if (LOCATION_STANDALONE.has(t)) return "location";

  // Location — title contains a known location phrase
  if (LOCATION_TITLE_KEYWORDS.some((kw) => t.includes(kw))) return "location";

  // Service — specific digital marketing service titles (checked before resource
  // so "Bing Ads Training" / "Digital Marketing Training" match SERVICE first)
  if (SERVICE_TITLE_KEYWORDS.some((kw) => t.includes(kw))) return "service";

  // Industry — matches any industry keyword
  for (const keywords of Object.values(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => t.includes(kw.toLowerCase()))) return "industry";
  }

  // Resource — training, glossary, guide (after service + industry to avoid
  // false positives on service training pages and industry guide pages)
  if (RESOURCE_TITLE_KEYWORDS.some((kw) => t.includes(kw))) return "resource";

  return "other";
}

// ─── Industry page matching ────────────────────────────────────────────────────

/**
 * Return all pages from `allPages` that are relevant to the given industry slug.
 * Sorted alphabetically by title. Deduplicates by slug.
 */
export function getIndustryPages(
  industrySlug: string,
  allPages: PageStub[]
): PageStub[] {
  const keywords = INDUSTRY_KEYWORDS[industrySlug];
  if (!keywords) return [];

  const kwLower = keywords.map((k) => k.toLowerCase());
  const seen = new Set<string>();
  const result: PageStub[] = [];

  for (const page of allPages) {
    if (seen.has(page.slug)) continue;
    const t = page.title.toLowerCase();
    if (kwLower.some((kw) => t.includes(kw))) {
      seen.add(page.slug);
      result.push(page);
    }
  }

  return result.sort((a, b) => a.title.localeCompare(b.title));
}

// ─── Industry lookup (page → industry) ────────────────────────────────────────

/** Human-readable names for each industry slug */
export const INDUSTRY_DISPLAY_NAMES: Record<string, string> = {
  healthcare: "Healthcare",
  legal: "Legal",
  "real-estate": "Real Estate",
  "home-services": "Home Services",
  education: "Education",
  finance: "Finance",
  construction: "Construction",
  hospitality: "Hospitality",
  ecommerce: "E-Commerce",
  tech: "Tech & SaaS",
  nonprofit: "Nonprofit",
  faith: "Faith & Community",
};

/**
 * Given an imported page title, return the industry slug it belongs to,
 * or null if it doesn't match any industry.
 */
export function findIndustryForPage(title: string): string | null {
  const t = title.toLowerCase();
  for (const [industrySlug, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => t.includes(kw.toLowerCase()))) return industrySlug;
  }
  return null;
}

// ─── Service clusters ──────────────────────────────────────────────────────────

/**
 * Groups of related service pages by topic.
 * A service page belongs to a cluster if its title contains any of the cluster's keywords.
 */
export const SERVICE_CLUSTERS: Record<string, string[]> = {
  SEO: [
    "seo analysis", "on page seo", "off page seo", "keyword research",
    "link building", "seo packages", "local seo", "seo approach",
    "effective seo", "seo strategy", "search engine optimization",
  ],
  "Google Ads": [
    "google adwords", "pay per click", "ppc management", "bing ads",
    "advertise on bing", "search engine marketing",
  ],
  "Social Media": [
    "facebook advertising", "instagram advertising", "linkedin advertising",
    "snapchat advertising", "twitter marketing", "youtube advertising",
    "paid social media",
  ],
  "Web Development": [
    "web development", "website development", "shopify web",
    "wordpress website", "wordpress web developer", "html5 web", "magento web", "joomla web",
    "squarespace web", "application development",
  ],
  "Digital Marketing": [
    "digital marketing agency", "digital marketing consulting",
  ],
  "Content Marketing": [
    "custom content creation", "content marketing", "website blog writing",
    "sponsored content", "content creation packages",
  ],
  Analytics: [
    "analytics and reporting", "google analytics", "google tag manager",
    "adobe analytics", "tableau", "advanced website tracking",
    "google search console",
  ],
  "Display & Programmatic": [
    "display advertising", "programmatic advertising",
    "remarketing services", "geofencing",
  ],
  "Local Marketing": [
    "google my business", "agency for local search",
    "geo landing pages", "local search",
  ],
  Design: [
    "graphic design", "professional photography", "videography",
  ],
  "Email Marketing": [
    "email marketing",
  ],
  "Conversion Rate Optimisation": [
    "conversion rate optim",
    "landing page optim",
  ],
  "Reputation Management": [
    "online reputation management",
    "affiliate marketing",
  ],
};

/** Return the cluster name a page belongs to, or null. */
export function getServiceClusterName(title: string): string | null {
  const t = title.toLowerCase();
  for (const [cluster, keywords] of Object.entries(SERVICE_CLUSTERS)) {
    if (keywords.some((kw) => t.includes(kw))) return cluster;
  }
  return null;
}

/**
 * Return all pages from `allPages` that share the same service cluster as
 * the page with the given title.  Sorted alphabetically.  Excludes the source page.
 */
export function getServiceClusterPages(
  pageTitle: string,
  currentSlug: string,
  allPages: PageStub[]
): PageStub[] {
  const cluster = getServiceClusterName(pageTitle);
  if (!cluster) return [];
  const keywords = SERVICE_CLUSTERS[cluster].map((k) => k.toLowerCase());
  const seen = new Set<string>();
  const result: PageStub[] = [];
  for (const page of allPages) {
    if (page.slug === currentSlug || seen.has(page.slug)) continue;
    const t = page.title.toLowerCase();
    if (keywords.some((kw) => t.includes(kw))) {
      seen.add(page.slug);
      result.push(page);
    }
  }
  return result.sort((a, b) => a.title.localeCompare(b.title));
}

// ─── Classification summary ────────────────────────────────────────────────────

export interface ClassificationSummary {
  industry: PageStub[];
  service: PageStub[];
  location: PageStub[];
  resource: PageStub[];
  other: PageStub[];
}

export function classifyAllPages(pages: PageStub[]): ClassificationSummary {
  const summary: ClassificationSummary = {
    industry: [],
    service: [],
    location: [],
    resource: [],
    other: [],
  };

  for (const page of pages) {
    const category = classifyPage(page.slug, page.title);
    summary[category].push(page);
  }

  return summary;
}
