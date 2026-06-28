import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  computeCoverage,
  scoredRecommendations,
  type ScoredRecommendation,
} from "@/lib/content-gap-engine";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard | Admin" };

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDashboardData() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    pages, publishedPages,
    posts, publishedPosts,
    services, publishedServices,
    industries, publishedIndustries,
    locations, publishedLocations,
    portfolio, publishedPortfolio,
    caseStudies, publishedCaseStudies,
    redirects,
    totalLeads, todayLeads, weekLeads, monthLeads, pendingLeads,
    latestLead,
    newestPost, newestCaseStudy, newestPortfolio, newestPage,
    gapPosts, gapCaseStudies, gapPortfolio,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.page.count({ where: { status: "published" } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.service.count(),
    prisma.service.count({ where: { status: "published" } }),
    prisma.industry.count(),
    prisma.industry.count({ where: { status: "published" } }),
    prisma.location.count(),
    prisma.location.count({ where: { status: "published" } }),
    prisma.portfolioProject.count(),
    prisma.portfolioProject.count({ where: { status: "published" } }),
    prisma.caseStudy.count(),
    prisma.caseStudy.count({ where: { status: "published" } }),
    prisma.redirect.count(),
    // Leads
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, serviceInterest: true, createdAt: true, status: true, company: true },
    }),
    // Recent content
    prisma.blogPost.findFirst({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, publishedAt: true },
    }),
    prisma.caseStudy.findFirst({
      where: { status: "published" },
      orderBy: { updatedAt: "desc" },
      select: { slug: true, title: true, clientName: true },
    }),
    prisma.portfolioProject.findFirst({
      where: { status: "published" },
      orderBy: { updatedAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.page.findFirst({
      where: { status: "published" },
      orderBy: { updatedAt: "desc" },
      select: { slug: true, title: true, updatedAt: true },
    }),
    // Content gap engine inputs
    prisma.blogPost.findMany({
      where: { status: "published" },
      select: { title: true, categories: { select: { name: true } } },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published" },
      select: { title: true, serviceType: true, industry: true },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "published" },
      select: { title: true },
    }),
  ]);

  // Content Gap Engine
  const coverages = computeCoverage(CLUSTERS, {
    blogPosts: gapPosts,
    caseStudies: gapCaseStudies,
    portfolioProjects: gapPortfolio.map((p) => ({ title: p.title, services: [] as string[] })),
  });
  const topRecs = scoredRecommendations(coverages).slice(0, 5);
  const criticalClusters = coverages.filter((c) => c.status === "critical" || c.status === "weak").length;

  return {
    counts: {
      pages, publishedPages,
      posts, publishedPosts,
      services, publishedServices,
      industries, publishedIndustries,
      locations, publishedLocations,
      portfolio, publishedPortfolio,
      caseStudies, publishedCaseStudies,
      redirects,
    },
    leads: { totalLeads, todayLeads, weekLeads, monthLeads, pendingLeads, latestLead },
    recent: { newestPost, newestCaseStudy, newestPortfolio, newestPage },
    gaps: { topRecs, criticalClusters },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, accent, icon, href,
}: {
  label: string; value: string | number; sub?: string;
  accent: string; icon: React.ReactNode; href: string;
}) {
  return (
    <Link href={href} className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          {icon}
        </div>
        <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-1.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusPill({ status }: { status: "healthy" | "warning" | "attention" }) {
  const map = {
    healthy: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    attention: "bg-red-100 text-red-700",
  };
  const label = { healthy: "Healthy", warning: "Warning", attention: "Needs Attention" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "healthy" ? "bg-green-500" : status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
      {label[status]}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const { counts, leads, recent, gaps } = await getDashboardData();
  const { topRecs, criticalClusters } = gaps;

  // Time-based greeting (UTC+4 = UAE)
  const nowUtc = new Date();
  const uaeHour = (nowUtc.getUTCHours() + 4) % 24;
  const greeting = uaeHour < 12 ? "Good Morning" : uaeHour < 17 ? "Good Afternoon" : "Good Evening";

  const totalContent =
    counts.publishedPages + counts.publishedPosts + counts.publishedServices +
    counts.publishedIndustries + counts.publishedLocations + counts.publishedPortfolio + counts.publishedCaseStudies;

  return (
    <div className="space-y-8 pb-12">

      {/* ── Section 10: Welcome Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-7 py-6 shadow-lg">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
        <div className="relative">
          <p className="text-slate-400 text-sm font-medium mb-1">{greeting}</p>
          <h1 className="text-2xl font-bold text-white mb-0.5">Edward</h1>
          <p className="text-slate-400 text-sm mb-5">Welcome back to Eddie Marketing Solutions.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Pages", val: counts.publishedPages },
              { label: "Blog Posts", val: counts.publishedPosts },
              { label: "Services", val: counts.publishedServices },
              { label: "Industries", val: counts.publishedIndustries },
              { label: "Locations", val: counts.publishedLocations },
              { label: "Portfolio", val: counts.publishedPortfolio },
              { label: "Case Studies", val: counts.publishedCaseStudies },
              { label: "Leads", val: leads.totalLeads },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span className="text-white font-bold text-lg">{val}</span>
                <span className="text-slate-400 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Corner accent */}
        <div className="absolute right-6 top-4 w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20" />
        <div className="absolute right-10 top-8 w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30" />
      </div>

      {/* ── Section 1: Executive KPI Cards ────────────────────────────────── */}
      <div>
        <SectionHeader title="Executive Overview" sub="Live metrics across your marketing platform" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard
            label="Published Pages"
            value={counts.publishedPages}
            sub={`${counts.pages} total`}
            accent="bg-blue-100"
            href="/admin/pages"
            icon={<svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
          />
          <KpiCard
            label="Published Posts"
            value={counts.publishedPosts}
            sub={`${counts.posts} total`}
            accent="bg-orange-100"
            href="/admin/posts"
            icon={<svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>}
          />
          <KpiCard
            label="Services Live"
            value={counts.publishedServices}
            sub={`${counts.services} total`}
            accent="bg-violet-100"
            href="/admin/services"
            icon={<svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>}
          />
          <KpiCard
            label="New Leads"
            value={leads.pendingLeads}
            sub={`${leads.totalLeads} total`}
            accent={leads.pendingLeads > 0 ? "bg-green-100" : "bg-slate-100"}
            href="/admin/leads"
            icon={<svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
          />
          <KpiCard
            label="Content Gaps"
            value={criticalClusters}
            sub="clusters need coverage"
            accent="bg-amber-100"
            href="/admin/seo/content-gaps"
            icon={<svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>}
          />
          <KpiCard
            label="Redirects"
            value={counts.redirects}
            sub="active rules"
            accent="bg-teal-100"
            href="/admin/redirects"
            icon={<svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>}
          />
        </div>
      </div>

      {/* ── Section 3 + 7: Quick Actions & Website Navigation ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Quick Actions */}
        <div>
          <SectionHeader title="Quick Actions" sub="Create new content instantly" />
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "New Blog Post",   href: "/admin/posts/new",      color: "hover:bg-orange-50 hover:border-orange-200", icon: "✍️" },
              { label: "New Page",        href: "/admin/pages/new",      color: "hover:bg-blue-50 hover:border-blue-200",   icon: "📄" },
              { label: "New Case Study",  href: "/admin/case-studies/new", color: "hover:bg-violet-50 hover:border-violet-200", icon: "📊" },
              { label: "New Portfolio",   href: "/admin/portfolio/new",  color: "hover:bg-teal-50 hover:border-teal-200",   icon: "🎨" },
              { label: "New Service",     href: "/admin/services/new",   color: "hover:bg-indigo-50 hover:border-indigo-200", icon: "⚙️" },
              { label: "New Industry",    href: "/admin/industries/new", color: "hover:bg-pink-50 hover:border-pink-200",   icon: "🏭" },
              { label: "New Location",    href: "/admin/locations/new",  color: "hover:bg-emerald-50 hover:border-emerald-200", icon: "📍" },
              { label: "New Redirect",    href: "/admin/redirects/new",  color: "hover:bg-amber-50 hover:border-amber-200", icon: "↩️" },
              { label: "Add Lead",        href: "/admin/leads",          color: "hover:bg-green-50 hover:border-green-200", icon: "👤" },
            ].map(({ label, href, color, icon }) => (
              <Link
                key={href}
                href={href}
                className={`bg-white border border-slate-200 rounded-xl p-3 text-center transition-all group ${color}`}
              >
                <div className="text-xl mb-1.5">{icon}</div>
                <p className="text-xs font-medium text-slate-700 group-hover:text-slate-900 leading-tight">{label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Website Navigation */}
        <div>
          <SectionHeader title="Website Navigation" sub="Jump to any content area" />
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Pages",       href: "/admin/pages",       bg: "bg-blue-600",    icon: "📄", count: counts.pages },
              { label: "Blog",        href: "/admin/posts",       bg: "bg-orange-500",  icon: "✍️", count: counts.posts },
              { label: "Portfolio",   href: "/admin/portfolio",   bg: "bg-teal-600",    icon: "🎨", count: counts.portfolio },
              { label: "Case Studies",href: "/admin/case-studies",bg: "bg-violet-600",  icon: "📊", count: counts.caseStudies },
              { label: "Services",    href: "/admin/services",    bg: "bg-indigo-600",  icon: "⚙️", count: counts.services },
              { label: "Industries",  href: "/admin/industries",  bg: "bg-pink-600",    icon: "🏭", count: counts.industries },
              { label: "Locations",   href: "/admin/locations",   bg: "bg-emerald-600", icon: "📍", count: counts.locations },
              { label: "Leads",       href: "/admin/leads",       bg: "bg-green-600",   icon: "👤", count: leads.totalLeads },
              { label: "Redirects",   href: "/admin/redirects",   bg: "bg-slate-700",   icon: "↩️", count: counts.redirects },
            ].map(({ label, href, bg, icon, count }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white border border-slate-200 rounded-xl p-3 hover:shadow-sm hover:border-slate-300 transition-all flex flex-col items-center gap-1.5"
              >
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center text-sm`}>{icon}</div>
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 2: Content Statistics ─────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Content Statistics"
          sub="All published content across your marketing platform"
          action={
            <Link href="/admin/pages" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Pages",        pub: counts.publishedPages,       tot: counts.pages,        href: "/admin/pages",        color: "border-t-blue-500" },
            { label: "Blog Posts",   pub: counts.publishedPosts,       tot: counts.posts,        href: "/admin/posts",        color: "border-t-orange-500" },
            { label: "Services",     pub: counts.publishedServices,    tot: counts.services,     href: "/admin/services",     color: "border-t-violet-500" },
            { label: "Industries",   pub: counts.publishedIndustries,  tot: counts.industries,   href: "/admin/industries",   color: "border-t-pink-500" },
            { label: "Locations",    pub: counts.publishedLocations,   tot: counts.locations,    href: "/admin/locations",    color: "border-t-emerald-500" },
            { label: "Portfolio",    pub: counts.publishedPortfolio,   tot: counts.portfolio,    href: "/admin/portfolio",    color: "border-t-teal-500" },
            { label: "Case Studies", pub: counts.publishedCaseStudies, tot: counts.caseStudies,  href: "/admin/case-studies", color: "border-t-indigo-500" },
          ].map(({ label, pub, tot, href, color }) => (
            <Link
              key={href}
              href={href}
              className={`bg-white rounded-xl border border-slate-200 border-t-2 ${color} p-4 hover:shadow-sm hover:border-slate-300 transition-all`}
            >
              <p className="text-2xl font-bold text-slate-900">{pub}</p>
              <p className="text-xs font-medium text-slate-600 mt-1">{label}</p>
              {tot !== pub && (
                <p className="text-xs text-slate-400 mt-0.5">{tot - pub} draft{tot - pub !== 1 ? "s" : ""}</p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Section 4 + 6: SEO Command Center & Lead Centre ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* SEO Command Center */}
        <div>
          <SectionHeader
            title="SEO Command Center"
            sub="Monitor and improve search performance"
            action={
              <Link href="/admin/seo/site-health" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Full Report →
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "SEO Health",       sub: "Metadata audit",    href: "/admin/seo/site-health",      badge: "Live", badgeColor: "bg-green-100 text-green-700" },
              { label: "Content Gaps",     sub: `${criticalClusters} clusters weak`, href: "/admin/seo/content-gaps", badge: criticalClusters > 0 ? "Action" : "Good", badgeColor: criticalClusters > 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700" },
              { label: "Redirect Manager", sub: `${counts.redirects} rules`,   href: "/admin/redirects",            badge: "Active", badgeColor: "bg-blue-100 text-blue-700" },
              { label: "Internal Links",   sub: "Link structure",   href: "/admin/seo/internal-links",   badge: "Check", badgeColor: "bg-slate-100 text-slate-600" },
              { label: "Technical SEO",    sub: "Speed & markup",   href: "/admin/seo/technical-seo",    badge: "Review", badgeColor: "bg-slate-100 text-slate-600" },
              { label: "Launch Audit",     sub: "Pre-launch check", href: "/admin/seo/launch-audit",     badge: "Audit", badgeColor: "bg-violet-100 text-violet-700" },
            ].map(({ label, sub, href, badge, badgeColor }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{label}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                </div>
                <p className="text-xs text-slate-400">{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Lead Centre */}
        <div>
          <SectionHeader
            title="Lead Centre"
            sub="Incoming enquiries and pipeline"
            action={
              <Link href="/admin/leads/dashboard" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Full Dashboard →
              </Link>
            }
          />
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Stat row */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
              {[
                { label: "Today",     val: leads.todayLeads  },
                { label: "This Week", val: leads.weekLeads   },
                { label: "This Month",val: leads.monthLeads  },
                { label: "Pending",   val: leads.pendingLeads, accent: leads.pendingLeads > 0 ? "text-orange-600" : "text-slate-900" },
              ].map(({ label, val, accent }) => (
                <div key={label} className="p-4 text-center">
                  <p className={`text-xl font-bold ${accent ?? "text-slate-900"}`}>{val}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Latest lead */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Latest Lead</p>
              {leads.latestLead ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{leads.latestLead.name}</p>
                    {leads.latestLead.company && (
                      <p className="text-xs text-slate-400">{leads.latestLead.company}</p>
                    )}
                    {leads.latestLead.serviceInterest && (
                      <p className="text-xs text-slate-500 mt-1">{leads.latestLead.serviceInterest}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                      {leads.latestLead.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {leads.latestLead.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">No recent leads.</p>
              )}
            </div>

            <div className="px-5 pb-4">
              <Link
                href="/admin/leads"
                className="block w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors"
              >
                View All {leads.totalLeads} Leads →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Publishing Centre ──────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Publishing Centre"
          sub="Highest-priority content recommendations from the gap engine"
          action={
            <Link href="/admin/seo/content-gaps" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Full Gap Report →
            </Link>
          }
        />
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {topRecs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No recommendations available.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {topRecs.map((rec: ScoredRecommendation, i: number) => {
                const typeColors: Record<string, string> = {
                  blog: "bg-orange-100 text-orange-700",
                  "case-study": "bg-violet-100 text-violet-700",
                  portfolio: "bg-teal-100 text-teal-700",
                  tool: "bg-blue-100 text-blue-700",
                  academy: "bg-pink-100 text-pink-700",
                };
                const hrefs: Record<string, string> = {
                  blog: "/admin/posts/new",
                  "case-study": "/admin/case-studies/new",
                  portfolio: "/admin/portfolio/new",
                  tool: "/admin/pages/new",
                  academy: "/admin/posts/new",
                };
                return (
                  <div key={rec.slug} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-400 shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeColors[rec.contentType] ?? "bg-slate-100 text-slate-600"}`}>
                          {rec.contentType}
                        </span>
                        <span className="text-[10px] text-slate-400">{rec.clusterName}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{rec.title}</p>
                      <p className="text-xs text-slate-400 truncate">{rec.reason}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-slate-700">
                          {Math.round(rec.priorityScore)}<span className="text-slate-400 font-normal">/100</span>
                        </p>
                        <p className="text-[10px] text-slate-400">priority</p>
                      </div>
                      <Link
                        href={hrefs[rec.contentType] ?? "/admin/posts/new"}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Create →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 8 + 9: Recent Activity & Website Health ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Activity */}
        <div>
          <SectionHeader title="Recent Activity" sub="Latest published content" />
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {[
              {
                type: "Blog Post",
                label: recent.newestPost?.title ?? null,
                meta: recent.newestPost?.publishedAt?.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) ?? null,
                href: recent.newestPost ? `/admin/posts/${recent.newestPost.slug}` : null,
                color: "bg-orange-100 text-orange-600",
                icon: "✍️",
              },
              {
                type: "Case Study",
                label: recent.newestCaseStudy?.title ?? null,
                meta: recent.newestCaseStudy?.clientName ?? null,
                href: recent.newestCaseStudy ? `/admin/case-studies/${recent.newestCaseStudy.slug}` : null,
                color: "bg-violet-100 text-violet-600",
                icon: "📊",
              },
              {
                type: "Portfolio",
                label: recent.newestPortfolio?.title ?? null,
                meta: "Portfolio project",
                href: recent.newestPortfolio ? `/admin/portfolio/${recent.newestPortfolio.slug}` : null,
                color: "bg-teal-100 text-teal-600",
                icon: "🎨",
              },
              {
                type: "Page",
                label: recent.newestPage?.title ?? null,
                meta: recent.newestPage?.updatedAt
                  ? new Date(recent.newestPage.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                  : null,
                href: recent.newestPage ? `/admin/pages/${recent.newestPage.slug}` : null,
                color: "bg-blue-100 text-blue-600",
                icon: "📄",
              },
            ].map(({ type, label, meta, href, color, icon }) => (
              <div key={type} className="flex items-center gap-4 px-5 py-3.5">
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-sm shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{type}</p>
                  {label ? (
                    <p className="text-sm font-medium text-slate-800 truncate">{label}</p>
                  ) : (
                    <p className="text-sm text-slate-400">None published yet</p>
                  )}
                  {meta && <p className="text-xs text-slate-400">{meta}</p>}
                </div>
                {href && label && (
                  <Link href={href} className="shrink-0 text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Edit →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Website Health */}
        <div>
          <SectionHeader title="Website Health" sub="System status at a glance" />
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {[
              {
                label: "Database",
                detail: "Prisma PostgreSQL",
                status: "healthy" as const,
              },
              {
                label: "Published Pages",
                detail: `${counts.publishedPages} of ${counts.pages} pages live`,
                status: counts.publishedPages > 0 ? "healthy" as const : "attention" as const,
              },
              {
                label: "Blog Content",
                detail: `${counts.publishedPosts} posts published`,
                status: counts.publishedPosts > 50 ? "healthy" as const : counts.publishedPosts > 10 ? "warning" as const : "attention" as const,
              },
              {
                label: "Services Coverage",
                detail: `${counts.publishedServices} services live`,
                status: counts.publishedServices > 5 ? "healthy" as const : "warning" as const,
              },
              {
                label: "Lead Forms",
                detail: leads.totalLeads > 0 ? `${leads.totalLeads} leads captured` : "Awaiting first submission",
                status: leads.totalLeads > 0 ? "healthy" as const : "warning" as const,
              },
              {
                label: "Content Gaps",
                detail: `${criticalClusters} clusters need coverage`,
                status: criticalClusters === 0 ? "healthy" as const : criticalClusters < 5 ? "warning" as const : "attention" as const,
              },
              {
                label: "Redirect Rules",
                detail: `${counts.redirects} active redirects`,
                status: counts.redirects > 0 ? "healthy" as const : "warning" as const,
              },
            ].map(({ label, detail, status }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{detail}</p>
                </div>
                <StatusPill status={status} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
