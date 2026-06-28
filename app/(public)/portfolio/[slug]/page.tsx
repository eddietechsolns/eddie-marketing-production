import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { ExploreMoreSection } from "@/components/internal-links/ExploreMoreSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({ where: { slug } });
  if (!project) return { title: "Not Found" };
  return buildMetadata({
    title: project.seoTitle ?? `${project.title} | Case Study`,
    description: project.seoDescription ?? project.excerpt,
    path: `/portfolio/${slug}`,
  });
}

export async function generateStaticParams() {
  const projects = await prisma.portfolioProject.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return projects;
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { slug } = await params;

  const [project, relatedProjects] = await Promise.all([
    prisma.portfolioProject.findUnique({
      where: { slug },
      include: {
        industries: { select: { title: true, slug: true } },
      },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "published", slug: { not: slug } },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { slug: true, title: true, excerpt: true, client: true, industries: { select: { title: true } } },
    }),
  ]);

  if (!project || project.status !== "published") notFound();

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${SITE_URL}/portfolio/${slug}#article`,
            headline: project.title,
            description: project.excerpt ?? undefined,
            url: `${SITE_URL}/portfolio/${slug}`,
            publisher: { "@id": `${SITE_URL}/#organization` },
            ...(project.industries.length > 0
              ? { about: project.industries.map(i => ({ "@type": "Thing", name: i.title })) }
              : {}),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path: `/portfolio/${slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-slate-300 transition-colors">Portfolio</Link>
            <span>/</span>
            <span className="text-slate-300 line-clamp-1">{project.title}</span>
          </nav>

          {project.industries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.industries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  className="inline-block text-xs font-semibold text-teal-500 bg-teal-400/10 hover:bg-teal-400/20 px-2.5 py-1 rounded-full transition-colors"
                >
                  {ind.title}
                </Link>
              ))}
            </div>
          )}

          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Case Study</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3 max-w-3xl">
            {project.title}
          </h1>
          {project.client && (
            <p className="text-base text-slate-400 mb-4">Client: {project.client}</p>
          )}
          {project.excerpt && (
            <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
              {project.excerpt}
            </p>
          )}

          {project.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.services.map((label) => (
                <span key={label} className="text-xs font-medium text-slate-400 bg-white/10 px-3 py-1 rounded-full">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {project.content ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-headings:font-bold prose-a:text-blue-600">
            <p>{project.content}</p>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">Full case study coming soon.</p>
          </div>
        )}
      </div>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">More Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/portfolio/${rp.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  {rp.industries[0] && (
                    <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                      {rp.industries[0].title}
                    </span>
                  )}
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">{rp.title}</h3>
                  {rp.client && <p className="text-sm text-slate-400 mb-1">{rp.client}</p>}
                  {rp.excerpt && <p className="text-sm text-slate-500 line-clamp-2">{rp.excerpt}</p>}
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/portfolio" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                &larr; View all case studies
              </Link>
            </div>
          </div>
        </div>
      )}

      <ExploreMoreSection
        eyebrow="Explore More"
        title="More Ways to Grow Your UAE Business"
        exclude={["/portfolio"]}
      />

      {/* Lead capture */}
      <LeadCaptureSection
        title="Get Similar Results for Your Business"
        description="Ready to become our next success story? Tell us about your project and we'll put together a custom growth strategy."
        submitLabel="Start a Project"
        eyebrow="Work With Us"
      />

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Get Similar Results</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to become our next success story?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Let&apos;s build a custom strategy for your business, your market, and your growth targets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" href="/request-for-a-proposal">Start a Project</Button>
            <Button variant="ghost" size="lg" href="/services" className="text-slate-400 hover:text-white hover:bg-white/10">
              View Our Services
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
