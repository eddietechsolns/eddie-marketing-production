import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { AuthorityStrip } from "@/components/trust/AuthorityStrip";
import { JobsHubSection } from "@/components/page-sections/JobsHubSection";
import type { JobCard } from "@/components/page-sections/JobsHubSection";

export const metadata: Metadata = {
  title: "Open Positions | Careers at Eddie Marketing Solutions",
  description:
    "Browse current job openings at Eddie Marketing Solutions — SEO, Google Ads, content, design, web development, and more. Apply for full-time, part-time, and remote roles in Dubai and beyond.",
  alternates: { canonical: `${SITE_URL}/careers/jobs` },
  openGraph: {
    title: "Open Positions | Careers at Eddie Marketing Solutions",
    description:
      "Browse current job openings at Eddie Marketing Solutions in Dubai, UAE. Full-time, part-time, and remote roles across digital marketing disciplines.",
    url: `${SITE_URL}/careers/jobs`,
    type: "website",
  },
};

export default async function JobsHubPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      department: true,
      location: true,
      employmentType: true,
      experienceLevel: true,
      description: true,
    },
  });

  const jobCards: JobCard[] = jobs;

  const jsonLd = breadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Careers", path: "/careers" },
    { name: "Open Positions", path: "/careers/jobs" },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 pt-20 pb-14 md:pb-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li className="text-slate-200 font-medium">Open Positions</li>
            </ol>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text">
              Careers · Open Positions
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-3xl">
            Open Positions
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mb-8">
            We are building a world-class digital marketing team in Dubai. Browse current openings across SEO, Ads, Content, Design, Web Development, Analytics, and more.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/internships"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              View Internship Programme
            </Link>
            <Link
              href="/careers#apply"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-slate-400 text-sm font-semibold hover:text-white transition-colors"
            >
              Submit General Application →
            </Link>
          </div>
        </div>
      </div>

      <AuthorityStrip />

      {/* ── Jobs hub (search + filters + cards) ────────────────────────── */}
      <div className="bg-slate-50 min-h-[50vh]">
        <JobsHubSection jobs={jobCards} />
      </div>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">Don't see the right role?</p>
              <h2 className="text-xl font-bold text-white mb-1">Submit a general application</h2>
              <p className="text-sm text-slate-400">We hire on a rolling basis. Tell us about yourself and we will reach out when a match opens.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/careers#apply"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg ems-btn-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Apply Now
              </Link>
              <Link
                href="/internships"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors whitespace-nowrap"
              >
                Internship Programme
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
