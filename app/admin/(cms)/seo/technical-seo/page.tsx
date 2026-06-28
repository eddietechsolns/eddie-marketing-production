import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Technical SEO | Admin" };

const SYSTEM_SLUGS = [
  "cart",
  "checkout",
  "my-account",
  "slider",
  "lost-and-found",
];

const STATIC_HUB_COUNT = 6; // /, /services, /industries, /locations, /portfolio, /blog

const SCHEMA_COVERAGE = [
  {
    route: "Homepage",
    path: "/",
    organization: true,
    website: true,
    localBusiness: true,
    breadcrumb: false,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: false,
  },
  {
    route: "Services Hub",
    path: "/services",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: true,
  },
  {
    route: "Service Category",
    path: "/services/[cat]",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: true,
    blogPosting: false,
    faq: false,
    collectionPage: true,
  },
  {
    route: "Service Detail",
    path: "/services/[cat]/[slug]",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: true,
    blogPosting: false,
    faq: true,
    collectionPage: false,
  },
  {
    route: "Blog Hub",
    path: "/blog",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: true,
  },
  {
    route: "Blog Post",
    path: "/blog/[slug]",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: true,
    faq: false,
    collectionPage: false,
  },
  {
    route: "Industries Hub",
    path: "/industries",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: true,
  },
  {
    route: "Industry Detail",
    path: "/industries/[slug]",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: false,
  },
  {
    route: "Locations Hub",
    path: "/locations",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: true,
  },
  {
    route: "Location Detail",
    path: "/locations/[slug]",
    organization: true,
    website: false,
    localBusiness: true,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: false,
  },
  {
    route: "Portfolio Hub",
    path: "/portfolio",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: true,
  },
  {
    route: "Portfolio Project",
    path: "/portfolio/[slug]",
    organization: true,
    website: false,
    localBusiness: false,
    breadcrumb: true,
    service: false,
    blogPosting: false,
    faq: false,
    collectionPage: false,
  },
];

