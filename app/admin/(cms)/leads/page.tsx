import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads | Admin" };

// ─── constants ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { pill: string; dot: string; filter: string; filterActive: string }> = {
  new:             { pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",     dot: "bg-blue-500",   filter: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100",   filterActive: "bg-blue-600 text-white ring-1 ring-blue-700" },
  contacted:       { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",  dot: "bg-amber-500",  filter: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100", filterActive: "bg-amber-500 text-white ring-1 ring-amber-600" },
  qualified:       { pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500", filter: "bg-violet-50 text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100", filterActive: "bg-violet-600 text-white ring-1 ring-violet-700" },
  "proposal-sent": { pill: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", dot: "bg-indigo-500", filter: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100", filterActive: "bg-indigo-600 text-white ring-1 ring-indigo-700" },
  won:             { pill: "bg-green-50 text-green-700 ring-1 ring-green-200",   dot: "bg-green-500",  filter: "bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100",  filterActive: "bg-green-600 text-white ring-1 ring-green-700" },
  lost:            { pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",  dot: "bg-slate-400",  filter: "bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200",  filterActive: "bg-slate-600 text-white ring-1 ring-slate-700" },
};

const STATUS_LABELS: Record<string, string> = {
  new:             "New",
  contacted:       "Contacted",
  qualified:       "Qualified",
  "proposal-sent": "Proposal Sent",
  won:             "Won",
  lost:            "Lost",
};

const PRIORITY_STYLES: Record<string, { badge: string; dot: string; row: string }> = {
  Low:    { badge: "text-slate-500",                              dot: "bg-slate-300", row: "" },
  Medium: { badge: "text-blue-600",                              dot: "bg-blue-400",  row: "" },
  High:   { badge: "text-amber-600 font-semibold",               dot: "bg-amber-500", row: "" },
  Urgent: { badge: "text-red-600 font-semibold",                 dot: "bg-red-500",   row: "bg-red-50/30" },
};

const PRIORITY_ORDER: Record<string, number> = {
  Urgent: 0, High: 1, Medium: 2, Low: 3,
};

const ALL_STATUSES  = Object.keys(STATUS_LABELS);
const ALL_PRIORITIES = ["Low", "Medium", "High", "Urgent"];

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildUrl(
  overrides: Record<string, string | undefined>,
  current: Record<string, string | undefined>
) {
  const merged = { ...current, ...overrides };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) p.set(k, v);
  }
  const qs = p.toString();
  return qs ? `/admin/leads?${qs}` : "/admin/leads";
}

