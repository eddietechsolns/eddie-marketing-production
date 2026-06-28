import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { getIndustryPages, INDUSTRY_KEYWORDS } from "@/lib/industry-pages";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description:
    "Eddie Marketing Solutions delivers specialized digital marketing strategies for healthcare, legal, real estate, home services, and more.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const [industries, allPages] = await Promise.all([
    prisma.industry.findMany({
      where: { status: "published" },
      orderBy: { title: "asc" },
      select: { id: true, slug: true, title: true, excerpt: true },
    }),
    prisma.page.findMany({
      where: { status: "published" },
      orderBy: { title: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/industries#page`,
            name: `Industries We Serve | ${SITE_NAME}`,
            url: `${SITE_URL}/industries`,
            description:
              "Specialized digital marketing strategies for every industry sector.",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="bg-slate-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Industries</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Sector Expertise
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            Digital Marketing for Every Industry
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Every sector has different buyers, compliance requirements, and competitive dynamics.
            We build strategies tailored to your industry — not generic playbooks.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">
            Get an Industry-Specific Strategy
          </Button>
        </div>
      </div>

      {/* Industries grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {industries.length === 0 ? (
          <p className="text-slate-500">No industries listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => {
              const pageCount = getIndustryPages(industry.slug, allPages).length;
              return (
                <Link
                  key={industry.id}
                  href={`/industries/${industry.slug}`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {industry.title}
                    </h2>
                    {pageCount > 0 && (
                      <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full shrink-0 ml-2 mt-0.5">
                        {pageCount} resources
                      </span>
                    )}
                  </div>
                  {industry.excerpt && (
                    <p className="text-sm text-slate-500 line-clamp-3 flex-1">
                      {industry.excerpt}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-sm text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                    Explore resources &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Resource directory — grouped by industry */}
      {industries.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                Content Hub
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Industry Resource Directory
              </h2>
              <p className="text-slate-500 mt-2 max-w-xl">
                Explore our library of industry-specific guides, landing pages, and marketing resources — all free.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry) => {
                const pages = getIndustryPages(industry.slug, allPages).slice(0, 6);
                if (pages.length === 0) return null;
                const totalCount = getIndustryPages(industry.slug, allPages).length;
                return (
                  <div key={industry.id}>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="block text-sm font-bold text-slate-900 hover:text-blue-700 mb-3 transition-colors"
                    >
                      {industry.title} &rarr;
                    </Link>
                    <ul className="space-y-1.5">
                      {pages.map((page) => (
                        <li key={page.slug}>
                          <Link
                            href={`/${page.slug}`}
                            className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-start gap-1.5"
                          >
                            <span className="text-teal-500 shrink-0 mt-0.5">›</span>
                            {page.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {totalCount > 6 && (
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="block mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        +{totalCount - 6} more →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Get Started</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Don&apos;t see your industry?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            We work with businesses across all sectors. Contact us and we&apos;ll show you what
            results look like for your specific market.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">Talk to a Strategist</Button>
        </div>
      </div>
    </>
  );
}
