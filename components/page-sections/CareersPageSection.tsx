import Link from "next/link";
import type { InternshipCard } from "@/lib/internship-content";
import Button from "@/components/ui/Button";
import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";

// ─── Static content ─────────────────────────────────────────────────────────

const WHY_JOIN = [
  { icon: "🚀", title: "Real client projects", body: "Work on live UAE and GCC campaigns from day one — no busy work, no simulations." },
  { icon: "🧠", title: "Experienced mentors", body: "Learn directly from Google-certified and Meta-certified specialists who have managed millions in ad spend." },
  { icon: "⚡", title: "AI-powered workflows", body: "We integrate modern AI tools across SEO, content, ads, and analytics so you stay ahead of the curve." },
  { icon: "📈", title: "Flexible growth", body: "We invest in your development. Training budgets, certifications, and internal promotions are part of the culture." },
  { icon: "🤝", title: "Collaborative culture", body: "Small teams, big accountability. Your ideas are heard and acted on — regardless of your level." },
  { icon: "🌍", title: "Diverse exposure", body: "Clients across real estate, e-commerce, hospitality, healthcare, and more — broad experience that accelerates your career." },
  { icon: "📚", title: "Continuous learning", body: "Weekly team knowledge sessions, external certifications, and a library of resources for every discipline." },
];

const DEPARTMENTS = [
  { name: "SEO", icon: "🔍", desc: "Technical, on-page, and off-page optimisation" },
  { name: "Google Ads", icon: "📊", desc: "Search, Display, Shopping, and YouTube campaigns" },
  { name: "Social Media", icon: "📱", desc: "Strategy, content, and paid social across platforms" },
  { name: "Content Marketing", icon: "✍️", desc: "Strategy, writing, and distribution" },
  { name: "Web Development", icon: "💻", desc: "WordPress, custom builds, and performance" },
  { name: "UI/UX Design", icon: "🎨", desc: "User-centred design for web and mobile" },
  { name: "Graphic Design", icon: "🖌️", desc: "Brand assets, ads, and campaign creatives" },
  { name: "Analytics", icon: "📉", desc: "GA4, Looker Studio, and data strategy" },
  { name: "AI Automation", icon: "🤖", desc: "Prompt engineering, workflow automation, LLM tools" },
  { name: "Sales", icon: "🤝", desc: "B2B outreach and lead qualification" },
  { name: "Business Development", icon: "🏢", desc: "Partnerships, strategy, and market expansion" },
  { name: "Operations", icon: "⚙️", desc: "Project management and process optimisation" },
];

const LIFE_ITEMS = [
  { label: "Innovation", desc: "We experiment with emerging tools and channels before they go mainstream." },
  { label: "Learning", desc: "Certifications, sessions, and budget for external development are standard." },
  { label: "Mentorship", desc: "Senior team members are accessible, generous with knowledge, and actively invested in your growth." },
  { label: "Ownership", desc: "We hire people who take initiative. If you spot an opportunity, you'll have the support to act on it." },
  { label: "Remote collaboration", desc: "Hybrid-first culture with clear async workflows and regular in-person touchpoints." },
  { label: "Professional development", desc: "From Google certifications to industry events, we fund your professional growth." },
];

const BENEFITS = [
  { label: "Competitive salary", sub: "Benchmarked against UAE market" },
  { label: "Hybrid working", sub: "Office + remote flexibility" },
  { label: "Certification budget", sub: "Google, Meta, and more" },
  { label: "Learning stipend", sub: "Books, courses, and events" },
  { label: "Health coverage", sub: "UAE medical insurance" },
  { label: "Annual leave", sub: "30 days per year" },
  { label: "Visa sponsorship", sub: "UAE residency support" },
  { label: "Team events", sub: "Regular socials and retreats" },
];

