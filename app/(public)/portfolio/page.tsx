import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { getSectionImage } from "@/lib/page-images";
import { ExploreMoreSection } from "@/components/internal-links/ExploreMoreSection";

export const metadata: Metadata = buildMetadata({
  title: "Digital Marketing Case Studies & Portfolio",
  description:
    "See the results we've achieved for our clients. Browse our digital marketing case studies and portfolio.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    include: { industries: { select: { title: true, slug: true } } },
  });

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/portfolio#page`,
            name: `Portfolio & Case Studies | ${SITE_NAME}`,
            url: `${SITE_URL}/portfolio`,
            description: "Real results for real businesses across industries.",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="bg-slate-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Portfolio</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Our Work
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            Real Results for Real Businesses
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Browse our case studies to see how we&apos;ve helped clients across industries
            grow their online presence, generate leads, and increase revenue.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">Start a Project</Button>
        </div>
      </div>

      {/* Projects grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {projects.length === 0 ? (
          <p className="text-slate-500">No portfolio projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const coverImg = getSectionImage(
                project.slug,
                project.id % 6,
                project.industries[0]?.title ?? "digital marketing"
              );
              return (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                {/* Cover image */}
                <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={coverImg.src}
                    alt={coverImg.alt}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  {project.industries[0] && (
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {project.industries[0].title}
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h2 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {project.title}
                  </h2>
                  {project.client && (
                    <p className="text-sm text-slate-400 mb-2">{project.client}</p>
                  )}
                  {project.excerpt && (
                    <p className="text-sm text-slate-500 line-clamp-3 flex-1">{project.excerpt}</p>
                  )}
                  <span className="inline-block mt-4 text-sm text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                    View case study &rarr;
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>

      <ExploreMoreSection
        eyebrow="Explore More"
        title="More Ways to Grow Your UAE Business"
        exclude={["/portfolio"]}
      />

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Get Similar Results</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to become our next success story?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get a custom strategy built for your business, your market, and your goals.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">Book a Free Consultation</Button>
        </div>
      </div>
    </>
  );
}
