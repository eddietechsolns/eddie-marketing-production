import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { TrackPageView } from "@/components/analytics/TrackPageView";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { category: { select: { slug: true } } },
  });
  if (!service || service.status !== "published") return { title: "Not Found" };
  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.excerpt,
    path: `/services/${category}/${slug}`,
  });
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { status: "published" },
    select: { slug: true, category: { select: { slug: true } } },
  });
  return services.map((s) => ({
    category: s.category?.slug ?? "uncategorized",
    slug: s.slug,
  }));
}

export default async function ServicePage({ params }: Props) {
  const { category, slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { category: { select: { name: true, slug: true } } },
  });

  if (!service || service.status !== "published") notFound();

  const catName = service.category?.name ?? category;
  const catSlug = service.category?.slug ?? category;

  const relatedCaseStudies = await prisma.caseStudy.findMany({
    where: { status: "published", serviceType: catName },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      clientName: true,
      industry: true,
      trafficIncreasePercent: true,
      leadIncreasePercent: true,
      revenueGenerated: true,
    },
  });

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            title: service.title,
            description: service.excerpt,
            path: `/services/${catSlug}/${slug}`,
            category: catSlug,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: catName, path: `/services/${catSlug}` },
            { name: service.title, path: `/services/${catSlug}/${slug}` },
          ]),
        ]}
      />
      <TrackPageView event="service_page_view" params={{ service_slug: slug, category: catSlug, service_name: service.title }} />

      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-slate-300 transition-colors">Services</Link>
            <span>/</span>
            <Link href={`/services/${catSlug}`} className="hover:text-slate-300 transition-colors">
              {catName}
            </Link>
            <span>/</span>
            <span className="text-slate-300">{service.title}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            {catName}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {service.title}
          </h1>
          {service.excerpt && (
            <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
              {service.excerpt}
            </p>
          )}
          <Button variant="accent" size="lg" href="/request-for-a-proposal">
            Get a Free Strategy Session
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {service.content ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
            <p>{service.content}</p>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>Content coming soon.</p>
          </div>
        )}
      </div>

      {/* Related Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <div className="bg-slate-50 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                  Proven Results
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {catName} Case Studies
                </h2>
              </div>
              <Link
                href={`/case-studies?service=${encodeURIComponent(catName)}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedCaseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
                >
                  {cs.industry && (
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 mb-3">
                      {cs.industry}
                    </span>
                  )}
                  {cs.clientName && (
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
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
                      <span className="text-emerald-600">{cs.revenueGenerated}</span>
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
        categorySlug={catSlug}
        categoryName={catName}
        categoryDescription={null}
        excludeSlug={slug}
      />

      {/* Lead capture */}
      <LeadCaptureSection
        title={`Get a Free ${service.title} Consultation`}
        description="Tell us about your business and we'll show you exactly how we'd approach your growth — no commitment required."
        defaultService={catName}
        submitLabel="Request Free Consultation"
        eyebrow="Free Consultation"
      />

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Ready to Grow?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Let&apos;s make your {catName.toLowerCase()} work harder
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get a custom strategy session and discover exactly how we&apos;d approach your growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">Get a Free Consultation</Button>
            <Button variant="ghost" size="lg" href="/portfolio" className="text-slate-400 hover:text-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