const HIRING_PROCESS = [
  { n: "01", label: "Apply", detail: "Submit your CV and a short cover note. We review every application within 5 business days." },
  { n: "02", label: "Initial review", detail: "Our hiring team reviews your background and reaches out to shortlisted candidates." },
  { n: "03", label: "Interview", detail: "A 30-minute video call with the hiring manager and a department lead." },
  { n: "04", label: "Practical assessment", detail: "A short, paid task relevant to your discipline — showing us what you can do." },
  { n: "05", label: "Offer", detail: "Successful candidates receive a formal offer within 48 hours of the final stage." },
  { n: "06", label: "Onboarding", detail: "A structured 30-day onboarding plan with your mentor and team from day one." },
];

const FAQS = [
  { q: "Where is the office?", a: "We are headquartered in Dubai, UAE. Many roles offer hybrid or remote arrangements depending on the position and department." },
  { q: "Do you sponsor visas?", a: "Yes. We offer UAE residency visa sponsorship for eligible full-time positions. Details are confirmed at the offer stage." },
  { q: "Do you hire internationally?", a: "Yes. We hire from around the world, particularly for roles that can be performed remotely or where UAE relocation is part of the package." },
  { q: "What is the typical hiring timeline?", a: "From application to offer, our process typically takes 2–3 weeks. We move faster when both sides are ready." },
  { q: "Are internships paid?", a: "Yes. All internship positions at Eddie Marketing Solutions include a monthly stipend. The amount varies by role." },
  { q: "Do you offer graduate programmes?", a: "We are developing a structured graduate programme for top university talent. Sign up to our talent pool to be notified when it launches." },
  { q: "Can I apply for multiple roles?", a: "Yes. Apply for each role separately so we can match you to the best fit. If you are unsure, send a general enquiry and we will guide you." },
  { q: "How do I know if my application was received?", a: "You will receive an automatic confirmation. If you do not hear back within 7 days, feel free to follow up at careers@eddietechsolns.com." },
];

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  internshipCards: InternshipCard[];
  relatedPosts: { slug: string; title: string; publishedAt: Date | null; categories: { name: string }[] }[];
}

