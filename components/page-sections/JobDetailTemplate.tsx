import Link from "next/link";
import { JobApplicationForm } from "@/components/leads/JobApplicationForm";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface JobDetail {
  id: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  preferredSkills: string | null;
  salaryRange: string | null;
  careerGrowth: string | null;
  faqs: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
}

export interface RelatedJob {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
}

interface Props {
  job: JobDetail;
  relatedJobs: RelatedJob[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBullets(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
}

function parseFaqs(json: string | null): { q: string; a: string }[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as { q: string; a: string }[];
  } catch {
    return [];
  }
}

const DEFAULT_BENEFITS = [
  "Competitive salary benchmarked to the UAE market",
  "Hybrid working — Dubai office + remote flexibility",
  "Google and Meta certification funding",
  "Learning and development stipend",
  "UAE medical insurance",
  "30 days annual leave",
  "UAE residency visa sponsorship (where applicable)",
  "Team events, socials, and annual retreats",
];

const APPLICATION_PROCESS = [
  { n: "01", title: "Apply below", detail: "Submit your CV and a brief cover note using the form below. We review every application within 5 business days." },
  { n: "02", title: "Initial review", detail: "Our hiring team reviews your background and reaches out to shortlisted candidates by email or phone." },
  { n: "03", title: "Interview", detail: "A 30-minute video call with the hiring manager and a department lead to discuss the role and your experience." },
  { n: "04", title: "Practical assessment", detail: "A short, relevant task — paid for your time — so you can show us what you can do in a real-world context." },
  { n: "05", title: "Offer", detail: "Successful candidates receive a formal offer letter within 48 hours of the final stage." },
  { n: "06", title: "Onboarding", detail: "A structured 30-day onboarding plan, team introductions, and a dedicated mentor from day one." },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function JobDetailTemplate({ job, relatedJobs }: Props) {
  const responsibilities = parseBullets(job.responsibilities);
  const requirements = parseBullets(job.requirements);
  const preferredSkills = parseBullets(job.preferredSkills);
  const benefits = parseBullets(null); // use defaults; override with job.benefits when added
  const faqs = parseFaqs(job.faqs);

  return (
    <>
      {/* ── Two-column content layout ─────────────────────────────────── */}
      <div className="bg-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-start">

            {/* ── Main column ─────────────────────────────────────────── */}
            <div className="space-y-12">

              {/* Role Summary */}
              {job.description && (
                <ContentSection eyebrow="Role Summary" heading="About this position">
                  <p className="text-slate-600 leading-relaxed text-sm">{job.description}</p>
                </ContentSection>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <ContentSection eyebrow="Responsibilities" heading="What you'll be doing">
                  <BulletList items={responsibilities} color="blue" />
                </ContentSection>
              )}

              {/* Required Skills */}
              {requirements.length > 0 && (
                <ContentSection eyebrow="Required Skills" heading="What we're looking for">
                  <BulletList items={requirements} color="teal" />
                </ContentSection>
              )}

              {/* Preferred Skills */}
              {preferredSkills.length > 0 && (
                <ContentSection eyebrow="Preferred Skills" heading="Nice to have">
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    These are not mandatory, but they will make your application stand out.
                  </p>
                  <BulletList items={preferredSkills} color="slate" />
                </ContentSection>
              )}

              {/* Benefits */}
              <ContentSection eyebrow="Perks & Benefits" heading="What comes with the role">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEFAULT_BENEFITS.map((b) => (
                    <div key={b} className="flex items-start gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </ContentSection>

              {/* Career Growth */}
              {job.careerGrowth ? (
                <ContentSection eyebrow="Career Growth" heading="Your growth path at EMS">
                  <p className="text-slate-600 leading-relaxed text-sm">{job.careerGrowth}</p>
                </ContentSection>
              ) : (
                <ContentSection eyebrow="Career Growth" heading="Your growth path at EMS">
                  <p className="text-slate-600 leading-relaxed text-sm">
                    At Eddie Marketing Solutions, performance matters more than tenure. High performers are recognised quickly — through expanded responsibilities, senior title progression, and first consideration for leadership roles as the team grows. We promote internally wherever possible and build structured development plans for every team member.
                  </p>
                </ContentSection>
              )}

              {/* Application Process */}
              <ContentSection eyebrow="Application Process" heading="How we hire">
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Our process is transparent, fast, and respectful of your time. From application to offer in as little as two weeks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {APPLICATION_PROCESS.map((step) => (
                    <div key={step.n} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="text-2xl font-black text-slate-200 mb-2 leading-none">{step.n}</div>
                      <h4 className="text-xs font-bold text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </ContentSection>

              {/* FAQs */}
              {faqs.length > 0 && (
                <ContentSection eyebrow="FAQ" heading="Frequently asked questions">
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <details
                        key={faq.q}
                        className="group bg-white border border-slate-200 rounded-xl overflow-hidden open:border-blue-200"
                      >
                        <summary className="flex items-center justify-between gap-4 px-5 py-3.5 cursor-pointer list-none select-none group-open:bg-blue-50/40">
                          <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                          <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-5 pb-5 pt-2">
                          <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </ContentSection>
              )}

            </div>

            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <aside className="lg:sticky lg:top-24 space-y-4">

              {/* Quick details card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-950 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">Job Details</p>
                  <p className="text-white font-bold text-sm leading-snug">{job.title}</p>
                </div>
                <div className="divide-y divide-slate-100">
                  <SidebarRow icon="🏢" label="Department" value={job.department} />
                  <SidebarRow icon="📍" label="Location" value={job.location} />
                  <SidebarRow icon="💼" label="Employment Type" value={job.employmentType} />
                  <SidebarRow icon="🎓" label="Experience" value={job.experienceLevel} />
                  {job.salaryRange && (
                    <SidebarRow icon="💰" label="Salary" value={job.salaryRange} highlight />
                  )}
                  {job.publishedAt && (
                    <SidebarRow
                      icon="📅"
                      label="Posted"
                      value={job.publishedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    />
                  )}
                </div>
                <div className="px-5 py-4">
                  <a
                    href="#apply"
                    className="block w-full text-center px-4 py-2.5 rounded-lg ems-btn-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Apply for This Role
                  </a>
                </div>
              </div>

              {/* Share / careers links */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Also explore</p>
                <Link href="/careers/jobs" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-700 transition-colors py-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  All open positions
                </Link>
                <Link href="/internships" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-700 transition-colors py-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  Internship programme
                </Link>
                <Link href="/careers" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-700 transition-colors py-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  Life at Eddie
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </div>

      {/* ── Related Jobs ─────────────────────────────────────────────────── */}
      {relatedJobs.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Other roles in {job.department}</h2>
              <Link href="/careers/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                View all positions →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedJobs.map((rj) => (
                <Link
                  key={rj.id}
                  href={`/careers/jobs/${rj.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <span className="inline-flex text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full mb-3 block">
                    {rj.department}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2 leading-snug">
                    {rj.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span>📍 {rj.location}</span>
                    <span>💼 {rj.employmentType}</span>
                    <span>🎓 {rj.experienceLevel}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Application Form ─────────────────────────────────────────────── */}
      <div id="apply" className="scroll-mt-20" />
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — context */}
          <div className="bg-slate-900 text-white p-8 lg:p-10 flex flex-col justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-400 mb-3">
                Apply · {job.department}
              </p>
              <h2 className="text-2xl font-bold leading-snug mb-4">
                Apply for {job.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tell us about yourself and why you are a great fit. Our team reviews every application within 5 business days.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Applications reviewed within 5 business days",
                `${job.employmentType} · ${job.location}`,
                `${job.experienceLevel} experience required`,
                "Competitive salary benchmarked to UAE market",
                "Visa sponsorship available for eligible candidates",
                "Hybrid working — Dubai office + remote",
                "Mentorship, certifications, and growth support",
                "2–3 week average from application to offer",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <svg className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          {/* Right — form */}
          <div className="p-8 lg:p-10">
            <JobApplicationForm jobTitle={job.title} department={job.department} />
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContentSection({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">{eyebrow}</p>
      <h2 className="text-xl font-bold text-slate-900 mb-5 leading-snug">{heading}</h2>
      {children}
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: "blue" | "teal" | "slate" }) {
  const dotClass =
    color === "blue"
      ? "bg-blue-100 text-blue-600"
      : color === "teal"
      ? "bg-teal-50 text-teal-600"
      : "bg-slate-100 text-slate-500";

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${dotClass}`}>
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SidebarRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 gap-3">
      <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span className={`text-xs font-semibold text-right leading-snug ${highlight ? "ems-gradient-text" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}
