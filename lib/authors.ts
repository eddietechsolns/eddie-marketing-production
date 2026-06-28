export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  linkedInUrl: string | null;
  imageUrl: string | null;
}

export const AUTHORS: Author[] = [
  {
    slug: "eddie-marketing-director",
    name: "Eddie — Marketing Director",
    role: "Founder & Marketing Director",
    bio: "Founder of Eddie Marketing Solutions FZE, with over 12 years of experience building and scaling digital marketing programmes for businesses across the UAE, GCC, and Europe. Specialises in integrated digital strategy, brand positioning, and revenue-focused campaign architecture for B2B and B2C clients.",
    credentials: [
      "Google Ads Certified",
      "Meta Blueprint Certified",
      "12+ years in UAE digital marketing",
    ],
    linkedInUrl: null,
    imageUrl: null,
  },
  {
    slug: "sarah-rahman-seo",
    name: "Sarah Rahman",
    role: "Head of SEO",
    bio: "Head of SEO at Eddie Marketing Solutions FZE, overseeing organic search strategy for clients across real estate, healthcare, hospitality, and professional services. Specialises in technical SEO, content cluster architecture, Arabic-English multilingual SEO, and local search optimisation for UAE markets.",
    credentials: [
      "Google Analytics 4 Certified",
      "SEMrush SEO Certified",
      "HubSpot Content Marketing Certified",
      "8+ years in SEO",
    ],
    linkedInUrl: null,
    imageUrl: null,
  },
  {
    slug: "marcus-webb-ppc",
    name: "Marcus Webb",
    role: "Head of Paid Media",
    bio: "Head of Paid Media at Eddie Marketing Solutions FZE, managing Google Ads, Meta Ads, TikTok Ads, and LinkedIn Ads campaigns for clients across UAE, GCC, and European markets. Specialises in performance-driven paid media strategies, tCPA and tROAS bidding optimisation, and cross-channel attribution for B2B and e-commerce accounts.",
    credentials: [
      "Google Ads Certified (Search, Display, Shopping, YouTube)",
      "Meta Blueprint Certified",
      "LinkedIn Marketing Solutions Certified",
      "7+ years in paid media",
    ],
    linkedInUrl: null,
    imageUrl: null,
  },
];

export function getAuthorBySlug(slug: string): Author | null {
  return AUTHORS.find((a) => a.slug === slug) ?? null;
}

export function getAuthorByName(name: string): Author | null {
  return AUTHORS.find(
    (a) => a.name.toLowerCase() === name.toLowerCase()
  ) ?? null;
}
