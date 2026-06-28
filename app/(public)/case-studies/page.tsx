import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { ExploreMoreSection } from "@/components/internal-links/ExploreMoreSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { industry, service } = await searchParams;
  const isFiltered = !!(industry || service);

  const base = buildMetadata({
    title: "Case Studies — Proven Digital Marketing Results",
    description:
      "Explore real results from our digital marketing campaigns across UAE, GCC & Europe. SEO, Google Ads, social media, and more.",
    path: "/case-studies",
  });

  if (isFiltered) {
    return {
      ...base,
      robots: { index: false, follow: true },
      alternates: { canonical: "/case-studies" },
    };
  }

  return base;
}

const GRADIENT_PALETTES = [
  "from-blue-600 to-blue-800",
  "from-slate-700 to-slate-900",
  "from-teal-600 to-blue-800",
  "from-emerald-600 to-emerald-800",
  "from-violet-600 to-violet-800",
  "from-sky-600 to-sky-800",
];

interface SearchParams {
  industry?: string;
  service?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function CaseStudiesHubPage({ searchParams }: Props) {
  const { industry: industryFilter, service: serviceFilter } =
    await searchParams;

  const [caseStudies, industries, services] = await Promise.all([
    prisma.caseStudy.findMany({
      where: {
        status: "published",
        ...(industryFilter ? { industry: industryFilter } : {}),
        ...(serviceFilter ? { serviceType: serviceFilter } : {}),
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published", industry: { not: null } },
      select: { industry: true },
      distinct: ["industry"],
      orderBy: { industry: "asc" },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published", serviceType: { not: null } },
      select: { serviceType: true },
      distinct: ["serviceType"],
      orderBy: { serviceType: "asc" },
    }),
  ]);

  const uniqueIndustries = industries
    .map((c) => c.industry)
    .filter(Boolean) as string[];
  const uniqueServices = services
    .map((c) => c.serviceType)
    .filter(Boolean) as string[];

  const featured = caseStudies.filter(
    (c) =>
      c.trafficIncreasePercent ||
      c.leadIncreasePercent ||
      c.revenueGenerated
  );
  const latest = caseStudies;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
          ]),
          collectionPageSchema({
            title: "Case Studies — Proven Digital Marketing Results",
            path: "/case-studies",
            description:
              "Real results from digital marketing campaigns across UAE, GCC & Europe.",
          }),
        ]}
      />

      {/* Hero */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-300">Case Studies</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Proven Results
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            Real Campaigns. Real Results.
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Every case study is backed by data. Explore how we&apos;ve helped
            businesses across UAE, GCC &amp; Europe grow through SEO, Google
            Ads, social media, and web design.
          </p>
          {/* Stats bar */}
          <div className="flex flex-wrap gap-8">
            {[
              { value: "50+", label: "Clients Served" },
              { value: "312%", label: "Avg Traffic Growth" },
              { value: "AED 2M+", label: "Revenue Generated" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      {(uniqueIndustries.length > 0 || uniqueServices.length > 0) && (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center gap-6">
              {uniqueIndustries.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Industry:
                  </span>
                  <Link
                    href="/case-studies"
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      !industryFilter
                        ? "bg-slate-900 text-white border-slate-900"
                        : "border-slate-300 text-slate-600 hover:border-slate-500"
                    }`}
                  >
                    All
                  </Link>
                  {uniqueIndustries.map((ind) => (
                    <Link
                      key={ind}
                      href={`/case-studies?industry=${encodeURIComponent(ind)}${serviceFilter ? `&service=${encodeURIComponent(serviceFilter)}` : ""}`}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        industryFilter === ind
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-300 text-slate-600 hover:border-slate-500"
                      }`}
                    >
                      {ind}
                    </Link>
                  ))}
                </div>
              )}
              {uniqueServices.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Service:
                  </span>
                  <Link
                    href={`/case-studies${industryFilter ? `?industry=${encodeURIComponent(industryFilter)}` : ""}`}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      !serviceFilter
                        ? "bg-slate-900 text-white border-slate-900"
                        : "border-slate-300 text-slate-600 hover:border-slate-500"
                    }`}
                  >
                    All
                  </Link>
                  {uniqueServices.map((svc) => (
                    <Link
                      key={svc}
                      href={`/case-studies?service=${encodeURIComponent(svc)}${industryFilter ? `&industry=${encodeURIComponent(industryFilter)}` : ""}`}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        serviceFilter === svc
                          ? "bg-teal-600 text-white border-teal-600"
                          : "border-slate-300 text-slate-600 hover:border-slate-500"
                      }`}
                    >
                      {svc}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {latest.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg mb-4">
              No case studies found for these filters.
            </p>
            <Link
              href="/case-studies"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Clear filters →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                  Success Stories
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {industryFilter
                    ? `${industryFilter} Case Studies`
                    : serviceFilter
                    ? `${serviceFilter} Results`
                    : "All Case Studies"}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {latest.length} result{latest.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((cs, i) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
                >
                  {/* Card header */}
                  <div
                    className={`h-40 bg-gradient-to-br ${GRADIENT_PALETTES[i % GRADIENT_PALETTES.length]} relative overflow-hidden flex items-end p-4`}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {cs.industry && (
                        <span className="text-xs font-medium text-white/90 bg-black/25 px-2.5 py-1 rounded-full">
                          {cs.industry}
                        </span>
                      )}
                      {cs.serviceType && (
                        <span className="text-xs font-medium text-white/90 bg-black/25 px-2.5 py-1 rounded-full">
                          {cs.serviceType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrics strip */}
                  {(cs.trafficIncreasePercent ||
                    cs.leadIncreasePercent ||
                    cs.revenueGenerated) && (
                    <div className="flex divide-x divide-slate-100 border-b border-slate-100 bg-slate-50">
                      {cs.trafficIncreasePercent && (
                        <div className="flex-1 py-2 text-center">
                          <p className="text-sm font-bold text-teal-600">
                            +{cs.trafficIncreasePercent}%
                          </p>
                          <p className="text-[10px] text-slate-500">Traffic</p>
                        </div>
                      )}
                      {cs.leadIncreasePercent && (
                        <div className="flex-1 py-2 text-center">
                          <p className="text-sm font-bold text-blue-600">
                            +{cs.leadIncreasePercent}%
                          </p>
                          <p className="text-[10px] text-slate-500">Leads</p>
                        </div>
                      )}
                      {cs.revenueGenerated && (
                        <div className="flex-1 py-2 text-center">
                          <p className="text-sm font-bold text-emerald-600 truncate px-1">
                            {cs.revenueGenerated}
                          </p>
                          <p className="text-[10px] text-slate-500">Revenue</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {cs.clientName && (
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        {cs.clientName}
                      </p>
                    )}
                    <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                      {cs.title}
                    </h3>
                    {cs.results && (
                      <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-3">
                        {cs.results}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 gap-1">
                      Read case study
                      <svg
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <ExploreMoreSection
        eyebrow="Explore More"
        title="Free Tools, Guides & Services for UAE Businesses"
        exclude={["/case-studies"]}
      />

      {/* Lead capture */}
      <LeadCaptureSection
        title="Ready to Write Your Own Success Story?"
        description="Book a free strategy session. We&apos;ll show you exactly how we&apos;d approach your growth — no commitment required."
        submitLabel="Get a Free Strategy Session"
        eyebrow="Free Consultation"
      />
    </>
  );
}
