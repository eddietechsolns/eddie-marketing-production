import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "Digital Marketing Services",
  description:
    "Explore our full suite of digital marketing services including SEO, Google Ads, social media, web design, and more.",
  path: "/services",
});

// Keyword map: category slug → title keywords used to count imported Page records
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  analytics: ["Analytics", "Google Analytics", "GA4", "Tag Manager", "Search Console", "Looker", "Tableau", "Reporting"],
  "content-marketing": ["Content Marketing", "Content Creation", "Blog Writing", "Copywriting", "Sponsored Content", "Business Writing", "Product Pages"],
  "email-marketing": ["Email Marketing", "Email Campaign", "Newsletter", "Email"],
  "local-seo": ["Google My Business", "Bing Places", "Local SEO", "Local Search", "Agency for Local Search"],
  "web-design": ["Website Development", "Web Design", "WordPress", "Shopify", "Joomla", "Squarespace", "HTML5", "Responsive"],
  "google-ads": ["Google Adwords", "Adwords Management", "Pay Per Click", "PPC", "Display Advertising", "Bing Ads", "Remarketing"],
  seo: ["On Page SEO", "On-Page SEO", "Link Building", "SEO Analysis", "Off Page SEO", "Keyword Research", "SEO Packages", "SEO Strategy"],
  "social-media": ["Facebook Advertising", "Instagram Advertising", "LinkedIn Advertising", "Snapchat Advertising", "YouTube Advertising", "Twitter Marketing", "Paid Social"],
};

const EXCLUDE_KEYWORDS = ["case study", "case-study", "training", "course"];

export default async function ServicesPage() {
  // Fetch service counts + all published page titles in one go
  const [categories, allPages] = await Promise.all([
    prisma.serviceCategory.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" },
      include: { _count: { select: { services: true } } },
    }),
    prisma.page.findMany({
      where: { status: "published" },
      select: { title: true },
    }),
  ]);

  // Build page count map per category slug using keyword matching (in-memory)
  function countPagesForCategory(slug: string): number {
    const keywords = CATEGORY_KEYWORDS[slug];
    if (!keywords) return 0;
    return allPages.filter((p) => {
      const title = p.title.toLowerCase();
      if (EXCLUDE_KEYWORDS.some((ex) => title.includes(ex))) return false;
      return keywords.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));
    }).length;
  }

  // Build enriched categories with total count + label
  const enrichedCategories = categories.map((cat) => {
    const serviceCount = cat._count.services;
    const pageCount = countPagesForCategory(cat.slug);
    const total = serviceCount + pageCount;
    const label =
      total === 0
        ? ""
        : serviceCount > 0 && pageCount === 0
        ? `${total} service${total !== 1 ? "s" : ""}`
        : `${total} resource${total !== 1 ? "s" : ""}`;
    return { ...cat, totalCount: total, countLabel: label };
  });

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/services#page`,
            name: `Digital Marketing Services | ${SITE_NAME}`,
            url: `${SITE_URL}/services`,
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="bg-slate-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Services</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            What We Do
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            Digital Marketing Services That Drive Results
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            We offer a comprehensive range of digital marketing services designed
            to grow your business online — from search and paid media to web design and analytics.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">
            Get a Free Strategy Session
          </Button>
        </div>
      </div>

      {/* Service categories grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Browse by Service</h2>
        <p className="text-slate-500 mb-8">Select a service area to explore our capabilities and case studies.</p>

        {enrichedCategories.length === 0 ? (
          <p className="text-slate-500">No services available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/services/${category.slug}`}
                className="group block p-6 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{category.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {category.countLabel}
                  </span>
                  <span className="text-sm text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Get Started</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Not sure which service is right for you?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy session. We&apos;ll audit your current marketing and recommend exactly what will move the needle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">Book a Free Consultation</Button>
            <Button variant="ghost" size="lg" href="/portfolio" className="text-slate-400 hover:text-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
