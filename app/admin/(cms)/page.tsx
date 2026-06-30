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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  contacted: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  qualified: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  "proposal-sent": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  won: "bg-green-50 text-green-700 ring-1 ring-green-200",
  lost: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-teal-500",
  "bg-orange-500", "bg-pink-500", "bg-indigo-500",
];

function avatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

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
    totalLeads, todayLeads, weekLeads, monthLeads, pendingLeads, wonLeads, activeLeads,
    recentLeads,
    recentSessions,
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
    prisma.lead.count({ where: { status: "won" } }),
    prisma.lead.count({ where: { status: { in: ["contacted", "qualified"] } } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, email: true, serviceInterest: true, createdAt: true, status: true, company: true, country: true },
    }),
    prisma.chatSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true, createdAt: true, landingPage: true, leadId: true,
        _count: { select: { messages: true } },
      },
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
    // Content gap engine
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
    leads: { totalLeads, todayLeads, weekLeads, monthLeads, pendingLeads, wonLeads, activeLeads, recentLeads },
    sessions: recentSessions,
    recent: { newestPost, newestCaseStudy, newestPortfolio, newestPage },
    gaps: { topRecs, criticalClusters },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, trend, accentBg, accentText, icon, href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "neutral" | "down";
  accentBg: string;
  accentText: string;
  icon: React.ReactNode;
  href: string;
}) {
  const trendIcon =
    trend === "up" ? (
      <span className="text-green-500 text-xs flex items-center gap-0.5">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
      </span>
    ) : trend === "down" ? (
      <span className="text-red-400 text-xs flex items-center gap-0.5">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" /></svg>
      </span>
    ) : null;

  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className={`absolute inset-x-0 top-0 h-0.5 ${accentBg}`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentBg} ${accentText}`}>
          {icon}
        </div>
        {trendIcon}
      </div>
      <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
      <p className="text-xs font-medium text-slate-500 mt-1.5">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </Link>
  );
}

function SectionHeader({
  title, sub, action,
}: {
  title: string; sub?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-500 ring-1 ring-slate-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${style}`}>
      {status.replace("-", " ")}
    </span>
  );
}

