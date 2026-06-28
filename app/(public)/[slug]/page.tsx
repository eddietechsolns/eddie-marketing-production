import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageSchema, breadcrumbSchema, jobPostingSchema, faqSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { ClusterLinksSection } from "@/components/internal-links/ClusterLinksSection";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { cleanBlogContent } from "@/lib/content-cleanup";
import {
  classifyPage,
  findIndustryForPage,
  getIndustryPages,
  getServiceClusterName,
  getServiceClusterPages,
  INDUSTRY_DISPLAY_NAMES,
} from "@/lib/industry-pages";
import { IndustryPageSections } from "@/components/page-sections/IndustryPageSections";
import { ServicePageSections } from "@/components/page-sections/ServicePageSections";
import { TrainingPageSections } from "@/components/page-sections/TrainingPageSections";
import { ContentBlockRenderer } from "@/components/page-sections/ContentBlockRenderer";
import {
  CITY_HUB_SLUGS,
  CITY_HUB_CONFIG,
  CITY_NEIGHBORHOOD_SLUGS,
  getHubForNeighborhood,
  getNeighbourhoodsForHub,
  parseCityHubCards,
} from "@/lib/city-content";
import { CityHubSection } from "@/components/page-sections/CityHubSection";
import { CityNeighborhoodSection } from "@/components/page-sections/CityNeighborhoodSection";
import { CaseStudyPageSection } from "@/components/page-sections/CaseStudyPageSection";
import { AuthorityStrip } from "@/components/trust/AuthorityStrip";
import { TrustSidebarWidget } from "@/components/trust/TrustSidebarWidget";
import {
  isInternshipHub,
  isInternshipChild,
  getInternshipCards,
  getRelatedInternships,
  deriveInternshipCard,
} from "@/lib/internship-content";
import { InternshipHubSection } from "@/components/page-sections/InternshipHubSection";
import { InternshipPageSection } from "@/components/page-sections/InternshipPageSection";
import { CareersPageSection } from "@/components/page-sections/CareersPageSection";