function Tick({ yes }: { yes: boolean }) {
  if (yes) return <span className="text-green-600 font-semibold">✓</span>;
  return <span className="text-slate-300">–</span>;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${accent ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-white"}`}
    >
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default async function TechnicalSeoPage() {
  const [
    catCount,
    serviceCount,
    industryCount,
    locationCount,
    postCount,
    portfolioCount,
    pageCount,
    // drafts
    draftPosts,
    draftServices,
    draftIndustries,
    draftLocations,
    draftPortfolio,
    draftPages,
    // failed imports
    failedPages,
    failedPosts,
    // system pages (published but excluded by slug)
    systemPages,
    // missing seo title
    postsNoTitle,
    servicesNoTitle,
    industriesNoTitle,
    locationsNoTitle,
    portfolioNoTitle,
    // missing seo description
    postsNoDesc,
    servicesNoDesc,
    industriesNoDesc,
    locationsNoDesc,
    portfolioNoDesc,
  ] = await Promise.all([
    prisma.serviceCategory.count({ where: { status: "published" } }),
    prisma.service.count({ where: { status: "published" } }),
    prisma.industry.count({ where: { status: "published" } }),
    prisma.location.count({ where: { status: "published" } }),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.portfolioProject.count({ where: { status: "published" } }),
    prisma.page.count({
      where: {
        status: "published",
        importStatus: { not: "failed" },
        slug: { notIn: SYSTEM_SLUGS },
      },
    }),
    prisma.blogPost.count({ where: { status: { not: "published" } } }),
    prisma.service.count({ where: { status: { not: "published" } } }),
    prisma.industry.count({ where: { status: { not: "published" } } }),
    prisma.location.count({ where: { status: { not: "published" } } }),
    prisma.portfolioProject.count({ where: { status: { not: "published" } } }),
    prisma.page.count({ where: { status: { not: "published" } } }),
    prisma.page.count({ where: { importStatus: "failed" } }),
    prisma.blogPost.count({ where: { importStatus: "failed" } }),
    prisma.page.count({
      where: { slug: { in: SYSTEM_SLUGS }, status: "published" },
    }),
    prisma.blogPost.count({ where: { status: "published", seoTitle: null } }),
    prisma.service.count({ where: { status: "published", seoTitle: null } }),
    prisma.industry.count({ where: { status: "published", seoTitle: null } }),
    prisma.location.count({ where: { status: "published", seoTitle: null } }),
    prisma.portfolioProject.count({
      where: { status: "published", seoTitle: null },
    }),
    prisma.blogPost.count({
      where: { status: "published", seoDescription: null },
    }),
    prisma.service.count({
      where: { status: "published", seoDescription: null },
    }),
    prisma.industry.count({
      where: { status: "published", seoDescription: null },
    }),
    prisma.location.count({
      where: { status: "published", seoDescription: null },
    }),
    prisma.portfolioProject.count({
      where: { status: "published", seoDescription: null },
    }),
  ]);

  const totalSitemapUrls =
    STATIC_HUB_COUNT +
    catCount +
    serviceCount +
    industryCount +
    locationCount +
    postCount +
    portfolioCount +
    pageCount;

  const totalDrafts =
    draftPosts +
    draftServices +
    draftIndustries +
    draftLocations +
    draftPortfolio +
    draftPages;

  const totalFailed = failedPages + failedPosts;

  const totalExcluded = totalDrafts + totalFailed + systemPages;

  const totalMissingTitle =
    postsNoTitle +
    servicesNoTitle +
    industriesNoTitle +
    locationsNoTitle +
    portfolioNoTitle;

  const totalMissingDesc =
    postsNoDesc +
    servicesNoDesc +
    industriesNoDesc +
    locationsNoDesc +
    portfolioNoDesc;

  const sitemapBreakdown = [
    { label: "Static hub pages", count: STATIC_HUB_COUNT, note: "/, /services, /industries, /locations, /portfolio, /blog" },
    { label: "Service categories", count: catCount, note: "/services/[cat]" },
    { label: "Service pages", count: serviceCount, note: "/services/[cat]/[slug]" },
    { label: "Blog posts", count: postCount, note: "/blog/[slug]" },
    { label: "Industry pages", count: industryCount, note: "/industries/[slug]" },
    { label: "Location pages", count: locationCount, note: "/locations/[slug]" },
    { label: "Portfolio projects", count: portfolioCount, note: "/portfolio/[slug]" },
    { label: "CMS pages", count: pageCount, note: "/[slug] — published, non-system" },
  ];

  const exclusionRows = [
    { label: "Draft blog posts", count: draftPosts },
    { label: "Draft services", count: draftServices },
    { label: "Draft industries", count: draftIndustries },
    { label: "Draft locations", count: draftLocations },
    { label: "Draft portfolio projects", count: draftPortfolio },
    { label: "Draft CMS pages", count: draftPages },
    { label: "Failed import pages", count: failedPages },
    { label: "Failed import blog posts", count: failedPosts },
    { label: "System pages (cart, checkout, etc.)", count: systemPages },
  ];

  const missingMetaRows = [
    {
      label: "Blog posts",
      noTitle: postsNoTitle,
      noDesc: postsNoDesc,
      total: postCount,
    },
    {
      label: "Services",
      noTitle: servicesNoTitle,
      noDesc: servicesNoDesc,
      total: serviceCount,
    },
    {
      label: "Industries",
      noTitle: industriesNoTitle,
      noDesc: industriesNoDesc,
      total: industryCount,
    },
    {
      label: "Locations",
      noTitle: locationsNoTitle,
      noDesc: locationsNoDesc,
      total: locationCount,
    },
    {
      label: "Portfolio",
      noTitle: portfolioNoTitle,
      noDesc: portfolioNoDesc,
      total: portfolioCount,
    },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Technical SEO</h1>
      <p className="text-sm text-slate-500 mb-8">
        Sitemap, robots.txt, schema coverage, and metadata health. Read-only.
      </p>

      {/* Top stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Sitemap URLs"
          value={totalSitemapUrls}
          sub="indexed pages"
          accent
        />
        <StatCard
          label="Excluded from Sitemap"
          value={totalExcluded}
          sub="drafts + failed + system"
        />
        <StatCard
          label="Missing SEO Title"
          value={totalMissingTitle}
          sub="published content"
        />
        <StatCard
          label="Missing SEO Description"
          value={totalMissingDesc}
          sub="published content"
        />
      </div>

      {/* Sitemap */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">
            Sitemap breakdown
          </h2>
          <a
            href="/sitemap.xml"
            target="_blank"
            className="text-xs text-orange-600 hover:underline"
          >
            View sitemap.xml ↗
          </a>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2.5 font-medium text-slate-600">
                  Content type
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-600">
                  Path pattern
                </th>
                <th className="text-right px-4 py-2.5 font-medium text-slate-600">
                  URLs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sitemapBreakdown.map((row) => (
                <tr key={row.label} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-800">{row.label}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">
                    {row.note}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-slate-900">
                    {row.count}
                  </td>
                </tr>
              ))}
              <tr className="bg-orange-50 border-t border-slate-200">
                <td className="px-4 py-2.5 font-semibold text-slate-900" colSpan={2}>
                  Total
                </td>
                <td className="px-4 py-2.5 text-right font-bold text-orange-700">
                  {totalSitemapUrls}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Robots */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">
            robots.txt
          </h2>
          <a
            href="/robots.txt"
            target="_blank"
            className="text-xs text-orange-600 hover:underline"
          >
            View robots.txt ↗
          </a>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide font-medium">
                Status
              </p>
              <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Active
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide font-medium">
                User-agent
              </p>
              <span className="font-mono text-slate-800">*</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide font-medium">
                Allow
              </p>
              <span className="font-mono text-slate-800">/</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide font-medium">
              Disallowed paths
            </p>
            <div className="flex gap-2 flex-wrap">
              {["/admin/", "/api/"].map((path) => (
                <code
                  key={path}
                  className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono"
                >
                  {path}
                </code>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide font-medium">
              Sitemap
            </p>
            <a
              href={`${SITE_URL}/sitemap.xml`}
              target="_blank"
              className="font-mono text-xs text-orange-600 hover:underline break-all"
            >
              {SITE_URL}/sitemap.xml
            </a>
          </div>
        </div>
      </section>

      {/* Schema coverage */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-slate-800 mb-3">
          Schema coverage (JSON-LD)
        </h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2.5 font-medium text-slate-600 w-44">
                  Route
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  Org
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  WebSite
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  LocalBiz
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  Breadcrumb
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  Service
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  BlogPosting
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  FAQ
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  Collection
                </th>
                <th className="text-center px-2 py-2.5 font-medium text-slate-600 text-xs">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SCHEMA_COVERAGE.map((row) => {
                const total = [
                  row.organization,
                  row.website,
                  row.localBusiness,
                  row.breadcrumb,
                  row.service,
                  row.blogPosting,
                  row.faq,
                  row.collectionPage,
                ].filter(Boolean).length;
                return (
                  <tr key={row.path} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-slate-800 leading-none">
                        {row.route}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {row.path}
                      </p>
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.organization} />
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.website} />
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.localBusiness} />
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.breadcrumb} />
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.service} />
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.blogPosting} />
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.faq} />
                    </td>
                    <td className="text-center px-2 py-2.5">
                      <Tick yes={row.collectionPage} />
                    </td>
                    <td className="text-center px-2 py-2.5 font-semibold text-slate-700">
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          Organization schema is included on every route via the global layout.
          All schemas use JSON-LD via the JsonLd component.
        </p>
      </section>

      {/* Exclusions */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-slate-800 mb-3">
          Pages excluded from sitemap
        </h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2.5 font-medium text-slate-600">
                  Reason for exclusion
                </th>
                <th className="text-right px-4 py-2.5 font-medium text-slate-600">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exclusionRows
                .filter((r) => r.count > 0)
                .map((row) => (
                  <tr key={row.label} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700">{row.label}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">
                      {row.count}
                    </td>
                  </tr>
                ))}
              {exclusionRows.every((r) => r.count === 0) && (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-center text-slate-400 text-sm">
                    No excluded pages
                  </td>
                </tr>
              )}
              <tr className="bg-slate-50 border-t border-slate-200">
                <td className="px-4 py-2.5 font-semibold text-slate-900">
                  Total excluded
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">
                  {totalExcluded}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Missing metadata */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-slate-800 mb-3">
          Missing SEO metadata (published content)
        </h2>
        <p className="text-xs text-slate-500 mb-3">
          All pages generate a canonical URL automatically. These counts reflect
          custom SEO title/description fields not yet filled in the DB. Pages
          without custom values fall back to the content title and excerpt.
        </p>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2.5 font-medium text-slate-600">
                  Content type
                </th>
                <th className="text-right px-4 py-2.5 font-medium text-slate-600">
                  Published
                </th>
                <th className="text-right px-4 py-2.5 font-medium text-slate-600">
                  No SEO title
                </th>
                <th className="text-right px-4 py-2.5 font-medium text-slate-600">
                  No SEO description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {missingMetaRows.map((row) => (
                <tr key={row.label} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-800">{row.label}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">
                    {row.total}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {row.noTitle === 0 ? (
                      <span className="text-green-600 font-medium">0</span>
                    ) : (
                      <span className="text-amber-600 font-medium">
                        {row.noTitle}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {row.noDesc === 0 ? (
                      <span className="text-green-600 font-medium">0</span>
                    ) : (
                      <span className="text-amber-600 font-medium">
                        {row.noDesc}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 border-t border-slate-200">
                <td className="px-4 py-2.5 font-semibold text-slate-900">
                  Total
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">
                  {postCount +
                    serviceCount +
                    industryCount +
                    locationCount +
                    portfolioCount}
                </td>
                <td className="px-4 py-2.5 text-right font-semibold">
                  {totalMissingTitle === 0 ? (
                    <span className="text-green-600">{totalMissingTitle}</span>
                  ) : (
                    <span className="text-amber-600">{totalMissingTitle}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-semibold">
                  {totalMissingDesc === 0 ? (
                    <span className="text-green-600">{totalMissingDesc}</span>
                  ) : (
                    <span className="text-amber-600">{totalMissingDesc}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Canonical note */}
      <section className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Canonical URLs</p>
          <p>
            Every public route sets its canonical URL via Next.js{" "}
            <code className="bg-blue-100 px-1 rounded text-xs font-mono">
              alternates.canonical
            </code>{" "}
            in <code className="bg-blue-100 px-1 rounded text-xs font-mono">generateMetadata()</code>.
            Missing canonical count: <strong>0</strong> — all published pages
            have a canonical set automatically.
          </p>
        </div>
      </section>
    </div>
  );
}