function fmtAed(n: number | null | undefined) {
  if (!n) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "AED", maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function fmtShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function timeAgo(d: Date): string {
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return fmtDate(d);
}

function isOverdue(d: Date | null, now: Date) {
  return !!d && d < now;
}

function waLink(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}`;
}

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_PALETTE = [
  "bg-blue-500", "bg-violet-500", "bg-teal-500",
  "bg-orange-500", "bg-pink-500", "bg-indigo-500", "bg-emerald-500",
];
function avatarColor(name: string): string {
  return AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
}

// ─── Recruitment source helpers ───────────────────────────────────────────────

const LEAD_SOURCE_LABELS: Record<string, string> = {
  JOB_APPLICATION:        "Job App",
  INTERNSHIP_APPLICATION: "Internship",
  WEBSITE_FORM:           "Form",
};

const LEAD_SOURCE_PILL: Record<string, string> = {
  JOB_APPLICATION:        "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  INTERNSHIP_APPLICATION: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  WEBSITE_FORM:           "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

interface Props {
  searchParams: Promise<{
    status?:     string;
    priority?:   string;
    q?:          string;
    service?:    string;
    source?:     string;
    leadSource?: string;
    view?:       string;
    sort?:       string;
  }>;
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function LeadsPage({ searchParams }: Props) {
  const params  = await searchParams;
  const {
    status:     filterStatus,
    priority:   filterPriority,
    q,
    service:    filterService,
    source:     filterSource,
    leadSource: filterLeadSource,
    view     = "table",
    sort     = "date",
  } = params;

  const now = new Date();

  // ── filters ──────────────────────────────────────────────────────────────
  const where: Prisma.LeadWhereInput = {};
  if (filterStatus)     where.status          = filterStatus;
  if (filterPriority)   where.priority        = filterPriority;
  if (filterService)    where.serviceInterest = filterService;
  if (filterSource)     where.utmSource       = filterSource;
  if (filterLeadSource === "RECRUITMENT") {
    where.leadSource = { in: ["JOB_APPLICATION", "INTERNSHIP_APPLICATION"] };
  } else if (filterLeadSource) {
    where.leadSource = filterLeadSource;
  }
  if (q) {
    where.OR = [
      { name:            { contains: q, mode: "insensitive" } },
      { company:         { contains: q, mode: "insensitive" } },
      { email:           { contains: q, mode: "insensitive" } },
      { phone:           { contains: q } },
      { serviceInterest: { contains: q, mode: "insensitive" } },
      { assignedTo:      { contains: q, mode: "insensitive" } },
      { roleApplied:     { contains: q, mode: "insensitive" } },
    ];
  }

  const activeFilters = !!(filterStatus || filterPriority || q || filterService || filterSource || filterLeadSource);

  // ── parallel queries ──────────────────────────────────────────────────────
  const [
    leads,
    counts,
    priorityCounts,
    kpis,
    attentionLeads,
    leadSourceCounts,
  ] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.lead.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.lead.groupBy({ by: ["priority"], _count: { id: true } }),
    Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "new" } }),
      prisma.lead.count({ where: { nextFollowUpAt: { lt: now }, status: { notIn: ["won", "lost"] } } }),
      prisma.lead.aggregate({ _sum: { expectedValue: true }, where: { status: { notIn: ["won", "lost"] } } }),
    ]),
    prisma.lead.findMany({
      where: {
        status: { notIn: ["won", "lost"] },
        OR: [
          { nextFollowUpAt: { lt: now } },
          { priority: { in: ["High", "Urgent"] } },
          { assignedTo: null },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.lead.groupBy({ by: ["leadSource"], _count: { id: true } }),
  ]);

  const [totalAll, totalNew, totalOverdue, pipelineAgg] = kpis;
  const pipelineValue = pipelineAgg._sum.expectedValue ?? 0;

  // ── sort ─────────────────────────────────────────────────────────────────
  const sorted = [...leads].sort((a, b) => {
    if (sort === "priority") {
      const pa = PRIORITY_ORDER[a.priority ?? "Medium"] ?? 2;
      const pb = PRIORITY_ORDER[b.priority ?? "Medium"] ?? 2;
      if (pa !== pb) return pa - pb;
    }
    if (sort === "value") return (b.expectedValue ?? 0) - (a.expectedValue ?? 0);
    if (sort === "followup") {
      const fa = a.nextFollowUpAt?.getTime() ?? Infinity;
      const fb = b.nextFollowUpAt?.getTime() ?? Infinity;
      if (fa !== fb) return fa - fb;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const total           = counts.reduce((s, c) => s + c._count.id, 0);
  const countByStatus   = Object.fromEntries(counts.map((c) => [c.status, c._count.id]));
  const countByPriority = Object.fromEntries(
    priorityCounts.map((c) => [c.priority ?? "Medium", c._count.id])
  );
  const countByLeadSource = Object.fromEntries(
    leadSourceCounts.map((c) => [c.leadSource ?? "null", c._count.id])
  );
  const recruitmentCount =
    (countByLeadSource["JOB_APPLICATION"] ?? 0) +
    (countByLeadSource["INTERNSHIP_APPLICATION"] ?? 0);

  // ── pipeline grouping ─────────────────────────────────────────────────────
  const byStatus: Record<string, typeof sorted> = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, []])
  );
  for (const l of sorted) {
    const key = l.status in byStatus ? l.status : "new";
    byStatus[key].push(l);
  }

  function reasonsFor(lead: (typeof attentionLeads)[0]): string[] {
    const r: string[] = [];
    if (lead.nextFollowUpAt && lead.nextFollowUpAt < now) r.push("Overdue");
    if (lead.priority === "Urgent") r.push("Urgent");
    else if (lead.priority === "High") r.push("High Priority");
    if (!lead.assignedTo) r.push("Unassigned");
    return r;
  }

  // ─── render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Leads</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {sorted.length === total
                ? `${total} lead${total !== 1 ? "s" : ""} total`
                : `${sorted.length} of ${total} leads`}
            </p>
          </div>
          {activeFilters && (
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Clear filters
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            Dashboard
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Leads",
            value: totalAll,
            sub: "all time",
            accent: "bg-slate-600",
            text: "text-slate-900",
            icon: (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
            ),
          },
          {
            label: "New Leads",
            value: totalNew,
            sub: "awaiting contact",
            accent: "bg-blue-600",
            text: "text-blue-700",
            icon: (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            ),
          },
          {
            label: "Overdue Follow-ups",
            value: totalOverdue,
            sub: "past due date",
            accent: totalOverdue > 0 ? "bg-red-500" : "bg-slate-400",
            text: totalOverdue > 0 ? "text-red-600" : "text-slate-600",
            icon: (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            ),
          },
          {
            label: "Pipeline Value",
            value: pipelineValue > 0 ? fmtAed(pipelineValue)! : "—",
            sub: "active leads",
            accent: "bg-emerald-600",
            text: "text-emerald-700",
            icon: (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
            ),
          },
        ].map(({ label, value, sub, accent, text, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-xl ${accent} flex items-center justify-center shrink-0`}>
              {icon}
            </div>
            <div className="min-w-0">
              <p className={`text-xl font-bold leading-none ${text}`}>{value}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{label}</p>
              <p className="text-[10px] text-slate-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Needs Attention ────────────────────────────────────────────────── */}
      {attentionLeads.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3 bg-amber-50 border-b border-amber-100">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            </div>
            <h2 className="text-sm font-semibold text-amber-900">
              Needs Attention
              <span className="ml-1.5 text-xs font-normal text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                {attentionLeads.length}
              </span>
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {attentionLeads.map((lead) => {
              const reasons = reasonsFor(lead);
              return (
                <div key={lead.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-full ${avatarColor(lead.name)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                    {initials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 truncate">{lead.name}</span>
                      {lead.company && <span className="text-xs text-slate-400 truncate">{lead.company}</span>}
                      {reasons.map((r) => (
                        <span key={r} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          r === "Overdue" || r === "Urgent"
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : r === "High Priority"
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                        }`}>
                          {r}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {lead.serviceInterest ?? "No service"}{lead.nextFollowUpAt ? ` · Follow-up: ${fmtShort(lead.nextFollowUpAt)}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[lead.status]?.pill ?? "bg-slate-100 text-slate-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[lead.status]?.dot ?? "bg-slate-400"}`} />
                      {STATUS_LABELS[lead.status] ?? lead.status}
                    </span>
                    <Link href={`/admin/leads/${lead.id}`} className="px-2.5 py-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium transition-colors whitespace-nowrap">
                      View →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search Bar ─────────────────────────────────────────────────────── */}
      <form method="get" action="/admin/leads">
        {filterStatus   && <input type="hidden" name="status"   value={filterStatus} />}
        {filterPriority && <input type="hidden" name="priority" value={filterPriority} />}
        {filterService  && <input type="hidden" name="service"  value={filterService} />}
        {filterSource   && <input type="hidden" name="source"   value={filterSource} />}
        {filterLeadSource && <input type="hidden" name="leadSource" value={filterLeadSource} />}
        {view !== "table" && <input type="hidden" name="view" value={view} />}
        {sort !== "date"  && <input type="hidden" name="sort" value={sort} />}
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, company, email, phone, service, role…"
              className="w-full border border-slate-200 bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">

        {/* Status filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-14 shrink-0">Status</span>
          <Link
            href={buildUrl({ status: undefined }, params)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !filterStatus
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All <span className="ml-1 opacity-70">({total})</span>
          </Link>
          {ALL_STATUSES.map((s) => {
            const style = STATUS_STYLES[s];
            const active = filterStatus === s;
            return (
              <Link
                key={s}
                href={buildUrl({ status: s }, params)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  active ? style.filterActive : style.filter
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white/70" : style.dot}`} />
                {STATUS_LABELS[s]}
                <span className="opacity-70">({countByStatus[s] ?? 0})</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Priority + Type filters in one row */}
        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-14 shrink-0">Priority</span>
            <Link
              href={buildUrl({ priority: undefined }, params)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !filterPriority ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </Link>
            {ALL_PRIORITIES.map((p) => {
              const style = PRIORITY_STYLES[p];
              const active = filterPriority === p;
              return (
                <Link
                  key={p}
                  href={buildUrl({ priority: p }, params)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? "bg-slate-900 text-white"
                      : `bg-slate-50 ${style.badge} ring-1 ring-slate-200 hover:bg-slate-100`
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white/70" : style.dot}`} />
                  {p}
                  <span className="opacity-60">({countByPriority[p] ?? 0})</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-14 shrink-0">Type</span>
            <Link
              href={buildUrl({ leadSource: undefined }, params)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !filterLeadSource ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All <span className="ml-1 opacity-70">({total})</span>
            </Link>
            <Link
              href={buildUrl({ leadSource: "RECRUITMENT" }, params)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterLeadSource === "RECRUITMENT"
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100"
              }`}
            >
              Applications <span className="ml-1 opacity-70">({recruitmentCount})</span>
            </Link>
            <Link
              href={buildUrl({ leadSource: "JOB_APPLICATION" }, params)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterLeadSource === "JOB_APPLICATION"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Jobs <span className="ml-1 opacity-70">({countByLeadSource["JOB_APPLICATION"] ?? 0})</span>
            </Link>
            <Link
              href={buildUrl({ leadSource: "INTERNSHIP_APPLICATION" }, params)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterLeadSource === "INTERNSHIP_APPLICATION"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Internships <span className="ml-1 opacity-70">({countByLeadSource["INTERNSHIP_APPLICATION"] ?? 0})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── View + Sort bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(["table", "pipeline"] as const).map((v) => (
            <Link
              key={v}
              href={buildUrl({ view: v === "table" ? undefined : v }, params)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === v || (v === "table" && view !== "pipeline")
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {v === "table" ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>
                  List
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" /></svg>
                  Pipeline
                </>
              )}
            </Link>
          ))}
        </div>

        {view !== "pipeline" && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">Sort by</span>
            {(["date", "priority", "value", "followup"] as const).map((s) => {
              const isActive = sort === s || (s === "date" && !["priority","value","followup"].includes(sort));
              return (
                <Link
                  key={s}
                  href={buildUrl({ sort: s === "date" ? undefined : s }, params)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {s === "followup" ? "Follow-up" : s.charAt(0).toUpperCase() + s.slice(1)}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Empty State ─────────────────────────────────────────────────────── */}
      {sorted.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl py-16 px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">
            {activeFilters ? "No leads match these filters" : "No leads yet"}
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {activeFilters
              ? "Try adjusting or clearing your filters to see more results."
              : "Leads will appear here once visitors submit your contact form or apply for a job."}
          </p>
          {activeFilters && (
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Clear all filters
            </Link>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TABLE / LIST VIEW
      ════════════════════════════════════════════════════════════════════ */}
      {view !== "pipeline" && sorted.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Service / Role</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Priority</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xl:table-cell">Value</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xl:table-cell">Assigned</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden 2xl:table-cell">Follow-up</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Added</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sorted.map((lead) => {
                  const overdue = isOverdue(lead.nextFollowUpAt, now);
                  const wa = waLink(lead.phone);
                  const priority = lead.priority ?? "Medium";
                  const prStyle = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Medium;
                  const stStyle = STATUS_STYLES[lead.status] ?? STATUS_STYLES.new;
                  return (
                    <tr
                      key={lead.id}
                      className={`group hover:bg-blue-50/30 transition-colors ${prStyle.row}`}
                    >
                      {/* Contact */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${avatarColor(lead.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {initials(lead.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-semibold text-slate-900 text-sm leading-none">{lead.name}</p>
                              {lead.leadSource && LEAD_SOURCE_LABELS[lead.leadSource] && (
                                <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${LEAD_SOURCE_PILL[lead.leadSource] ?? "bg-slate-100 text-slate-500"}`}>
                                  {LEAD_SOURCE_LABELS[lead.leadSource]}
                                </span>
                              )}
                            </div>
                            {lead.company && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[140px]">{lead.company}</p>}
                            {!lead.company && lead.country && <p className="text-xs text-slate-400 mt-0.5">{lead.country}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-slate-500 font-mono">{lead.email}</span>
                      </td>

                      {/* Service / Role */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-600 max-w-[160px] block truncate">
                          {lead.roleApplied ?? lead.serviceInterest ?? <span className="text-slate-300">—</span>}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-xs ${prStyle.badge}`}>
                          <span className={`w-2 h-2 rounded-full ${prStyle.dot} shrink-0`} />
                          {priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${stStyle.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stStyle.dot}`} />
                          {STATUS_LABELS[lead.status] ?? lead.status}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        <span className="text-xs font-semibold text-emerald-700">
                          {fmtAed(lead.expectedValue) ?? <span className="text-slate-300 font-normal">—</span>}
                        </span>
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        {lead.assignedTo ? (
                          <span className="text-xs text-slate-600">{lead.assignedTo}</span>
                        ) : (
                          <span className="text-xs text-slate-300 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Follow-up */}
                      <td className="px-4 py-3.5 hidden 2xl:table-cell">
                        {lead.nextFollowUpAt ? (
                          <span className={`text-xs font-medium ${overdue ? "text-red-600" : "text-slate-500"}`}>
                            {overdue && (
                              <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500 align-middle" />
                            )}
                            {fmtShort(lead.nextFollowUpAt)}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-400">{timeAgo(lead.createdAt)}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors whitespace-nowrap"
                            title="View lead"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            View
                          </Link>
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title={`Email ${lead.email}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                          </a>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                              title={`Call ${lead.phone}`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                            </a>
                          )}
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Showing {sorted.length} lead{sorted.length !== 1 ? "s" : ""}
              {sorted.length < totalAll && ` · ${totalAll - sorted.length} more not shown (apply filters to narrow results)`}
            </p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          PIPELINE VIEW
      ════════════════════════════════════════════════════════════════════ */}
      {view === "pipeline" && sorted.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {ALL_STATUSES.map((status) => {
            const group = byStatus[status] ?? [];
            const groupValue = group.reduce((s, l) => s + (l.expectedValue ?? 0), 0);
            const stStyle = STATUS_STYLES[status];
            return (
              <div key={status} className="flex flex-col gap-2">
                {/* Column header */}
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${stStyle.pill}`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${stStyle.dot}`} />
                    <span className="text-[11px] font-bold uppercase tracking-wide">{STATUS_LABELS[status]}</span>
                  </div>
                  <span className="text-xs font-bold">{group.length}</span>
                </div>
                {groupValue > 0 && (
                  <p className="text-xs text-emerald-700 font-semibold px-1">{fmtAed(groupValue)}</p>
                )}
                {/* Cards */}
                {group.length === 0 ? (
                  <div className="flex-1 border border-dashed border-slate-200 rounded-xl px-3 py-6 text-center bg-slate-50/50">
                    <p className="text-xs text-slate-300 font-medium">Empty</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {group.map((lead) => {
                      const overdue = isOverdue(lead.nextFollowUpAt, now);
                      const pr = lead.priority ?? "Medium";
                      const prStyle = PRIORITY_STYLES[pr];
                      return (
                        <Link
                          key={lead.id}
                          href={`/admin/leads/${lead.id}`}
                          className={`block bg-white border rounded-xl px-3 py-3 hover:shadow-md hover:border-slate-300 transition-all group ${
                            overdue ? "border-red-200" : "border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-6 h-6 rounded-full ${avatarColor(lead.name)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                              {initials(lead.name)}
                            </div>
                            <p className="text-xs font-semibold text-slate-800 leading-tight truncate group-hover:text-blue-700 transition-colors">
                              {lead.name}
                            </p>
                          </div>
                          {lead.company && (
                            <p className="text-[10px] text-slate-500 truncate mb-1.5">{lead.company}</p>
                          )}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${prStyle.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${prStyle.dot}`} />
                              {pr}
                            </span>
                            {lead.expectedValue && (
                              <span className="text-[10px] text-emerald-700 font-bold">
                                {fmtAed(lead.expectedValue)}
                              </span>
                            )}
                          </div>
                          {lead.nextFollowUpAt && (
                            <p className={`text-[10px] mt-1.5 font-medium flex items-center gap-1 ${overdue ? "text-red-600" : "text-slate-400"}`}>
                              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                              {fmtShort(lead.nextFollowUpAt)}
                              {overdue && " · Overdue"}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
