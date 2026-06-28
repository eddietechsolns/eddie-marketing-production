import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, jobPostingSchema } from "@/lib/schema";
import { AuthorityStrip } from "@/components/trust/AuthorityStrip";
import { JobDetailTemplate } from "@/components/page-sections/JobDetailTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug, status: "published" },
    select: { title: true, department: true, location: true, description: true, seoTitle: true, seoDescription: true },
  });
  if (!job) return {};

  const title = job.seoTitle ?? `${job.title} — ${job.department} | Eddie Marketing Solutions`;
  const description =
    job.seoDescription ??
    job.description ??
    `Apply for the ${job.title} position at Eddie Marketing Solutions. ${job.department} role based in ${job.location}.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/careers/jobs/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/careers/jobs/${slug}`,
      type: "website",
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;

  const [job, relatedJobs] = await Promise.all([
    prisma.job.findUnique({
      where: { slug, status: "published" },
    }),
    prisma.job.findMany({
      where: { status: "published", slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        department: true,
        location: true,
        employmentType: true,
        experienceLevel: true,
      },
    }),
  ]);

  if (!job) notFound();

  const path = `/careers/jobs/${slug}`;

  // ── Structured data ────────────────────────────────────────────────────────
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Careers", path: "/careers" },
    { name: "Open Positions", path: "/careers/jobs" },
    { name: job.title, path },
  ]);

  const jobPosting = jobPostingSchema({
    title: job.title,
    description: job.description,
    path,
    department: job.department,
    employmentType: job.employmentType,
  });

  // Parse FAQs for FAQ schema
  let faqItems: { question: string; answer: string }[] = [];
  if (job.faqs) {
    try {
      const parsed = JSON.parse(job.faqs) as { q: string; a: string }[];
      faqItems = parsed.map((f) => ({ question: f.q, answer: f.a }));
    } catch {
      faqItems = [];
    }
  }

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={jobPosting} />
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 pt-20 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li><Link href="/careers/jobs" className="hover:text-white transition-colors">Open Positions</Link></li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li className="text-slate-200 font-medium truncate max-w-[200px]">{job.title}</li>
            </ol>
          </nav>

          {/* Department badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-900/30 border border-blue-700/50 px-2.5 py-1 rounded-full mb-4">
            {job.department}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5 max-w-3xl">
            {job.title}
          </h1>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <MetaBadge icon="📍" text={job.location} />
            <MetaBadge icon="💼" text={job.employmentType} />
            <MetaBadge icon="🎓" text={job.experienceLevel} />
            {job.salaryRange && <MetaBadge icon="💰" text={job.salaryRange} accent />}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#apply"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg ems-btn-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Apply for This Role
            </a>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              ← All Open Positions
            </Link>
          </div>
        </div>
      </div>

      <AuthorityStrip />

      {/* ── Job detail template ───────────────────────────────────────────── */}
      <JobDetailTemplate job={job} relatedJobs={relatedJobs} />
    </>
  );
}

// ─── Hero meta badge ─────────────────────────────────────────────────────────

function MetaBadge({ icon, text, accent = false }: { icon: string; text: string; accent?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
      accent
        ? "bg-teal-900/30 border-teal-700/50 text-teal-400"
        : "bg-white/5 border-white/10 text-slate-300"
    }`}>
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  );
}
