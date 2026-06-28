import Link from "next/link";
import type { InternshipCard } from "@/lib/internship-content";
import { ContentBlockRenderer } from "./ContentBlockRenderer";
import { InternshipApplicationForm } from "@/components/leads/InternshipApplicationForm";
import Button from "@/components/ui/Button";

interface Props {
  card: InternshipCard;
  cleanedContent: string;
  excerpt: string | null;
  relatedInternships: InternshipCard[];
  slug: string;
}

const WHAT_YOU_LEARN = [
  "UAE market dynamics and consumer search behaviour",
  "How to plan, execute, and report on digital campaigns",
  "Client communication and professional presentation skills",
  "Industry-standard tools: Google Ads, Meta Ads, Analytics 4, Looker Studio",
  "SEO, content strategy, and performance measurement",
  "Agency workflows, briefing processes, and approval cycles",
];

const CANDIDATE_TRAITS = [
  "Currently enrolled in or recently graduated from a marketing, communications, or business degree",
  "Highly organised with strong attention to detail",
  "Curious about digital marketing with some self-directed learning (courses, projects, blogs)",
  "Comfortable working in a fast-paced, deadline-driven environment",
  "Excellent written English — additional Arabic or Hindi is a bonus",
  "Based in Dubai or able to work hybrid from the UAE",
];

const INTERN_BENEFITS = [
  { label: "Monthly stipend", detail: "Competitive internship allowance" },
  { label: "Live client work", detail: "Real campaigns, real budgets" },
  { label: "Certification support", detail: "Google & Meta exam prep included" },
  { label: "Reference letter", detail: "On successful programme completion" },
  { label: "Career coaching", detail: "CV review and interview prep" },
  { label: "Full-time pathway", detail: "Top performers considered for roles" },
];

const CAREER_PATH = [
  { phase: "Month 1–2", title: "Foundation & orientation", desc: "Shadow senior team members, complete platform training, and contribute to live tasks." },
  { phase: "Month 3–4", title: "Independent contribution", desc: "Own campaign components, attend client meetings, and produce deliverables under mentorship." },
  { phase: "Month 5–6", title: "Advanced responsibility", desc: "Lead small projects, present results to clients, and build your portfolio of real work." },
  { phase: "Beyond", title: "Full-time or referral", desc: "Outstanding interns are considered for full-time roles or receive a strong industry referral." },
];

const PROCESS_STEPS = [
  { n: "01", label: "Apply below", detail: "Submit your application form — takes under 5 minutes." },
  { n: "02", label: "Application review", detail: "Our HR team reviews all applications within 3–5 business days." },
  { n: "03", label: "Discovery call", detail: "Shortlisted candidates are invited to a 20-minute intro call." },
  { n: "04", label: "Task & offer", detail: "Complete a brief task, then receive your internship offer." },
];

export function InternshipPageSection({ card, cleanedContent, excerpt, relatedInternships, slug }: Props) {
  return (
    <>
      {/* ── Position meta badges ──────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 items-center">
            {[
              { icon: "🏢", text: card.department },
              { icon: "📍", text: card.location },
              { icon: "⏱", text: card.duration },
              { icon: "🎓", text: card.experience },
              { icon: "💼", text: card.employmentType },
            ].map((m) => (
              <span key={m.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                <span>{m.icon}</span>
                {m.text}
              </span>
            ))}
            <span className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-700">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Now Accepting Applications
            </span>
          </div>
        </div>
      </section>

      {/* ── Main content area ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">

          {/* Left: content + structured sections */}
          <div className="min-w-0 space-y-12">

            {/* Role summary */}
            {(excerpt || card.description) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Role Summary</p>
                <p className="text-slate-700 leading-relaxed text-base">
                  {excerpt ?? card.description}
                </p>
              </div>
            )}

            {/* CMS content (responsibilities, requirements from WP) */}
            {cleanedContent && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Role Details</p>
                <ContentBlockRenderer
                  html={cleanedContent}
                  excerpt={null}
                  showFaq={false}
                  slug={slug}
                />
              </div>
            )}

            {/* Skills You'll Learn */}
            <div className="bg-blue-950 rounded-2xl p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Skills & Growth</p>
              <h2 className="text-xl font-bold text-white mb-5 leading-tight">What you&apos;ll learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WHAT_YOU_LEARN.map((skill) => (
                  <li key={skill} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Who Should Apply */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Ideal Candidate</p>
              <h2 className="text-xl font-bold text-slate-900 mb-5">Who should apply</h2>
              <ul className="space-y-3">
                {CANDIDATE_TRAITS.map((trait) => (
                  <li key={trait} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {trait}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Benefits</p>
              <h2 className="text-xl font-bold text-slate-900 mb-5">What you get</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INTERN_BENEFITS.map((b) => (
                  <div key={b.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-slate-900 mb-0.5">{b.label}</p>
                    <p className="text-xs text-slate-500">{b.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Path */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Progression</p>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Career path</h2>
              <div className="relative pl-8 space-y-8">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />
                {CAREER_PATH.map((step) => (
                  <div key={step.phase} className="relative">
                    <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-teal-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-teal-400" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-600 mb-1">{step.phase}</p>
                    <p className="text-sm font-bold text-slate-900 mb-1">{step.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruitment Process */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Process</p>
              <h2 className="text-xl font-bold text-slate-900 mb-6">How to apply</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {PROCESS_STEPS.map((step) => (
                  <div key={step.n} className="flex items-start gap-4">
                    <span className="text-2xl font-black text-slate-200 leading-none shrink-0">{step.n}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-0.5">{step.label}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: sticky apply panel */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-xs font-semibold text-teal-700">Now accepting applications</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{card.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{card.location} · {card.duration}</p>
              <Button variant="accent" size="md" href="#apply" fullWidth>
                Apply for this role
              </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">Position details</h3>
              <dl className="space-y-2.5">
                {[
                  { label: "Department", value: card.department },
                  { label: "Duration", value: card.duration },
                  { label: "Location", value: card.location },
                  { label: "Type", value: card.employmentType },
                  { label: "Level", value: card.experience },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between gap-2">
                    <dt className="text-xs text-slate-500 shrink-0">{d.label}</dt>
                    <dd className="text-xs font-medium text-slate-800 text-right">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">More internships</h3>
              {relatedInternships.length > 0 ? (
                <ul className="space-y-2">
                  {relatedInternships.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/${r.slug}`} className="block group">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">{r.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{r.department}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">More positions coming soon.</p>
              )}
              <Link href="/internships" className="block mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                All internships →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Related internship cards ──────────────────────────────────── */}
      {relatedInternships.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">More Positions</p>
              <h2 className="text-2xl font-bold text-slate-900">Related internship opportunities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedInternships.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <span className="inline-flex items-center text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full mb-3">
                    {r.department}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-1">{r.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{r.location} · {r.duration}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                    View details
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Application form ──────────────────────────────────────────── */}
      <section id="apply" className="bg-white border-t border-slate-200 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Apply Now</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
                Apply for the {card.title}
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Fill in the form and we&apos;ll review your application within 3–5 business days. Shortlisted candidates will be invited to a short intro call.
              </p>
              <ul className="space-y-3">
                {[
                  "Application reviewed within 3–5 business days",
                  "Paid internship with monthly stipend",
                  "Work on live UAE client campaigns",
                  "Mentored by certified digital marketing specialists",
                  "Reference letter on successful completion",
                  "Full-time pathway for outstanding interns",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
              <InternshipApplicationForm positionTitle={card.title} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
