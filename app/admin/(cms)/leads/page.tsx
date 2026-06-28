import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads | Admin" };

// ─── constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  new:             "bg-blue-100 text-blue-700",
  contacted:       "bg-amber-100 text-amber-700",
  qualified:       "bg-purple-100 text-purple-700",
  "proposal-sent": "bg-orange-100 text-orange-700",
  won:             "bg-green-100 text-green-700",
  lost:            "bg-slate-100 text-slate-500",
};

const STATUS_LABELS: Record<string, string> = {
  new:             "New",
  contacted:       "Contacted",
  qualified:       "Qualified",
  "proposal-sent": "Proposal Sent",
  won:             "Won",
  lost:            "Lost",
};

const PRIORITY_COLORS: Record<string, string> = {
  Low:    "bg-slate-100 text-slate-600",
  Medium: "bg-blue-100 text-blue-700",
  High:   "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
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

function isOverdue(d: Date | null, now: Date) {
  return !!d && d < now;
}

function waLink(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}`;
}

// ─── types ────────────────────────────────────────────────────────────────────

// ─── Recruitment source helpers ───────────────────────────────────────────────

const LEAD_SOURCE_LABELS: Record<string, string> = {
  JOB_APPLICATION:        "Job Application",
  INTERNSHIP_APPLICATION: "Internship Application",
  WEBSITE_FORM:           "Website Form",
};

const LEAD_SOURCE_COLORS: Record<string, string> = {
  JOB_APPLICATION:        "bg-violet-100 text-violet-700",
  INTERNSHIP_APPLICATION: "bg-teal-100 text-teal-700",
  WEBSITE_FORM:           "bg-slate-100 text-slate-600",
};

interface Props {
  searchParams: Promise<{
    status?:     string;
    priority?:   string;
    q?:          string;
    service?:    string;
    source?:     string;
    leadSource?: string;
    view?:       string; // "table" | "pipeline"
    sort?:       string; // "date" | "priority" | "value" | "followup"
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
    // main list
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    // status counts
    prisma.lead.groupBy({ by: ["status"], _count: { id: true } }),
    // priority counts
    prisma.lead.groupBy({ by: ["priority"], _count: { id: true } }),
    // KPIs
    Promise.all([
      prisma.lead.count(),                                                        // total
      prisma.lead.count({ where: { status: "new" } }),                           // new
      prisma.lead.count({                                                         // overdue
        where: { nextFollowUpAt: { lt: now }, status: { notIn: ["won", "lost"] } },
      }),
      prisma.lead.aggregate({                                                     // pipeline value
        _sum: { expectedValue: true },
        where: { status: { notIn: ["won", "lost"] } },
      }),
    ]),
    // needs-attention top 10
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
    // lead source breakdown
    prisma.lead.groupBy({ by: ["leadSource"], _count: { id: true } }),
  ]);

  const [totalAll, totalNew, totalOverdue, pipelineAgg] = kpis;
  const pipelineValue = pipelineAgg._sum.expectedValue ?? 0;

  // ── sort leads in JS (avoids complex Prisma ordering) ─────────────────────
  const sorted = [...leads].sort((a, b) => {
    if (sort === "priority") {
      const pa = PRIORITY_ORDER[a.priority ?? "Medium"] ?? 2;
      const pb = PRIORITY_ORDER[b.priority ?? "Medium"] ?? 2;
      if (pa !== pb) return pa - pb;
    }
    if (sort === "value") {
      return (b.expectedValue ?? 0) - (a.expectedValue ?? 0);
    }
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

  // ── attention reasons ─────────────────────────────────────────────────────
  function reasonsFor(lead: (typeof attentionLeads)[0]): string[] {
    const r: string[] = [];
    if (lead.nextFollowUpAt && lead.nextFollowUpAt < now) r.push("Overdue");
    if (lead.priority === "Urgent") r.push("Urgent Priority");
    else if (lead.priority === "High") r.push("High Priority");
    if (!lead.assignedTo) r.push("Unassigned");
    return r;
  }

  return (
    <div className="p-6 max-w-[1400px] space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
            {total !== sorted.length ? ` of ${total} total` : " total"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeFilters && (
            <Link href="/admin/leads" className="text-xs text-slate-500 hover:text-slate-700">
              Clear filters ×
            </Link>
          )}
          <Link
            href="/admin/leads/dashboard"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Dashboard →
          </Link>
        </div>
      </div>

      {/* ── KPI cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Leads",
            value: totalAll.toString(),
            sub: "all time",
            color: "bg-slate-50 border-slate-200",
            val: "text-slate-900",
          },
          {
            label: "New Leads",
            value: totalNew.toString(),
            sub: "awaiting contact",
            color: "bg-blue-50 border-blue-200",
            val: "text-blue-700",
          },
          {
            label: "Overdue Follow-ups",
            value: totalOverdue.toString(),
            sub: "past due date",
            color: totalOverdue > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200",
            val: totalOverdue > 0 ? "text-red-600" : "text-slate-700",
          },
          {
            label: "Pipeline Value",
            value: pipelineValue > 0 ? fmtAed(pipelineValue)! : "—",
            sub: "active leads",
            color: "bg-green-50 border-green-200",
            val: "text-green-700",
          },
        ].map(({ label, value, sub, color, val }) => (
          <div
            key={label}
            className={`rounded-xl border px-5 py-4 ${color}`}
          >
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold ${val}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Needs Attention ────────────────────────────────────────────── */}
      {attentionLeads.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-amber-200 bg-amber-100/60">
            <span className="text-amber-600 text-sm">⚠</span>
            <h2 className="text-sm font-semibold text-amber-800">
              Needs Attention
              <span className="ml-2 text-amber-600 font-normal">
                ({attentionLeads.length} lead{attentionLeads.length !== 1 ? "s" : ""})
              </span>
            </h2>
          </div>
          <div className="divide-y divide-amber-100">
            {attentionLeads.map((lead) => {
              const reasons = reasonsFor(lead);
              return (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-amber-100/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-800 truncate">
                        {lead.name}
                      </span>
                      {lead.company && (
                        <span className="text-xs text-slate-500 truncate">{lead.company}</span>
                      )}
                      {reasons.map((r) => (
                        <span
                          key={r}
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            r === "Overdue"
                              ? "bg-red-100 text-red-700"
                              : r.includes("Urgent")
                              ? "bg-red-100 text-red-700"
                              : r.includes("High")
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lead.serviceInterest ?? "No service"} ·{" "}
                      {lead.nextFollowUpAt
                        ? `Follow-up: ${fmtShort(lead.nextFollowUpAt)}`
                        : "No follow-up set"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[lead.status] ?? "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {STATUS_LABELS[lead.status] ?? lead.status}
                    </span>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <form method="get" action="/admin/leads">
        {filterStatus   && <input type="hidden" name="status"   value={filterStatus} />}
        {filterPriority && <input type="hidden" name="priority" value={filterPriority} />}
        {filterService  && <input type="hidden" name="service"  value={filterService} />}
        {filterSource   && <input type="hidden" name="source"   value={filterSource} />}
        {view !== "table" && <input type="hidden" name="view" value={view} />}
        {sort !== "date"  && <input type="hidden" name="sort" value={sort} />}
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, company, email, phone, service, assigned…"
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* ── Filter pills ───────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl({ status: undefined }, params)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !filterStatus
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Statuses ({total})
          </Link>
          {ALL_STATUSES.map((s) => (
            <Link
              key={s}
              href={buildUrl({ status: s }, params)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterStatus === s
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {STATUS_LABELS[s]} ({countByStatus[s] ?? 0})
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl({ priority: undefined }, params)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !filterPriority
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Priorities
          </Link>
          {ALL_PRIORITIES.map((p) => (
            <Link
              key={p}
              href={buildUrl({ priority: p }, params)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterPriority === p
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p} ({countByPriority[p] ?? 0})
            </Link>
          ))}
        </div>
        {/* Recruitment source filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 font-medium mr-1">Type:</span>
          <Link
            href={buildUrl({ leadSource: undefined }, params)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !filterLeadSource
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Types ({total})
          </Link>
          <Link
            href={buildUrl({ leadSource: "RECRUITMENT" }, params)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterLeadSource === "RECRUITMENT"
                ? "bg-violet-700 text-white"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            }`}
          >
            All Applications ({recruitmentCount})
          </Link>
          <Link
            href={buildUrl({ leadSource: "JOB_APPLICATION" }, params)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterLeadSource === "JOB_APPLICATION"
                ? "bg-violet-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Job Applications ({countByLeadSource["JOB_APPLICATION"] ?? 0})
          </Link>
          <Link
            href={buildUrl({ leadSource: "INTERNSHIP_APPLICATION" }, params)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterLeadSource === "INTERNSHIP_APPLICATION"
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Internship Applications ({countByLeadSource["INTERNSHIP_APPLICATION"] ?? 0})
          </Link>
        </div>
      </div>

      {/* ── View tabs + sort bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* tabs */}
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
          {(["table", "pipeline"] as const).map((v) => (
            <Link
              key={v}
              href={buildUrl({ view: v === "table" ? undefined : v }, params)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                view === v || (v === "table" && view !== "pipeline")
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {v === "table" ? "Table View" : "Pipeline View"}
            </Link>
          ))}
        </div>

        {/* sort — only shown in table view */}
        {view !== "pipeline" && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Sort:</span>
            {(["date", "priority", "value", "followup"] as const).map((s) => (
              <Link
                key={s}
                href={buildUrl({ sort: s === "date" ? undefined : s }, params)}
                className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                  sort === s || (s === "date" && sort !== "priority" && sort !== "value" && sort !== "followup")
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {s === "followup" ? "Follow-up" : s.charAt(0).toUpperCase() + s.slice(1)}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── No results ─────────────────────────────────────────────────── */}
      {sorted.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-500 text-sm">
            {activeFilters ? "No leads match these filters." : "No leads yet."}
          </p>
          {!activeFilters && (
            <p className="text-slate-400 text-xs mt-1">
              Submit the contact form on any service page to create a test lead.
            </p>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TABLE VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view !== "pipeline" && sorted.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Service</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden xl:table-cell">Source</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden xl:table-cell">Value</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden xl:table-cell">Assigned To</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden 2xl:table-cell">Follow-up</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((lead) => {
                const overdue = isOverdue(lead.nextFollowUpAt, now);
                const wa = waLink(lead.phone);
                return (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <p className="font-medium text-slate-900 leading-none">{lead.name}</p>
                        {lead.leadSource && LEAD_SOURCE_LABELS[lead.leadSource] && (
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${LEAD_SOURCE_COLORS[lead.leadSource] ?? "bg-slate-100 text-slate-500"}`}>
                            {lead.leadSource === "JOB_APPLICATION" ? "Job App" : lead.leadSource === "INTERNSHIP_APPLICATION" ? "Internship" : "Form"}
                          </span>
                        )}
                      </div>
                      {lead.company && (
                        <p className="text-xs text-slate-500">{lead.company}</p>
                      )}
                      {lead.country && (
                        <p className="text-xs text-slate-400">{lead.country}</p>
                      )}
                    </td>
                    {/* Email */}
                    <td className="px-4 py-3 text-slate-700 text-xs hidden lg:table-cell">
                      {lead.email}
                    </td>
                    {/* Service */}
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell text-xs">
                      {lead.serviceInterest ?? "—"}
                    </td>
                    {/* Source */}
                    <td className="px-4 py-3 hidden xl:table-cell text-xs">
                      {lead.utmSource ? (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">
                          {lead.utmSource}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    {/* Priority */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {lead.priority ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            PRIORITY_COLORS[lead.priority] ?? "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {lead.priority}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[lead.status] ?? "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {STATUS_LABELS[lead.status] ?? lead.status}
                      </span>
                    </td>
                    {/* Expected Value */}
                    <td className="px-4 py-3 hidden xl:table-cell text-xs font-medium text-slate-700">
                      {fmtAed(lead.expectedValue) ?? "—"}
                    </td>
                    {/* Assigned To */}
                    <td className="px-4 py-3 hidden xl:table-cell text-xs text-slate-600">
                      {lead.assignedTo ?? (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    {/* Follow-up */}
                    <td className="px-4 py-3 hidden 2xl:table-cell text-xs">
                      {lead.nextFollowUpAt ? (
                        <span
                          className={overdue ? "text-red-600 font-semibold" : "text-slate-600"}
                        >
                          {overdue && "⚠ "}
                          {fmtShort(lead.nextFollowUpAt)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                      {fmtDate(lead.createdAt)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                        >
                          View
                        </Link>
                        <a
                          href={`mailto:${lead.email}`}
                          className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-medium transition-colors"
                          title={`Email ${lead.email}`}
                        >
                          Email
                        </a>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded font-medium transition-colors"
                            title={`Call ${lead.phone}`}
                          >
                            Call
                          </a>
                        )}
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-medium transition-colors"
                            title="WhatsApp"
                          >
                            WhatsApp
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
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PIPELINE VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view === "pipeline" && sorted.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {ALL_STATUSES.map((status) => {
            const group = byStatus[status] ?? [];
            const groupValue = group.reduce((s, l) => s + (l.expectedValue ?? 0), 0);
            return (
              <div key={status} className="flex flex-col gap-2">
                {/* Column header */}
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                    STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="text-xs font-bold">{group.length}</span>
                </div>
                {/* Value sub-header */}
                {groupValue > 0 && (
                  <p className="text-xs text-slate-500 px-1 font-medium">
                    {fmtAed(groupValue)}
                  </p>
                )}
                {/* Cards */}
                {group.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg px-3 py-4 text-center">
                    <p className="text-xs text-slate-400">No leads</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {group.map((lead) => {
                      const overdue = isOverdue(lead.nextFollowUpAt, now);
                      return (
                        <Link
                          key={lead.id}
                          href={`/admin/leads/${lead.id}`}
                          className={`block bg-white border rounded-lg px-3 py-2.5 hover:shadow-sm transition-shadow ${
                            overdue ? "border-red-200" : "border-slate-200"
                          }`}
                        >
                          <p className="text-xs font-semibold text-slate-800 leading-tight truncate">
                            {lead.name}
                          </p>
                          {lead.company && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {lead.company}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {lead.priority && (
                              <span
                                className={`inline-block px-1.5 py-0 rounded text-xs font-medium leading-5 ${
                                  PRIORITY_COLORS[lead.priority] ?? "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {lead.priority}
                              </span>
                            )}
                            {lead.expectedValue && (
                              <span className="text-xs text-green-700 font-semibold">
                                {fmtAed(lead.expectedValue)}
                              </span>
                            )}
                          </div>
                          {lead.nextFollowUpAt && (
                            <p
                              className={`text-xs mt-1 ${
                                overdue ? "text-red-600 font-medium" : "text-slate-400"
                              }`}
                            >
                              {overdue ? "⚠ " : "↻ "}
                              {fmtShort(lead.nextFollowUpAt)}
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
