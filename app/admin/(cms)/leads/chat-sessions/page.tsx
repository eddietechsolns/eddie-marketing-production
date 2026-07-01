import { prisma } from "@/lib/prisma";
import ChatSessionsTable, { SerializedSession } from "@/components/admin/ChatSessionsTable";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Chat Sessions | Admin" };

const SERVICE_KEYWORDS = [
  "SEO", "Google Ads", "Social Media", "Website", "Content Marketing",
  "Email Marketing", "Analytics", "PPC", "Branding", "Video", "Lead Generation",
];

function detectServiceFromText(text: string): string | null {
  return SERVICE_KEYWORDS.find((s) => text.toLowerCase().includes(s.toLowerCase())) ?? null;
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function sp(v: string | string[] | undefined): string {
  return typeof v === "string" ? v.trim() : "";
}

export default async function ChatSessionsPage({ searchParams }: Props) {
  const raw = await searchParams;

  const filterDateFrom  = sp(raw.dateFrom);
  const filterDateTo    = sp(raw.dateTo);
  const filterLanding   = sp(raw.landing);
  const filterService   = sp(raw.service);
  const filterCountry   = sp(raw.country);
  const filterDevice    = sp(raw.device);
  const filterLead      = sp(raw.leadCaptured); // "yes" | "no" | ""

  const activeFilters = !!(
    filterDateFrom || filterDateTo || filterLanding ||
    filterService || filterCountry || filterDevice || filterLead
  );

  // ── Build where clause ────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (filterDateFrom || filterDateTo) {
    where.createdAt = {};
    if (filterDateFrom) where.createdAt.gte = new Date(filterDateFrom);
    if (filterDateTo) {
      const end = new Date(filterDateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  if (filterLanding)  where.landingPage = filterLanding;
  if (filterDevice)   where.utmMedium   = filterDevice;
  if (filterLead === "yes") where.leadId = { not: null };
  if (filterLead === "no")  where.leadId = null;

  if (filterService) {
    where.messages = {
      some: {
        content: { contains: filterService, mode: "insensitive" },
      },
    };
  }

  if (filterCountry) {
    where.lead = { country: filterCountry };
  }

  // ── Fetch sessions ────────────────────────────────────────────────────────
  const [sessions, totalSessions, leadsCreated, filteredCount] = await Promise.all([
    prisma.chatSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        lead: { select: { id: true, name: true, email: true, status: true } },
      },
    }),
    prisma.chatSession.count(),
    prisma.chatSession.count({ where: { leadId: { not: null } } }),
    prisma.chatSession.count({ where }),
  ]);

  // ── Filter dropdown options ────────────────────────────────────────────────
  const [landingRaw, deviceRaw, countryRaw] = await Promise.all([
    prisma.chatSession.groupBy({
      by: ["landingPage"],
      where: { landingPage: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.chatSession.groupBy({
      by: ["utmMedium"],
      where: { utmMedium: { not: null } },
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["country"],
      where: {
        country: { not: null },
        chatSessions: { some: {} },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  // ── Aggregate stats ───────────────────────────────────────────────────────
  const avgMessages = sessions.length
    ? Math.round(sessions.reduce((acc, s) => acc + s.messages.length, 0) / sessions.length)
    : 0;
  const conversionRate = totalSessions
    ? Math.round((leadsCreated / totalSessions) * 100)
    : 0;

  // ── Serialize ─────────────────────────────────────────────────────────────
  const serialized: SerializedSession[] = sessions.map((s) => {
    const allText = s.messages.map((m) => m.content).join(" ");
    return {
      id: s.id,
      visitorId: s.visitorId,
      landingPage: s.landingPage,
      utmSource: s.utmSource,
      utmMedium: s.utmMedium,
      utmCampaign: s.utmCampaign,
      createdAt: s.createdAt.toISOString(),
      messages: s.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
      lead: s.lead
        ? { id: s.lead.id, name: s.lead.name, email: s.lead.email, status: s.lead.status }
        : null,
      serviceIntent: detectServiceFromText(allText),
      messageCount: s.messages.length,
    };
  });

  return (
    <div className="space-y-5 pb-10">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Chat Sessions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live conversations from the Eddie AI Assistant widget
            {activeFilters && <span className="ml-1.5 text-blue-500 font-medium">· filtered</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            All Leads
          </Link>
        </div>
      </div>

      {/* ── KPI Bar ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Sessions",
            value: totalSessions.toLocaleString(),
            sub: "all time",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            ),
            color: "text-slate-600",
            bg: "bg-slate-100",
          },
          {
            label: "Leads Captured",
            value: leadsCreated.toLocaleString(),
            sub: `${conversionRate}% conversion`,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            ),
            color: "text-emerald-600",
            bg: "bg-emerald-100",
          },
          {
            label: "Avg. Messages",
            value: avgMessages.toString(),
            sub: "per session (shown)",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            ),
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Shown (filtered)",
            value: serialized.length.toLocaleString(),
            sub: activeFilters ? `of ${filteredCount} matched` : "of 200 max",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
              </svg>
            ),
            color: "text-violet-600",
            bg: "bg-violet-100",
          },
        ].map(({ label, value, sub, icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              <p className="text-[10px] text-slate-300">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Client Table ────────────────────────────────────────────────── */}
      <ChatSessionsTable
        sessions={serialized}
        total={totalSessions}
        filteredCount={filteredCount}
        activeFilters={activeFilters}
        filterOptions={{
          landingPages: landingRaw.map((r) => r.landingPage!),
          devices: deviceRaw.map((r) => r.utmMedium!),
          countries: countryRaw.map((r) => r.country!),
          services: SERVICE_KEYWORDS,
        }}
        currentFilters={{
          dateFrom: filterDateFrom,
          dateTo: filterDateTo,
          landing: filterLanding,
          device: filterDevice,
          country: filterCountry,
          service: filterService,
          leadCaptured: filterLead,
        }}
      />
    </div>
  );
}
