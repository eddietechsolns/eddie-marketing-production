import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, caseStudySchema } from "@/lib/schema";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { ExploreMoreSection } from "@/components/internal-links/ExploreMoreSection";
import Button from "@/components/ui/Button";
import { TrackPageView } from "@/components/analytics/TrackPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!cs) return { title: "Not Found" };
  return buildMetadata({
    title:
      cs.seoTitle ??
      `${cs.title} | Case Study — Eddie Marketing Solutions`,
    description:
      cs.seoDescription ??
      `Learn how ${cs.clientName ?? "our client"} achieved remarkable results with Eddie Marketing Solutions.`,
    path: `/case-studies/${slug}`,
  });
}

export async function generateStaticParams() {
  const caseStudies = await prisma.caseStudy.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return caseStudies;
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;

  const [cs, relatedCaseStudies, serviceCategories, industries] =
    await Promise.all([
      prisma.caseStudy.findUnique({ where: { slug } }),
      prisma.caseStudy.findMany({
        where: { status: "published", slug: { not: slug } },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          id: true,
          slug: true,
          title: true,
          industry: true,
          serviceType: true,
          trafficIncreasePercent: true,
          leadIncreasePercent: true,
          revenueGenerated: true,
          clientName: true,
        },
      }),
      prisma.serviceCategory.findMany({
        where: { status: "published" },
        select: { slug: true, name: true },
        orderBy: { name: "asc" },
        take: 6,
      }),
      prisma.industry.findMany({
        where: { status: "published" },
        select: { slug: true, title: true },
        orderBy: { title: "asc" },
        take: 8,
      }),
    ]);

  if (!cs || cs.status !== "published") notFound();

  const hasMetrics =
    cs.trafficIncreasePercent ||
    cs.leadIncreasePercent ||
    cs.conversionIncreasePercent ||
    cs.revenueGenerated;

  const metrics = [
    cs.trafficIncreasePercent && {
      value: `+${cs.trafficIncreasePercent}%`,
      label: "Organic Traffic",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    cs.leadIncreasePercent && {
      value: `+${cs.leadIncreasePercent}%`,
      label: "Leads Generated",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    cs.conversionIncreasePercent && {
      value: `+${cs.conversionIncreasePercent}%`,
      label: "Conversion Rate",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    cs.revenueGenerated && {
      value: cs.revenueGenerated,
      label: "Revenue Generated",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ].filter(Boolean) as {
    value: string;
    label: string;
    color: string;
    bg: string;
  }[];

  return (
    <>
      <TrackPageView
        event="case_study_view"
        params={{ case_study_slug: slug, client: cs.clientName, industry: cs.industry, service: cs.serviceType }}
      />
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
            { name: cs.title, path: `/case-studies/${slug}` },
          ]),
          caseStudySchema({
            title: cs.title,
            description: cs.seoDescription,
            path: `/case-studies/${slug}`,
            publishedAt: cs.publishedAt,
            modifiedAt: cs.updatedAt,
            image: cs.featuredImage,
            client: cs.clientName,
          }),
        ]}
      />

      {/* ── Section 1: Overview / Hero ──────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/case-studies"
              className="hover:text-slate-300 transition-colors"
            >
              Case Studies
            </Link>
            <span>/</span>
            <span className="text-slate-300 line-clamp-1">{cs.title}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-4">
            {cs.industry && (
              <Link
                href={`/case-studies?industry=${encodeURIComponent(cs.industry)}`}
                className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
              >
                {cs.industry}
              </Link>
            )}
            {cs.serviceType && (
              <Link
                href={`/case-studies?service=${encodeURIComponent(cs.serviceType)}`}
                className="text-xs font-medium px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors"
              >
                {cs.serviceType}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-4xl">
            {cs.title}
          </h1>

          {cs.clientName && (
            <p className="text-slate-400 mb-6">
              Client:{" "}
              <span className="text-slate-200 font-medium">{cs.clientName}</span>
              {cs.country && (
                <>
                  {" "}
                  &middot;{" "}
                  <span className="text-slate-200 font-medium">{cs.country}</span>
                </>
              )}
            </p>
          )}

          {/* Metrics block */}
          {hasMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
                >
                  <p className={`text-2xl md:text-3xl font-bold ${m.color}`}>
                    {m.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sections 2–6: Content ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Section 2: Challenge */}
            {cs.challenge && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-bold shrink-0">
                    1
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    The Challenge
                  </h2>
                </div>
                <div className="pl-11">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {cs.challenge}
                  </p>
                </div>
              </section>
            )}

            {/* Section 3: Strategy */}
            {cs.strategy && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold shrink-0">
                    2
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Our Strategy
                  </h2>
                </div>
                <div className="pl-11">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {cs.strategy}
                  </p>
                </div>
              </section>
            )}

            {/* Section 4: Implementation */}
            {cs.implementation && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 text-sm font-bold shrink-0">
                    3
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Implementation
                  </h2>
                </div>
                <div className="pl-11">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {cs.implementation}
                  </p>
                </div>
              </section>
            )}

            {/* Section 5: Results */}
            {(cs.results || hasMetrics) && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold shrink-0">
                    4
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Results</h2>
                </div>
                <div className="pl-11 space-y-6">
                  {hasMetrics && (
                    <div className="grid grid-cols-2 gap-3">
                      {metrics.map((m) => (
                        <div
                          key={m.label}
                          className={`${m.bg} rounded-xl p-4 text-center`}
                        >
                          <p
                            className={`text-2xl font-bold ${m.color}`}
                          >
                            {m.value}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {cs.results && (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {cs.results}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Section 6: Testimonial */}
            {cs.testimonial && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 text-sm font-bold shrink-0">
                    5
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Client Testimonial
                  </h2>
                </div>
                <div className="pl-11">
                  <blockquote className="relative bg-slate-50 rounded-xl p-6 border-l-4 border-teal-500">
                    <svg
                      className="absolute top-4 left-4 w-6 h-6 text-teal-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-slate-700 leading-relaxed italic pl-6">
                      {cs.testimonial}
                    </p>
                    {cs.clientName && (
                      <footer className="mt-3 pl-6">
                        <p className="text-sm font-semibold text-slate-900">
                          {cs.clientName}
                        </p>
                      </footer>
                    )}
                  </blockquote>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick facts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Quick Facts
              </h3>
              <dl className="space-y-3">
                {cs.clientName && (
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">
                      Client
                    </dt>
                    <dd className="text-sm text-slate-800 font-medium mt-0.5">
                      {cs.clientName}
                    </dd>
                  </div>
                )}
                {cs.industry && (
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">
                      Industry
                    </dt>
                    <dd className="text-sm text-slate-800 font-medium mt-0.5">
                      {cs.industry}
                    </dd>
                  </div>
                )}
                {cs.serviceType && (
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">
                      Service
                    </dt>
                    <dd className="text-sm text-slate-800 font-medium mt-0.5">
                      {cs.serviceType}
                    </dd>
                  </div>
                )}
                {cs.country && (
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">
                      Location
                    </dt>
                    <dd className="text-sm text-slate-800 font-medium mt-0.5">
                      {cs.country}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* CTA */}
            <div className="ems-gradient-bg rounded-xl p-6 text-white">
              <h3 className="text-base font-bold mb-2">
                Get Similar Results
              </h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                30 minutes with a senior strategist. No obligation, just
                actionable insights for your business.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                Book a Free Session
              </Button>
            </div>

            {/* Section 7: Related Services */}
            {serviceCategories.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Related Services
                </h3>
                <ul className="space-y-2.5">
                  {serviceCategories.map((svc) => (
                    <li key={svc.slug}>
                      <Link
                        href={`/services/${svc.slug}`}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-teal-500 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {svc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section 8: Related Industries */}
            {industries.length > 0 && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Industries We Serve
                </h3>
                <ul className="space-y-2">
                  {industries.map((ind) => (
                    <li key={ind.slug}>
                      <Link
                        href={`/industries/${ind.slug}`}
                        className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {ind.title} &rarr;
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Case Studies */}
        {relatedCaseStudies.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              More Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCaseStudies.map((related) => (
                <Link
                  key={related.id}
                  href={`/case-studies/${related.slug}`}
                  className="group p-5 bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
                >
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {related.industry && (
                      <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                        {related.industry}
                      </span>
                    )}
                    {related.serviceType && (
                      <span className="text-xs font-medium px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">
                        {related.serviceType}
                      </span>
                    )}
                  </div>
                  {related.clientName && (
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">
                      {related.clientName}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-3">
                    {related.title}
                  </h3>
                  {(related.trafficIncreasePercent ||
                    related.leadIncreasePercent ||
                    related.revenueGenerated) && (
                    <div className="flex gap-3 text-xs">
                      {related.trafficIncreasePercent && (
                        <span className="font-bold text-teal-600">
                          +{related.trafficIncreasePercent}% traffic
                        </span>
                      )}
                      {related.leadIncreasePercent && (
                        <span className="font-bold text-blue-600">
                          +{related.leadIncreasePercent}% leads
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ExploreMoreSection
        eyebrow="Explore More"
        title="More Resources for UAE Business Growth"
        exclude={["/case-studies"]}
      />

      {/* Section 9: Contact CTA */}
      <LeadCaptureSection
        title={`Get Results Like ${cs.clientName ?? "Our Clients"}`}
        description="Tell us about your business and goals. We&apos;ll build a custom strategy to match."
        submitLabel="Request a Free Proposal"
        eyebrow="Free Strategy Session"
        defaultService={cs.serviceType ?? undefined}
      />
    </>
  );
}