// ─── Known slugs already served by static routes — this component should never
//     receive them (Next.js resolves more-specific routes first), but as an extra
//     safety measure we return notFound() if they arrive here somehow.
const STATIC_ROUTE_SLUGS = new Set([
  "services",
  "blog",
  "portfolio",
  "case-studies",
  "industries",
  "locations",
]);

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (STATIC_ROUTE_SLUGS.has(slug)) return { title: "Not Found" };

  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || page.status !== "published" || page.importStatus === "failed") {
    return { title: "Not Found" };
  }

  const path = `/${slug}`;
  const canonical = `${SITE_URL}${path}`;

  const resolvedTitle = page.seoTitle ?? page.ogTitle ?? page.title;
  const resolvedDesc =
    page.seoDescription ??
    page.excerpt ??
    `${resolvedTitle} — digital marketing expertise from Eddie Marketing Solutions FZE in the UAE.`;

  return {
    ...buildMetadata({
      title: resolvedTitle,
      description: resolvedDesc,
      path,
    }),
    alternates: { canonical },
    openGraph: {
      title: page.ogTitle ?? page.seoTitle ?? page.title,
      description: page.ogDescription ?? page.seoDescription ?? page.excerpt ?? resolvedDesc,
      url: canonical,
      type: "website",
      ...(page.ogImage ? { images: [{ url: page.ogImage }] } : {}),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export default async function ImportedPage({ params }: Props) {
  const { slug } = await params;

  // Safety valve — static routes take priority; this should never be reached
  if (STATIC_ROUTE_SLUGS.has(slug)) notFound();

  const [page, relatedPosts, serviceCategories, caseStudies, allPages] = await Promise.all([
    prisma.page.findUnique({ where: { slug } }),
    prisma.blogPost.findMany({
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
    }),
    prisma.serviceCategory.findMany({
      where: { status: "published" },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: {
        slug: true,
        title: true,
        clientName: true,
        serviceType: true,
        industry: true,
        trafficIncreasePercent: true,
        leadIncreasePercent: true,
      },
    }),
    prisma.page.findMany({
      where: { status: "published" },
      orderBy: { title: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  // Only serve published, non-failed pages.
  // If no Page matches, fall back to the Redirect table before returning 404.
  // (Next.js routes [slug] before [...slug], so single-segment redirect URLs
  //  must be checked here; multi-segment URLs still reach the catch-all.)
  if (!page || page.status !== "published" || page.importStatus === "failed") {
    const match = await prisma.redirect.findUnique({
      where: { sourceUrl: `/${slug}` },
    });
    if (match) {
      if (match.statusCode === 301) permanentRedirect(match.targetUrl);
      else redirect(match.targetUrl);
    }
    notFound();
  }

  const path = `/${slug}`;
  const cleanedContent = cleanBlogContent(page.content);

  // ── Classification & related-resource resolution ─────────────────────────
  const category = classifyPage(slug, page.title);

  // Case study pages — detected by slug pattern, overrides all other rendering
  const isCaseStudy =
    (slug.includes("case-study") || slug.includes("case-studies")) &&
    !STATIC_ROUTE_SLUGS.has(slug);

  // Industry pages — find parent industry + sibling pages
  const industrySlug = category === "industry" ? findIndustryForPage(page.title) : null;
  const industryName = industrySlug ? INDUSTRY_DISPLAY_NAMES[industrySlug] ?? null : null;
  const relatedIndustryPages = industrySlug
    ? getIndustryPages(industrySlug, allPages).filter((p) => p.slug !== slug)
    : [];

  // Service pages — find cluster + sibling pages
  const serviceCluster = category === "service" ? getServiceClusterName(page.title) : null;
  const relatedServicePages = serviceCluster
    ? getServiceClusterPages(page.title, slug, allPages)
    : [];

  // ── Training page detection ─────────────────────────────────────────────────
  const isTraining =
    slug.includes("training") || page.title.toLowerCase().includes("training");

  // ── City hub / neighbourhood detection ─────────────────────────────────────
  const isCityHub = CITY_HUB_SLUGS.has(slug);
  const isCityNeighborhood = CITY_NEIGHBORHOOD_SLUGS.has(slug);
  const cityHubConfig = isCityHub ? (CITY_HUB_CONFIG[slug] ?? null) : null;
  const neighborhoodHubSlug = isCityNeighborhood ? getHubForNeighborhood(slug) : null;
  const neighborhoodHubConfig =
    neighborhoodHubSlug ? (CITY_HUB_CONFIG[neighborhoodHubSlug] ?? null) : null;
  const allPageSlugsSet = new Set(allPages.map((p) => p.slug));
  const cityHubCards = isCityHub ? parseCityHubCards(page.content, allPageSlugsSet) : [];

  // ── Internship hub / child detection ────────────────────────────────────────
  const isInternHub = isInternshipHub(slug);
  const isInternChild = isInternshipChild(slug);
  const internshipCards = isInternHub ? getInternshipCards(allPages) : [];
  const internshipCard = isInternChild ? deriveInternshipCard(slug, page.title) : null;
  const relatedInternships = isInternChild ? getRelatedInternships(slug, allPages) : [];

  // ── Careers hub detection ────────────────────────────────────────────────
  const isCareers = slug === "careers";
  const careersInternshipCards = isCareers ? getInternshipCards(allPages) : [];

  // Hero badge + CTA copy per category
  const heroBadge =
    isCaseStudy
      ? { label: "Case Study", color: "orange" as const }
      : isTraining
      ? { label: "Training Course", color: "green" as const }
      : category === "industry"
      ? { label: industryName ? `${industryName} Marketing` : "Industry Marketing", color: "orange" as const }
      : category === "service"
      ? { label: serviceCluster ? `${serviceCluster}` : "Digital Marketing Service", color: "blue" as const }
      : category === "location" && isCityHub && cityHubConfig
      ? { label: `${cityHubConfig.emirate} Neighbourhoods`, color: "teal" as const }
      : category === "location" && isCityNeighborhood && neighborhoodHubConfig
      ? { label: `${neighborhoodHubConfig.emirate} \u00b7 Digital Marketing`, color: "teal" as const }
      : category === "location"
      ? { label: "UAE Location", color: "teal" as const }
      : category === "resource"
      ? { label: "Free Resource", color: "green" as const }
      : isInternHub
      ? { label: "Careers · Internships", color: "teal" as const }
      : isInternChild
      ? { label: "Internship Position", color: "teal" as const }
      : isCareers
      ? { label: "Careers Center", color: "teal" as const }
      : null;

  const showHeroCtas =
    isCaseStudy || isTraining || category === "industry" || category === "service" || isCityHub || isCityNeighborhood || isInternHub || isInternChild || isCareers;

  // ── Filtered case studies for structured sections ──────────────────────────
  // Industry pages: filter by industry field (fuzzy match on industrySlug/name)
  const industryCaseStudies = industrySlug
    ? caseStudies.filter((cs) => {
        const ind = (cs.industry ?? "").toLowerCase();
        return (
          ind.includes(industrySlug.replace("-", " ")) ||
          ind.includes(industryName?.toLowerCase() ?? "") ||
          ind === industrySlug
        );
      })
    : [];
  // Fall back to top 3 general case studies if none match the industry
  const sectionCaseStudies =
    industryCaseStudies.length > 0 ? industryCaseStudies : caseStudies.slice(0, 3);

  // Service pages: filter by serviceType field
  const serviceCaseStudies = serviceCluster
    ? caseStudies.filter((cs) => {
        const st = (cs.serviceType ?? "").toLowerCase();
        return st.includes(serviceCluster.toLowerCase()) || serviceCluster.toLowerCase().includes(st);
      })
    : [];
  const serviceSectionCaseStudies =
    serviceCaseStudies.length > 0 ? serviceCaseStudies : caseStudies.slice(0, 3);

  // Dynamic CTA copy
  const ctaTitle =
    isInternHub
      ? "Ready to Launch Your Marketing Career?"
      : isInternChild && internshipCard
      ? `Apply for the ${internshipCard.title}`
      : isTraining
      ? `Book Your Place on ${page.title}`
      : category === "industry" && industryName
      ? `Ready to Grow Your ${industryName} Business?`
      : category === "service" && serviceCluster
      ? `Ready to Scale with ${serviceCluster}?`
      : "Grow Your Business With Eddie Marketing";

  const ctaDescription =
    isInternHub
      ? "Join a specialist UAE digital marketing agency. Work on live client campaigns, earn a stipend, and build a portfolio that gets you hired."
      : isInternChild
      ? "Submit your application below. We review every application within 3–5 business days and invite shortlisted candidates to a discovery call."
      : isTraining
      ? "Contact us to check upcoming dates, ask about corporate group bookings, or reserve your place on the next session."
      : category === "industry"
      ? `Get a custom digital marketing strategy built for your sector. Talk to a senior strategist — free, no obligation.`
      : category === "service"
      ? `Let our certified team build a results-driven ${serviceCluster ?? "digital marketing"} strategy for your business.`
      : "Get a custom digital marketing strategy built around your goals. Talk to a senior strategist — free, no obligation.";

  return (
    <>
      <JsonLd
        data={[
          pageSchema({
            title: page.seoTitle ?? page.title,
            description: page.seoDescription ?? page.excerpt,
            path,
            modifiedAt: page.updatedAt,
          }),
          ...(isInternChild && internshipCard
            ? [
                jobPostingSchema({
                  title: internshipCard.title,
                  description: page.excerpt,
                  path,
                  department: internshipCard.department,
                }),
              ]
            : []),
          breadcrumbSchema(
            isInternChild
              ? [
                  { name: "Home", path: "/" },
                  { name: "Internships", path: "/internships" },
                  { name: page.title, path },
                ]
              : [
                  { name: "Home", path: "/" },
                  { name: page.title, path },
                ]
          ),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            {isCaseStudy && (
              <>
                <Link href="/case-studies" className="hover:text-slate-300 transition-colors">Case Studies</Link>
                <span>/</span>
              </>
            )}
            {!isCaseStudy && industrySlug && (
              <>
                <Link href="/industries" className="hover:text-slate-300 transition-colors">Industries</Link>
                <span>/</span>
                <Link href={`/industries/${industrySlug}`} className="hover:text-slate-300 transition-colors capitalize">
                  {industryName}
                </Link>
                <span>/</span>
              </>
            )}
            {neighborhoodHubSlug && neighborhoodHubConfig && (
              <>
                <Link href={`/${neighborhoodHubSlug}`} className="hover:text-slate-300 transition-colors">
                  {neighborhoodHubConfig.emirate} Areas
                </Link>
                <span>/</span>
              </>
            )}
            {isInternChild && (
              <>
                <Link href="/internships" className="hover:text-slate-300 transition-colors">Internships</Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-300 line-clamp-1">{page.title}</span>
          </nav>

          {/* Category badge */}
          {heroBadge && (
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
              {heroBadge.label}
            </p>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl leading-snug">
            {page.title}
          </h1>

          {(page.excerpt || category === "service") && (
            <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
              {page.excerpt ?? (serviceCluster
                ? `Expert ${serviceCluster} services for businesses across the UAE — proven strategies, measurable results.`
                : "Expert digital marketing services for businesses across the UAE — proven strategies, measurable results."
              )}
            </p>
          )}

          {/* CTA buttons — industry, service, training pages */}
          {showHeroCtas && isTraining && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="accent" size="lg" href="/request-for-a-proposal">
                Enquire &amp; Book Now
              </Button>
              <Button variant="ghost" size="md" href="/digital-marketing-training-dubai" className="text-slate-300 hover:text-white hover:bg-white/10">
                View All Training
              </Button>
            </div>
          )}
          {showHeroCtas && !isTraining && isInternHub && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="accent" size="lg" href="#positions">
                View Open Positions
              </Button>
              <Button variant="ghost" size="md" href="/careers" className="text-slate-300 hover:text-white hover:bg-white/10">
                Careers at EMS
              </Button>
            </div>
          )}
          {showHeroCtas && !isTraining && isInternChild && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="accent" size="lg" href="#apply">
                Apply Now
              </Button>
              <Button variant="ghost" size="md" href="/internships" className="text-slate-300 hover:text-white hover:bg-white/10">
                All Internships
              </Button>
            </div>
          )}
          {showHeroCtas && !isTraining && isCareers && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="accent" size="lg" href="#positions">
                View Open Positions
              </Button>
              <Button variant="ghost" size="md" href="/internships" className="text-slate-300 hover:text-white hover:bg-white/10">
                Internship Programme
              </Button>
            </div>
          )}
          {showHeroCtas && !isTraining && !isInternHub && !isInternChild && !isCareers && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="accent" size="lg" href="/request-for-a-proposal">
                Get a Free Strategy Session
              </Button>
              <Button variant="ghost" size="md" href="/services" className="text-slate-300 hover:text-white hover:bg-white/10">
                View Our Services
              </Button>
            </div>
          )}
        </div>
      </div>

      <AuthorityStrip />

      {/* ── Case study template (overrides industry/service for slug-matched pages) */}
      {isCaseStudy && (
        <CaseStudyPageSection
          slug={slug}
          title={page.title}
          caseStudies={caseStudies}
        />
      )}

      {/* ── Industry structured sections (stats, services, challenges, why-eddie, case studies) */}
      {!isCaseStudy && category === "industry" && industrySlug && industryName && (
        <IndustryPageSections
          industrySlug={industrySlug}
          industryName={industryName}
          caseStudies={sectionCaseStudies}
        />
      )}

      {/* ── Service structured sections (stats, benefits, deliverables, process, case studies) */}
      {!isCaseStudy && !isTraining && category === "service" && (
        <ServicePageSections
          serviceCluster={serviceCluster ?? "Digital Marketing"}
          caseStudies={serviceSectionCaseStudies}
        />
      )}

      {/* ── Training course sections ──────────────────────────────────── */}
      {isTraining && (
        <TrainingPageSections
          slug={slug}
          pageTitle={page.title}
          serviceCategories={serviceCategories}
        />
      )}

      {/* ── City hub neighbourhood grid ───────────────────────────────── */}
      {isCityHub && cityHubConfig && (
        <CityHubSection
          cards={cityHubCards}
          config={cityHubConfig}
          hubSlug={slug}
          fallbackSlugs={getNeighbourhoodsForHub(slug)}
        />
      )}

      {/* ── Internship hub (dynamic position card grid + sections) ────── */}
      {isInternHub && (
        <InternshipHubSection cards={internshipCards} relatedPosts={relatedPosts} />
      )}

      {/* ── Individual internship page template ──────────────────────── */}
      {isInternChild && internshipCard && (
        <InternshipPageSection
          card={internshipCard}
          cleanedContent={cleanedContent}
          excerpt={page.excerpt}
          relatedInternships={relatedInternships}
          slug={slug}
        />
      )}

      {/* ── Careers hub ───────────────────────────────────────────────── */}
      {isCareers && (
        <CareersPageSection
          internshipCards={careersInternshipCards}
          relatedPosts={relatedPosts}
        />
      )}

      {/* ── Content + sidebar ────────────────────────────────────────── */}
      {!isCityHub && !isCaseStudy && !isTraining && !isInternHub && !isInternChild && !isCareers && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">

          {/* Main content */}
          <div className="min-w-0">
            {/* ── Label for the deep-dive section on structured pages ── */}
            {(category === "industry" || category === "service") && cleanedContent && (
              <div className="mb-6 pb-5 border-b border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  In-Depth Guide
                </p>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{page.title}</h2>
              </div>
            )}

            {isCityNeighborhood && neighborhoodHubSlug && neighborhoodHubConfig ? (
              <CityNeighborhoodSection
                title={page.title}
                hubSlug={neighborhoodHubSlug}
                hubConfig={neighborhoodHubConfig}
              />
            ) : (
              <ContentBlockRenderer
                html={cleanedContent}
                excerpt={page.excerpt}
                showFaq={true}
                slug={slug}
              />
            )}

            <div className="mt-10 pt-8 border-t border-slate-200">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                &larr; Back to Home
              </Link>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">

            {/* 1. Free Strategy Session */}
            <div className="ems-gradient-bg rounded-xl p-5 text-white shadow-lg">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-1.5">Free Strategy Session</h3>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                30 minutes with a senior strategist. Actionable insights, zero obligation.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                Book Your Free Session
              </Button>
            </div>

            {/* 2. Our Services */}
            {serviceCategories.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
                  Our Services
                </h3>
                <ul className="space-y-2">
                  {serviceCategories.map((svc) => (
                    <li key={svc.slug}>
                      <Link
                        href={`/services/${svc.slug}`}
                        className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 transition-colors group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 group-hover:bg-blue-500 transition-colors" />
                        {svc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Success Stories */}
            {caseStudies.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
                  Success Stories
                </h3>
                <ul className="space-y-3">
                  {caseStudies.map((cs) => (
                    <li key={cs.slug}>
                      <Link href={`/case-studies/${cs.slug}`} className="block group">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-0.5">
                          {cs.clientName}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cs.trafficIncreasePercent && (
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              +{cs.trafficIncreasePercent}% traffic
                            </span>
                          )}
                          <span className="text-xs text-slate-400">{cs.serviceType}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/case-studies" className="block mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  All case studies →
                </Link>
              </div>
            )}

            {/* 4. Recent Articles */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
                  Recent Articles
                </h3>
                <ul className="space-y-3">
                  {relatedPosts.map((post) => (
                    <li key={post.slug}>
                      <Link href={`/blog/${post.slug}`} className="group block">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </p>
                        {post.publishedAt && (
                          <time className="text-xs text-slate-400 mt-0.5 block" dateTime={post.publishedAt.toISOString()}>
                            {post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </time>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/blog" className="block mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Read the blog →
                </Link>
              </div>
            )}

            {/* 5. Quick Contact */}
            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <p className="text-sm font-semibold mb-1">Ready to grow?</p>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Talk to a specialist about your digital marketing goals.
              </p>
              <Link href="/request-for-a-proposal" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Contact us →
              </Link>
            </div>

            {/* 6. Why Work With Eddie */}
            <TrustSidebarWidget />
          </aside>
        </div>
      </div>
      )}

      {/* ── Related Industry Resources ───────────────────────────────── */}
      {relatedIndustryPages.length > 0 && (
        <div className="border-t border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                {industryName} Marketing
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Related {industryName} Resources
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {relatedIndustryPages.length} more specialist page{relatedIndustryPages.length !== 1 ? "s" : ""} covering {(industryName ?? "industry").toLowerCase()} marketing
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedIndustryPages.slice(0, 8).map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all"
                >
                  <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors shrink-0">
                    <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug flex-1">
                    {p.title}
                  </h3>
                  <span className="mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
            {relatedIndustryPages.length > 8 && (
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-2">
                {relatedIndustryPages.slice(8).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="text-sm text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
            {industrySlug && (
              <div className="mt-6">
                <Link
                  href={`/industries/${industrySlug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View the full {industryName} hub →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Related Service Resources ────────────────────────────────── */}
      {relatedServicePages.length > 0 && (
        <div className="border-t border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
                Related Services
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                More {serviceCluster} Resources
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {relatedServicePages.length} more page{relatedServicePages.length !== 1 ? "s" : ""} covering {serviceCluster?.toLowerCase()}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServicePages.slice(0, 8).map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug flex-1">
                    {p.title}
                  </h3>
                  <span className="mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
            {relatedServicePages.length > 8 && (
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-2">
                {relatedServicePages.slice(8).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="text-sm text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Related blog posts ───────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  {rp.categories[0]?.name && (
                    <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                      {rp.categories[0].name}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors mb-1">
                    {rp.title}
                  </h3>
                  {rp.publishedAt && (
                    <time
                      className="text-xs text-slate-400"
                      dateTime={rp.publishedAt.toISOString()}
                    >
                      {rp.publishedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Internal linking — cluster-based ────────────────────────── */}
      <ClusterLinksSection variant="slug" slug={slug} kind="page" />

      {/* ── Lead capture (excluded for internship/careers pages — they have their own form) */}
      {!isInternHub && !isInternChild && !isCareers && (
        <LeadCaptureSection
          title={ctaTitle}
          description={ctaDescription}
          submitLabel={isTraining ? "Enquire About This Course" : "Get a Free Consultation"}
          eyebrow={isTraining ? "Course Enquiry" : "Free Consultation"}
        />
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            {isTraining ? "Reserve Your Place" : "Ready to Get Started?"}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            {isTraining
              ? `Book Your Place on ${page.title}`
              : category === "industry" && industryName
              ? `Let's Grow Your ${industryName} Business`
              : category === "service" && serviceCluster
              ? `Let's Scale Your ${serviceCluster} Results`
              : "Let's Build Your Marketing Strategy"}
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            {isTraining
              ? "In-person Dubai · Live online · Corporate group delivery. Contact us to check dates or request a custom group session."
              : "Work with a dedicated team that understands the UAE, GCC, and global markets."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">
              {isTraining ? "Enquire & Book Now" : "Get a Free Consultation"}
            </Button>
            {isTraining && (
              <Button variant="ghost" size="lg" href="/digital-marketing-training-dubai" className="text-slate-400 hover:text-white hover:bg-white/10">
                View All Training
              </Button>
            )}
            {!isTraining && industrySlug && (
              <Button variant="ghost" size="lg" href={`/industries/${industrySlug}`} className="text-slate-400 hover:text-white hover:bg-white/10">
                Explore {industryName} Hub
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom CTA (training / service / industry pages) ── */}
      {(isTraining || category === "service" || category === "industry") && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-slate-900/95 backdrop-blur border-t border-slate-700 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <p className="text-sm font-medium text-white truncate">
            {isTraining ? "Book this course — free enquiry" : "Free strategy session"}
          </p>
          <Link
            href="/request-for-a-proposal"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 ems-gradient-bg text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Get Started
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}