function StatusPill({ status }: { status: "healthy" | "warning" | "attention" }) {
  const map = {
    healthy: "bg-green-50 text-green-700 ring-1 ring-green-200",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    attention: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };
  const dotMap = { healthy: "bg-green-500", warning: "bg-amber-500", attention: "bg-red-500" };
  const label = { healthy: "Healthy", warning: "Warning", attention: "Needs Attention" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status]}`} />
      {label[status]}
    </span>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
        </svg>
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const { counts, leads, sessions, recent, gaps } = await getDashboardData();
  const { topRecs, criticalClusters } = gaps;

  const nowUtc = new Date();
  const uaeHour = (nowUtc.getUTCHours() + 4) % 24;
  const greeting = uaeHour < 12 ? "Good morning" : uaeHour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = nowUtc.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" });

  const conversionRate = leads.totalLeads > 0
    ? Math.round((leads.wonLeads / leads.totalLeads) * 100)
    : 0;

  return (
    <div className="pb-12 space-y-7">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-0.5">{dateStr}</p>
          <h1 className="text-xl font-bold text-slate-900">{greeting}, Edward</h1>
          <p className="text-sm text-slate-400 mt-0.5">Here&apos;s what&apos;s happening at Eddie Marketing Solutions.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            Live Site
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            New Lead
          </Link>
        </div>
      </div>

      {/* ── Top KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Leads"
          value={leads.totalLeads}
          sub={`${leads.monthLeads} this month`}
          trend="up"
          accentBg="bg-blue-600"
          accentText="text-white"
          href="/admin/leads"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
        />
        <KpiCard
          label="New Leads Today"
          value={leads.todayLeads}
          sub={`${leads.weekLeads} this week`}
          trend={leads.todayLeads > 0 ? "up" : "neutral"}
          accentBg="bg-emerald-500"
          accentText="text-white"
          href="/admin/leads"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
        />
        <KpiCard
          label="Active Conversations"
          value={leads.activeLeads}
          sub={`${leads.pendingLeads} unread`}
          trend={leads.activeLeads > 0 ? "up" : "neutral"}
          accentBg="bg-violet-500"
          accentText="text-white"
          href="/admin/leads?status=contacted"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>}
        />
        <KpiCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          sub={`${leads.wonLeads} leads won`}
          trend={conversionRate > 10 ? "up" : "neutral"}
          accentBg="bg-orange-500"
          accentText="text-white"
          href="/admin/leads/dashboard"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>}
        />
      </div>

      {/* ── Main content + Right sidebar ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left / Main (2/3) ───────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Recent Leads */}
          <div>
            <SectionHeader
              title="Recent Leads"
              sub="Latest enquiries from your website"
              action={
                <Link href="/admin/leads" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View all {leads.totalLeads} →
                </Link>
              }
            />
            <Card>
              {leads.recentLeads.length === 0 ? (
                <EmptyRow message="No leads yet. Your first enquiry will appear here." />
              ) : (
                <div className="divide-y divide-slate-100">
                  {leads.recentLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/admin/leads/${lead.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-full ${avatarColor(lead.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {initials(lead.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {lead.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {lead.company ? `${lead.company} · ` : ""}{lead.serviceInterest ?? lead.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={lead.status} />
                        <span className="text-[11px] text-slate-400 hidden sm:block">{timeAgo(lead.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Recent AI Conversations */}
          <div>
            <SectionHeader
              title="Recent AI Conversations"
              sub="Live chat sessions from the AI concierge"
              action={
                <Link href="/admin/leads/chat-sessions" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  View all →
                </Link>
              }
            />
            <Card>
              {sessions.length === 0 ? (
                <EmptyRow message="No chat sessions yet. AI conversations will appear here once visitors start chatting." />
              ) : (
                <div className="divide-y divide-slate-100">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {session.leadId ? (
                            <Link href={`/admin/leads/${session.leadId}`} className="hover:text-blue-600">
                              Linked to Lead #{session.leadId}
                            </Link>
                          ) : (
                            <span className="text-slate-400">Anonymous visitor</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {session.landingPage ?? "Unknown page"} · {session._count.messages} message{session._count.messages !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">{timeAgo(session.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <SectionHeader title="Recent Activity" sub="Latest published content" />
            <Card>
              <div className="divide-y divide-slate-100">
                {[
                  { type: "Blog Post", label: recent.newestPost?.title ?? null, meta: recent.newestPost?.publishedAt ? timeAgo(recent.newestPost.publishedAt) : null, href: recent.newestPost ? `/admin/posts/${recent.newestPost.slug}` : null, color: "bg-orange-100 text-orange-600", icon: "✍️" },
                  { type: "Case Study", label: recent.newestCaseStudy?.title ?? null, meta: recent.newestCaseStudy?.clientName ?? null, href: recent.newestCaseStudy ? `/admin/case-studies/${recent.newestCaseStudy.slug}` : null, color: "bg-violet-100 text-violet-600", icon: "📊" },
                  { type: "Portfolio", label: recent.newestPortfolio?.title ?? null, meta: "Portfolio project", href: recent.newestPortfolio ? `/admin/portfolio/${recent.newestPortfolio.slug}` : null, color: "bg-teal-100 text-teal-600", icon: "🎨" },
                  { type: "Page", label: recent.newestPage?.title ?? null, meta: recent.newestPage?.updatedAt ? timeAgo(new Date(recent.newestPage.updatedAt)) : null, href: recent.newestPage ? `/admin/pages/${recent.newestPage.slug}` : null, color: "bg-blue-100 text-blue-600", icon: "📄" },
                ].map(({ type, label, meta, href, color, icon }) => (
                  <div key={type} className="flex items-center gap-3 px-5 py-3.5">
                    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-sm shrink-0`}>{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{type}</p>
                      {label ? (
                        <p className="text-sm font-medium text-slate-800 truncate">{label}</p>
                      ) : (
                        <p className="text-sm text-slate-400">Nothing published yet</p>
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
            </Card>
          </div>

          {/* Publishing Centre / Content Gap Recommendations */}
          <div>
            <SectionHeader
              title="Publishing Centre"
              sub="Top content gap recommendations"
              action={
                <Link href="/admin/seo/content-gaps" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Full report →
                </Link>
              }
            />
            <Card>
              {topRecs.length === 0 ? (
                <EmptyRow message="No content gap recommendations right now. Great job!" />
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
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
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
                            <p className="text-xs font-bold text-slate-700">{Math.round(rec.priorityScore)}<span className="text-slate-400 font-normal">/100</span></p>
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
            </Card>
          </div>

        </div>

        {/* ── Right sidebar (1/3) ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Quick Actions */}
          <div>
            <SectionHeader title="Quick Actions" />
            <div className="space-y-2">
              {[
                { label: "Create Lead", sub: "Add a new contact", href: "/admin/leads", icon: "👤", color: "border-l-green-500 hover:border-l-green-600" },
                { label: "Open CRM", sub: "View all leads & pipeline", href: "/admin/leads", icon: "📋", color: "border-l-blue-500 hover:border-l-blue-600" },
                { label: "AI Concierge", sub: "Review chat sessions", href: "/admin/leads/chat-sessions", icon: "🤖", color: "border-l-violet-500 hover:border-l-violet-600" },
                { label: "Website Analytics", sub: "SEO health & gaps", href: "/admin/seo/site-health", icon: "📈", color: "border-l-orange-500 hover:border-l-orange-600" },
              ].map(({ label, sub, href, icon, color }) => (
                <Link
                  key={href + label}
                  href={href}
                  className={`flex items-center gap-3 bg-white border border-slate-200 border-l-2 ${color} rounded-xl px-4 py-3 hover:shadow-sm hover:border-slate-300 transition-all group`}
                >
                  <span className="text-lg shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Lead Pipeline Mini */}
          <div>
            <SectionHeader
              title="Lead Pipeline"
              action={
                <Link href="/admin/leads/dashboard" className="text-xs font-medium text-blue-600 hover:text-blue-700">Dashboard →</Link>
              }
            />
            <Card>
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
                {[
                  { label: "Today", val: leads.todayLeads },
                  { label: "This Week", val: leads.weekLeads },
                  { label: "This Month", val: leads.monthLeads },
                  { label: "Pending", val: leads.pendingLeads, accent: leads.pendingLeads > 0 ? "text-orange-600" : undefined },
                ].map(({ label, val, accent }) => (
                  <div key={label} className="p-4 text-center">
                    <p className={`text-xl font-bold ${accent ?? "text-slate-900"}`}>{val}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* SEO Command Center */}
          <div>
            <SectionHeader
              title="SEO Command Center"
              action={
                <Link href="/admin/seo/site-health" className="text-xs font-medium text-blue-600 hover:text-blue-700">Full report →</Link>
              }
            />
            <Card>
              <div className="divide-y divide-slate-100">
                {[
                  { label: "SEO Health", sub: "Metadata audit", href: "/admin/seo/site-health", badge: "Live", badgeColor: "bg-green-50 text-green-700 ring-1 ring-green-200" },
                  { label: "Content Gaps", sub: `${criticalClusters} clusters weak`, href: "/admin/seo/content-gaps", badge: criticalClusters > 0 ? "Action" : "Good", badgeColor: criticalClusters > 0 ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-green-50 text-green-700 ring-1 ring-green-200" },
                  { label: "Redirects", sub: `${counts.redirects} rules active`, href: "/admin/redirects", badge: "Active", badgeColor: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
                  { label: "Internal Links", sub: "Link structure", href: "/admin/seo/internal-links", badge: "Check", badgeColor: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
                  { label: "Technical SEO", sub: "Speed & markup", href: "/admin/seo/technical-seo", badge: "Review", badgeColor: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
                  { label: "Launch Audit", sub: "Pre-launch check", href: "/admin/seo/launch-audit", badge: "Audit", badgeColor: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
                ].map(({ label, sub, href, badge, badgeColor }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{label}</p>
                      <p className="text-[10px] text-slate-400">{sub}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${badgeColor}`}>{badge}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Website Health */}
          <div>
            <SectionHeader title="Website Health" />
            <Card>
              <div className="divide-y divide-slate-100">
                {[
                  { label: "Database", detail: "Prisma PostgreSQL", status: "healthy" as const },
                  { label: "Published Pages", detail: `${counts.publishedPages} of ${counts.pages} live`, status: counts.publishedPages > 0 ? "healthy" as const : "attention" as const },
                  { label: "Blog Content", detail: `${counts.publishedPosts} posts`, status: counts.publishedPosts > 50 ? "healthy" as const : counts.publishedPosts > 10 ? "warning" as const : "attention" as const },
                  { label: "Lead Forms", detail: leads.totalLeads > 0 ? `${leads.totalLeads} captured` : "Awaiting first lead", status: leads.totalLeads > 0 ? "healthy" as const : "warning" as const },
                  { label: "Content Gaps", detail: `${criticalClusters} clusters need coverage`, status: criticalClusters === 0 ? "healthy" as const : criticalClusters < 5 ? "warning" as const : "attention" as const },
                ].map(({ label, detail, status }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700">{label}</p>
                      <p className="text-[10px] text-slate-400">{detail}</p>
                    </div>
                    <StatusPill status={status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Content Stats */}
          <div>
            <SectionHeader
              title="Content Overview"
              action={
                <Link href="/admin/pages" className="text-xs font-medium text-blue-600 hover:text-blue-700">View all →</Link>
              }
            />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Pages", pub: counts.publishedPages, tot: counts.pages, href: "/admin/pages", color: "bg-blue-500" },
                { label: "Blog Posts", pub: counts.publishedPosts, tot: counts.posts, href: "/admin/posts", color: "bg-orange-500" },
                { label: "Services", pub: counts.publishedServices, tot: counts.services, href: "/admin/services", color: "bg-violet-500" },
                { label: "Industries", pub: counts.publishedIndustries, tot: counts.industries, href: "/admin/industries", color: "bg-pink-500" },
                { label: "Locations", pub: counts.publishedLocations, tot: counts.locations, href: "/admin/locations", color: "bg-emerald-500" },
                { label: "Case Studies", pub: counts.publishedCaseStudies, tot: counts.caseStudies, href: "/admin/case-studies", color: "bg-indigo-500" },
              ].map(({ label, pub, tot, href, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="bg-white border border-slate-200 rounded-xl p-3 hover:shadow-sm hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{pub}</p>
                  {tot !== pub && <p className="text-[10px] text-slate-400">{tot - pub} draft{tot - pub !== 1 ? "s" : ""}</p>}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Create */}
          <div>
            <SectionHeader title="Quick Create" />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Blog Post", href: "/admin/posts/new", icon: "✍️", color: "hover:bg-orange-50 hover:border-orange-200" },
                { label: "Page", href: "/admin/pages/new", icon: "📄", color: "hover:bg-blue-50 hover:border-blue-200" },
                { label: "Case Study", href: "/admin/case-studies/new", icon: "📊", color: "hover:bg-violet-50 hover:border-violet-200" },
                { label: "Portfolio", href: "/admin/portfolio/new", icon: "🎨", color: "hover:bg-teal-50 hover:border-teal-200" },
                { label: "Service", href: "/admin/services/new", icon: "⚙️", color: "hover:bg-indigo-50 hover:border-indigo-200" },
                { label: "Redirect", href: "/admin/redirects/new", icon: "↩️", color: "hover:bg-amber-50 hover:border-amber-200" },
              ].map(({ label, href, icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className={`bg-white border border-slate-200 rounded-xl p-2.5 text-center transition-all group ${color}`}
                >
                  <div className="text-base mb-1">{icon}</div>
                  <p className="text-[10px] font-medium text-slate-600 group-hover:text-slate-900 leading-tight">{label}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