export function CareersPageSection({ internshipCards, relatedPosts }: Props) {
  return (
    <>
      {/* ── Subtitle strip ────────────────────────────────────────────── */}
      <div className="bg-blue-950 border-b border-blue-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            Join a team building modern digital marketing, AI, SEO, paid advertising, analytics, web development, and creative solutions across the UAE and beyond.
          </p>
        </div>
      </div>

      {/* ── Why Join Eddie ────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Why Eddie</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
              Why join Eddie Marketing Solutions?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We are a specialist digital marketing agency headquartered in Dubai, growing fast across the UAE and GCC. We hire talented people who want to do great work and grow with us.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_JOIN.slice(0, 4).map((item) => (
              <div key={item.title} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {WHY_JOIN.slice(4).map((item) => (
              <div key={item.title} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Departments ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-200 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Teams</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              Where you could work
            </h2>
            <p className="text-slate-600 mt-2 leading-relaxed">
              We hire specialists, not generalists. Find your discipline and apply where your skills are strongest.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.name}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="text-xl mb-2 block">{dept.icon}</span>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{dept.name}</h3>
                <p className="text-[11px] text-slate-500 leading-snug">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Opportunities ────────────────────────────────────────── */}
      <section id="positions" className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Open Roles</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              Current opportunities
            </h2>
          </div>

          {/* Internships */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-[10px] font-bold">I</span>
                Internship Positions
              </h3>
              <Link href="/internships" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                View all internships →
              </Link>
            </div>
            {internshipCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {internshipCards.map((card) => (
                  <InternshipOpportunityCard key={card.slug} card={card} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-500">No internship positions listed at the moment.</p>
                <Link href="/internships" className="text-xs font-semibold text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Visit the Internship Programme →
                </Link>
              </div>
            )}
          </div>

          {/* Full-time Jobs — placeholder */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">J</span>
                Full-Time Positions
              </h3>
            </div>
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
              <p className="text-sm font-medium text-slate-700 mb-1">No full-time vacancies listed right now</p>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                We hire on a rolling basis. Submit a general application and we will reach out when a suitable role opens.
              </p>
              <Button variant="accent" size="sm" href="#apply">
                Submit General Application
              </Button>
            </div>
          </div>

          {/* Graduate Programmes — future */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-[10px] font-bold">G</span>
                Graduate Programme
              </h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Coming soon</span>
            </div>
            <div className="bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="text-sm font-bold text-white mb-1">EMS Graduate Leadership Programme</p>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  A structured two-year programme for top graduates, rotating across SEO, Ads, Analytics, and Content teams with mentorship and fast-track progression. Launching in 2025.
                </p>
              </div>
              <Button variant="ghost" size="sm" href="#apply" className="shrink-0 text-slate-300 hover:text-white hover:bg-white/10 whitespace-nowrap">
                Join talent pool
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Life at Eddie ─────────────────────────────────────────────── */}
      <section className="bg-blue-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Culture</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                Life at Eddie Marketing Solutions
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm mb-6">
                We are a team of specialists who care about the craft. Every person here is expected to think critically, challenge the status quo, and take ownership of their work. In return, we invest in your career.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LIFE_ITEMS.map((item) => (
                  <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-sm font-bold text-white mb-1">{item.label}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "UAE & GCC", label: "Clients across the region" },
                { stat: "10+", label: "Marketing disciplines under one roof" },
                { stat: "Hybrid", label: "Flexible working for all roles" },
                { stat: "Fast", label: "2–3 week average hiring timeline" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                  <p className="text-3xl font-black ems-gradient-text mb-2">{item.stat}</p>
                  <p className="text-xs text-slate-400 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Perks & Benefits</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">What comes with the role</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-bold text-slate-900 mb-0.5">{b.label}</p>
                <p className="text-xs text-slate-500">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hiring Process ────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-200 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Process</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Our hiring process</h2>
            <p className="text-slate-600 mt-2 leading-relaxed">Straightforward, transparent, and designed to find the best fit — for you and for us.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {HIRING_PROCESS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < HIRING_PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-4 left-full w-full h-px bg-slate-200 z-0" style={{ left: "calc(50% + 1rem)", width: "calc(100% - 2rem)" }} />
                )}
                <div className="relative z-10">
                  <div className="text-2xl font-black text-slate-200 mb-2 leading-none">{step.n}</div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{step.label}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden open:border-blue-200"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none group-open:bg-blue-50/40">
                  <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                  <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      {/* ── Related Articles ──────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Related Resources</h2>
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

      {/* ── Application CTA ───────────────────────────────────────────── */}
      <div id="apply" />
      <LeadCaptureSection
        title="Ready to join Eddie Marketing Solutions?"
        description="Whether you are applying for a specific role or just want to get on our radar, send us your details and we will reach out when the right opportunity arises."
        submitLabel="Send Application"
        eyebrow="Join Our Team"
        bullets={[
          "Applications reviewed within 5 business days",
          "Roles across SEO, Ads, Content, Design, Tech, and more",
          "Internship and full-time positions available",
          "Visa sponsorship for UAE residency available",
          "Competitive salary benchmarked to the UAE market",
          "Mentorship, certifications, and growth support",
          "Hybrid working across Dubai and remote",
          "Fast hiring — 2–3 week average from application to offer",
        ]}
      />
    </>
  );
}

// ─── Internship card (mini version for careers hub) ──────────────────────────

function InternshipOpportunityCard({ card }: { card: InternshipCard }) {
  return (
    <Link
      href={`/${card.slug}`}
      className="group flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[11px] font-bold text-teal-600">I</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-0.5">
          {card.title}
        </h4>
        <p className="text-xs text-slate-500 mb-2">{card.department} · {card.location}</p>
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
          View details
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
