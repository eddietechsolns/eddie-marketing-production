import Link from "next/link";
import type { InternshipCard } from "@/lib/internship-content";
import Button from "@/components/ui/Button";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";

// ─── Static content ──────────────────────────────────────────────────────────

const WHY_JOIN = [
  {
    icon: (
      <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Real client work from day one",
    body: "You won't be making coffee. Every intern is assigned to live client accounts and contributes to real campaigns with measurable outcomes.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Mentored by certified specialists",
    body: "Each intern is paired with a senior specialist in their field — Google-certified, Meta Blueprint-certified practitioners who have managed millions in ad spend.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Multi-industry UAE exposure",
    body: "Work across real estate, e-commerce, hospitality, healthcare, and more — giving you a breadth of experience that generic internships cannot match.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Portfolio & certification support",
    body: "Leave with a portfolio of real work, reference letters, and access to Google and Meta certification exam prep — credentials that open doors.",
  },
];

const BENEFITS = [
  { icon: "🏢", label: "Hybrid working", sub: "Office + remote flexibility" },
  { icon: "📊", label: "Live campaigns", sub: "Real budgets, real results" },
  { icon: "🎓", label: "Certifications", sub: "Google & Meta exam prep" },
  { icon: "🤝", label: "Mentorship", sub: "1-on-1 with specialists" },
  { icon: "📄", label: "Reference letter", sub: "On successful completion" },
  { icon: "💼", label: "Career guidance", sub: "CV & interview coaching" },
  { icon: "🎉", label: "Team events", sub: "Social & networking events" },
  { icon: "🌍", label: "UAE exposure", sub: "Multi-industry clients" },
];

const PROCESS_STEPS = [
  { n: "01", title: "Apply online", body: "Submit your application below. We review every submission within 3–5 business days. No agencies, no middlemen — direct contact with our team." },
  { n: "02", title: "Discovery call", body: "Shortlisted candidates are invited to a 20-minute video call with our HR team and the relevant department lead." },
  { n: "03", title: "Practical task", body: "Complete a brief, paid task relevant to your chosen discipline — showing us what you can do in a real-world context." },
  { n: "04", title: "Offer & onboarding", body: "Receive your internship offer, team introduction, first-day schedule, and a structured 30-day onboarding plan." },
];

const FAQS = [
  {
    q: "Are the internships paid?",
    a: "Yes. All internships at Eddie Marketing Solutions FZE include a monthly stipend. The amount varies by role and is confirmed at the offer stage.",
  },
  {
    q: "How long is the internship?",
    a: "Internships are typically 3–6 months. Duration is agreed upfront and can often be extended based on performance and business need.",
  },
  {
    q: "Can I apply if I am not based in Dubai?",
    a: "Yes. We consider candidates internationally, particularly for hybrid and remote-friendly roles. Visa support may be available for exceptional candidates.",
  },
  {
    q: "Do I need prior experience?",
    a: "No formal experience is required — we value curiosity, work ethic, and a genuine interest in digital marketing. A strong academic record or relevant side projects are a plus.",
  },
  {
    q: "Will I receive a reference letter?",
    a: "Yes. Interns who complete their programme successfully receive a personalised reference letter from their department head.",
  },
  {
    q: "Can interns convert to full-time roles?",
    a: "Yes — several of our current team members started as interns. High-performing interns are considered first for open positions.",
  },
  {
    q: "What disciplines do you offer internships in?",
    a: "We offer internship positions across SEO, Google Ads, content writing, graphic design, web development, social media, and analytics. New disciplines are added as the team grows.",
  },
  {
    q: "Is the internship remote or in-office?",
    a: "Our internships are hybrid — a mix of in-office days at our Dubai base and remote working. The exact split depends on your role and is confirmed at the offer stage.",
  },
];

const RELATED_RESOURCES = [
  { href: "/seo-services-dubai", label: "SEO Services Dubai" },
  { href: "/google-ads-management", label: "Google Ads Management" },
  { href: "/social-media-marketing", label: "Social Media Marketing" },
  { href: "/content-marketing-services", label: "Content Marketing" },
  { href: "/web-design-development-dubai", label: "Web Development" },
  { href: "/careers", label: "Careers at EMS" },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface RelatedPost {
  slug: string;
  title: string;
  publishedAt: Date | null;
  categories: { name: string }[];
}

interface Props {
  cards: InternshipCard[];
  relatedPosts?: RelatedPost[];
}

export function InternshipHubSection({ cards, relatedPosts = [] }: Props) {
  return (
    <>
      {/* ── Programme Overview ────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Programme Overview</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
                A paid internship programme built for real-world impact
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our internship programme is structured, mentored, and designed to deliver measurable professional growth. Interns are embedded within active client teams — not isolated in training environments.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                We are a specialist digital marketing agency headquartered in Dubai, serving clients across the UAE and GCC. Every intern is assigned to live client accounts, contributing to real campaigns with measurable outcomes from week one.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="accent" size="md" href="#positions">
                  View Open Positions
                </Button>
                <Button variant="ghost" size="md" href="#apply" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  Apply Now
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "Paid", label: "Monthly stipend included for all positions" },
                { stat: "3–6", label: "Month internship duration, extendable" },
                { stat: "UAE & GCC", label: "Multi-industry client base" },
                { stat: "Full-time", label: "Pathway for top-performing interns" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-2xl font-black ems-gradient-text mb-1">{item.stat}</p>
                  <p className="text-xs text-slate-500 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Join EMS ─────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-200 py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
              Why Eddie Marketing Solutions
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              An internship that actually builds your career
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_JOIN.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internship Benefits ───────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Internship Benefits</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">What's included in every internship</h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              All internship positions at Eddie Marketing Solutions come with the same core set of benefits — regardless of discipline or duration.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xl mb-1">{b.icon}</span>
                <span className="text-sm font-bold text-slate-900 leading-snug">{b.label}</span>
                <span className="text-xs text-slate-500 leading-snug">{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Internship Positions ────────────────────────────── */}
      <section className="bg-slate-950 py-14 md:py-20" id="positions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Open Roles</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Available internship positions
              </h2>
              <p className="text-slate-400 mt-2 text-sm max-w-xl">
                All positions are based in Dubai with hybrid flexibility. New positions are added regularly — apply now or submit a general application below.
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-900/40 border border-teal-700 text-xs font-semibold text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              {cards.length} {cards.length === 1 ? "position" : "positions"} open
            </span>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-lg font-medium text-white mb-2">No positions listed yet</p>
              <p className="text-sm text-slate-400 mb-6">Submit a general application — we review them as positions open.</p>
              <Button variant="accent" size="md" href="#apply">
                Submit General Application
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cards.map((card) => (
                <InternshipPositionCard key={card.slug} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Recruitment Timeline ─────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Recruitment Timeline</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              How we hire
            </h2>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Our process is transparent, fast, and respectful of your time. From application to offer in as little as two weeks.
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-slate-200" style={{ marginLeft: "3.5rem", marginRight: "3.5rem" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.n} className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white font-black text-xs">{step.n}</span>
                    </div>
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="lg:hidden flex-1 h-px bg-slate-200" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Life at EMS / Stats ───────────────────────────────────────── */}
      <section className="bg-blue-950 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Our culture</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                Life at Eddie Marketing Solutions
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm mb-3">
                We are a fast-paced but people-first agency. Interns sit alongside full-time specialists, attend client briefings, and are expected to contribute ideas. Learning is part of every working day.
              </p>
              <p className="text-slate-400 leading-relaxed text-sm mb-6">
                We invest in your growth — not just the campaign deliverables. That means regular feedback sessions, open access to senior team members, and a culture that rewards curiosity and initiative.
              </p>
              <Button variant="accent" size="md" href="#apply">
                Apply Now
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "100%", label: "Interns work on live client accounts" },
                { stat: "Paid", label: "Monthly stipend for all positions" },
                { stat: "3–6m", label: "Standard internship duration" },
                { stat: "Full-time", label: "Pathways available for top performers" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-2xl font-bold ems-gradient-text mb-1">{item.stat}</p>
                  <p className="text-xs text-slate-400 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Frequently asked questions</h2>
            <p className="text-slate-500 text-sm mt-2">Everything you need to know about our internship programme.</p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden open:border-blue-200"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none group-open:bg-blue-50/40">
                  <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-2">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Resources ────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-4">Related Resources</p>
          <div className="flex flex-wrap gap-2">
            {RELATED_RESOURCES.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {r.label}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Articles ─────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-12 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  {post.categories[0]?.name && (
                    <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                      {post.categories[0].name}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors mb-1">
                    {post.title}
                  </h3>
                  {post.publishedAt && (
                    <time className="text-xs text-slate-400" dateTime={post.publishedAt.toISOString()}>
                      {post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Application CTA ──────────────────────────────────────────── */}
      <div id="apply" />
      <LeadCaptureSection
        title="Apply for an internship at Eddie Marketing Solutions"
        description="Tell us about yourself and the discipline you are interested in. Our team reviews every application and responds within 5 business days."
        submitLabel="Submit Application"
        eyebrow="Apply Now"
        bullets={[
          "Paid monthly stipend for all internship positions",
          "3–6 month duration with full-time pathway for top performers",
          "Work on live client accounts from week one",
          "1-on-1 mentorship from Google and Meta certified specialists",
          "Hybrid working — Dubai office + remote flexibility",
          "Google and Meta certification exam prep included",
          "Reference letter upon successful completion",
          "Applications reviewed within 5 business days",
        ]}
      />
    </>
  );
}

// ─── Position card ───────────────────────────────────────────────────────────

function InternshipPositionCard({ card }: { card: InternshipCard }) {
  return (
    <Link
      href={`/${card.slug}`}
      className="group flex flex-col bg-white/5 border border-white/10 rounded-xl p-5 hover:border-teal-500/50 hover:bg-white/10 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 bg-teal-900/40 border border-teal-700/50 px-2.5 py-1 rounded-full">
          {card.department}
        </span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{card.employmentType}</span>
      </div>

      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors leading-snug mb-2">
        {card.title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">{card.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { icon: "📍", text: card.location },
          { icon: "⏱", text: card.duration },
          { icon: "🎓", text: card.experience },
          { icon: "💼", text: card.employmentType },
        ].map((m) => (
          <div key={m.text} className="flex items-center gap-1.5">
            <span className="text-[11px]">{m.icon}</span>
            <span className="text-[11px] text-slate-400 leading-tight">{m.text}</span>
          </div>
        ))}
      </div>

      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-400 group-hover:text-teal-300 transition-colors">
        View & apply
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
