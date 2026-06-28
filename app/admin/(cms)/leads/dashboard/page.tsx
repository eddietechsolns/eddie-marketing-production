import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lead Dashboard | Admin" };

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  "proposal-sent": "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

const PRIORITY_COLORS: Record<string, string> = {
  Low:    "bg-slate-100 text-slate-600",
  Medium: "bg-blue-100 text-blue-700",
  High:   "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
};

const FUNNEL_ORDER = ["new", "contacted", "qualified", "proposal-sent", "won"];

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className={`text-2xl font-bold ${accent ?? "text-slate-900"}`}>{value}</p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function fmt(n: number | null | undefined, currency = "USD") {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: n >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function LeadDashboardPage() {
  const now = new Date();
  const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    total,
    thisMonth,
    byStatus,
    byService,
    byCountry,
    bySource,
    pipelineValue,
    byPriority,
    byCampaign,
    byLandingPage,
    upcomingFollowUps,
    overdueFollowUps,
    pipelineByService,
    pipelineByCampaign,
    wonByLandingPage,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.lead.groupBy({ by: ["status"],         _count: { id: true } }),
    prisma.lead.groupBy({ by: ["serviceInterest"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.lead.groupBy({
      by: ["country"], _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      having: { id: { _count: { gt: 0 } } },
    }),
    prisma.lead.groupBy({ by: ["utmSource"],   _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.lead.aggregate({
      _sum: { expectedValue: true },
      where: { status: { notIn: ["won", "lost"] } },
    }),
    prisma.lead.groupBy({ by: ["priority"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.lead.groupBy({
      by: ["utmCampaign"], _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.lead.groupBy({
      by: ["landingPage"], _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.lead.findMany({
      where: {
        nextFollowUpAt: { gte: now, lte: sevenDaysAhead },
        status: { notIn: ["won", "lost"] },
      },
      select: { id: true, name: true, company: true, nextFollowUpAt: true, priority: true, status: true },
      orderBy: { nextFollowUpAt: "asc" },
      take: 20,
    }),
    prisma.lead.findMany({
      where: {
        nextFollowUpAt: { lt: now },
        status: { notIn: ["won", "lost"] },
      },
      select: { id: true, name: true, company: true, nextFollowUpAt: true, priority: true, status: true },
      orderBy: { nextFollowUpAt: "asc" },
      take: 20,
    }),
    // Attribution & ROI additions
    prisma.lead.groupBy({
      by: ["serviceInterest"],
      _sum: { expectedValue: true },
      _count: { id: true },
      orderBy: { _sum: { expectedValue: "desc" } },
    }),
    prisma.lead.groupBy({
      by: ["utmCampaign"],
      _sum: { expectedValue: true },
      _count: { id: true },
      orderBy: { _sum: { expectedValue: "desc" } },
      take: 10,
    }),
    prisma.lead.groupBy({
      by: ["landingPage"],
      where: { status: "won" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  const countByStatus = Object.fromEntries(byStatus.map((r) => [r.status, r._count.id]));
  const wonCount   = countByStatus["won"]  ?? 0;
  const lostCount  = countByStatus["lost"] ?? 0;
  const closedCount = wonCount + lostCount;
  const winRate    = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;
  const topFunnel  = countByStatus["new"]  ?? 0;
  const pipeline   = pipelineValue._sum.expectedValue ?? 0;

  // Normalized source grouping
  function normalizeSource(utmSource: string | null): string {
    if (!utmSource) return "Direct";
    const s = utmSource.toLowerCase();
    if (s.includes("google") || s.includes("adword")) return "Google";
    if (s.includes("facebook") || s.includes("instagram") || s.includes("meta") ||
        s.includes("linkedin") || s.includes("twitter") || s.includes("tiktok") ||
        s.includes("social")) return "Social";
    if (s === "organic") return "Organic";
    return "Referral";
  }
  const normalizedSources = bySource.reduce<Record<string, number>>((acc, r) => {
    const key = normalizeSource(r.utmSource ?? null);
    acc[key] = (acc[key] ?? 0) + r._count.id;
    return acc;
  }, {});
  const normalizedSourceRows = Object.entries(normalizedSources)
    .sort((a, b) => b[1] - a[1])
    .map(([a, b]) => ({ a, b }));

  // Conversion rate by landing page
  const wonByPage = Object.fromEntries(wonByLandingPage.map((r) => [r.landingPage ?? "", r._count.id]));
  const convRateRows = byLandingPage
    .filter((r) => r.landingPage)
    .map((r) => {
      const total_ = r._count.id;
      const won_ = wonByPage[r.landingPage ?? ""] ?? 0;
      const rate = total_ > 0 ? Math.round((won_ / total_) * 100) : 0;
      let display = r.landingPage ?? "";
      try { display = new URL(display).pathname; } catch { /* keep */ }
      return { page: display, total: total_, won: won_, rate };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  function MiniTable({ rows, colA }: { rows: { a: string; b: number }[]; colA: string }) {
    if (rows.length === 0) return <p className="px-4 py-6 text-sm text-slate-400 text-center">No data yet</p>;
    return (
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-2.5 text-slate-700 truncate max-w-[180px]" title={row.a}>{row.a || colA}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="p-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Conversion overview</p>
        </div>
        <Link href="/admin/leads" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          ← All Leads
        </Link>
      </div>

      {/* Top stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Leads"      value={total} />
        <StatCard label="This Month"       value={thisMonth} />
        <StatCard label="Won"              value={wonCount}  sub={`${winRate}% win rate`} accent="text-green-600" />
        <StatCard label="New (unactioned)" value={topFunnel} />
        <StatCard label="Pipeline Value"   value={pipeline > 0 ? fmt(pipeline) : "—"} sub="active leads" accent={pipeline > 0 ? "text-teal-700" : undefined} />
        <StatCard label="Overdue Follow-ups" value={overdueFollowUps.length} sub={overdueFollowUps.length > 0 ? "action required" : "all clear"} accent={overdueFollowUps.length > 0 ? "text-red-600" : "text-green-600"} />
      </div>

      {/* Conversion funnel */}
      <section>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Conversion Funnel</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {FUNNEL_ORDER.map((status, i) => {
            const count  = countByStatus[status] ?? 0;
            const pct    = total > 0 ? Math.round((count / total) * 100) : 0;
            const barPct = i === 0 ? 100 : pct;
            return (
              <div key={status} className="px-5 py-4 border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{STATUS_LABELS[status]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{pct}% of total</span>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${barPct}%` }} />
                </div>
              </div>
            );
          })}
          <div className="px-5 py-4 bg-slate-50 grid grid-cols-2 divide-x divide-slate-200">
            <div className="pr-4">
              <p className="text-xs text-slate-500 mb-0.5">Won</p>
              <p className="text-lg font-bold text-green-600">{wonCount}</p>
            </div>
            <div className="pl-4">
              <p className="text-xs text-slate-500 mb-0.5">Lost</p>
              <p className="text-lg font-bold text-slate-500">{lostCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Follow-ups */}
      {(overdueFollowUps.length > 0 || upcomingFollowUps.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overdueFollowUps.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-red-700 mb-3">⚠ Overdue Follow-ups ({overdueFollowUps.length})</h2>
              <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {overdueFollowUps.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <Link href={`/admin/leads/${lead.id}`} className="font-medium text-slate-800 hover:text-orange-600">{lead.name}</Link>
                          {lead.company && <p className="text-xs text-slate-400">{lead.company}</p>}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {lead.priority && (
                            <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[lead.priority] ?? ""}`}>
                              {lead.priority}
                            </span>
                          )}
                          <p className="text-xs text-red-600 font-medium mt-0.5">
                            {lead.nextFollowUpAt?.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {upcomingFollowUps.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-slate-800 mb-3">Upcoming Follow-ups (next 7 days)</h2>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {upcomingFollowUps.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <Link href={`/admin/leads/${lead.id}`} className="font-medium text-slate-800 hover:text-orange-600">{lead.name}</Link>
                          {lead.company && <p className="text-xs text-slate-400">{lead.company}</p>}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {lead.priority && (
                            <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[lead.priority] ?? ""}`}>
                              {lead.priority}
                            </span>
                          )}
                          <p className="text-xs text-amber-600 font-medium mt-0.5">
                            {lead.nextFollowUpAt?.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Grid: service + country + source + priority + campaign + landing page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3">By Service</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <MiniTable
              colA="Not specified"
              rows={byService.map((r) => ({ a: r.serviceInterest ?? "Not specified", b: r._count.id }))}
            />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3">By Priority</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {byPriority.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">No priority data yet</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {byPriority.map((row) => (
                    <tr key={row.priority ?? "none"}>
                      <td className="px-4 py-2.5">
                        {row.priority ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[row.priority] ?? ""}`}>
                            {row.priority}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Unset</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{row._count.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3">By Country</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <MiniTable
              colA="Unknown"
              rows={byCountry.slice(0, 10).map((r) => ({ a: r.country ?? "Unknown", b: r._count.id }))}
            />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3">By UTM Source</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <MiniTable
              colA="Direct / organic"
              rows={bySource.slice(0, 10).map((r) => ({ a: r.utmSource ?? "Direct / organic", b: r._count.id }))}
            />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3">By UTM Campaign</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {byCampaign.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">No campaign data yet</p>
            ) : (
              <MiniTable
                colA="None"
                rows={byCampaign.map((r) => ({ a: r.utmCampaign ?? "None", b: r._count.id }))}
              />
            )}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3">Top Landing Pages</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {byLandingPage.filter((r) => r.landingPage).length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">No landing page data yet</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {byLandingPage
                    .filter((r) => r.landingPage)
                    .map((row) => {
                      let display = row.landingPage ?? "";
                      try { display = new URL(display).pathname; } catch { /* keep raw */ }
                      return (
                        <tr key={row.landingPage}>
                          <td className="px-4 py-2.5 text-slate-700 text-xs truncate max-w-[160px]" title={row.landingPage ?? ""}>{display}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{row._count.id}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* ── Attribution & ROI ────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Attribution &amp; ROI</h2>
        <p className="text-xs text-slate-400 mb-4">Derived from captured UTM data — no external API required.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Leads by Source (normalised) */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Leads by Source</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {normalizedSourceRows.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">No source data yet</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {normalizedSourceRows.map((row) => {
                      const SOURCE_COLORS: Record<string, string> = {
                        Google:  "bg-blue-100 text-blue-700",
                        Organic: "bg-green-100 text-green-700",
                        Social:  "bg-purple-100 text-purple-700",
                        Referral:"bg-amber-100 text-amber-700",
                        Direct:  "bg-slate-100 text-slate-600",
                      };
                      return (
                        <tr key={row.a}>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[row.a] ?? "bg-slate-100 text-slate-600"}`}>
                              {row.a}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{row.b}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Pipeline Value by Service */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Pipeline Value by Service</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {pipelineByService.filter((r) => r._sum.expectedValue).length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">No pipeline data yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Service</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Value</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pipelineByService
                      .filter((r) => r._sum.expectedValue)
                      .map((r) => (
                        <tr key={r.serviceInterest ?? "none"}>
                          <td className="px-4 py-2.5 text-slate-700 text-xs truncate max-w-[120px]">{r.serviceInterest ?? "Unspecified"}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-teal-700 text-xs">{fmt(r._sum.expectedValue)}</td>
                          <td className="px-4 py-2.5 text-right text-slate-500 text-xs">{r._count.id}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Pipeline Value by Campaign */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Pipeline Value by Campaign</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {pipelineByCampaign.filter((r) => r.utmCampaign).length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">No campaign data yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Campaign</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Value</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pipelineByCampaign
                      .filter((r) => r.utmCampaign)
                      .map((r) => (
                        <tr key={r.utmCampaign!}>
                          <td className="px-4 py-2.5 text-slate-700 text-xs truncate max-w-[120px]" title={r.utmCampaign!}>{r.utmCampaign}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-teal-700 text-xs">{fmt(r._sum.expectedValue)}</td>
                          <td className="px-4 py-2.5 text-right text-slate-500 text-xs">{r._count.id}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Conversion Rate by Landing Page */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Conversion Rate by Landing Page</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {convRateRows.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">No landing page data yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Page</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Leads</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Won %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {convRateRows.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 text-slate-700 text-xs truncate max-w-[120px]" title={row.page}>{row.page}</td>
                        <td className="px-4 py-2.5 text-right text-slate-600 text-xs">{row.total}</td>
                        <td className="px-4 py-2.5 text-right text-xs">
                          <span className={`font-semibold ${row.rate > 0 ? "text-green-600" : "text-slate-400"}`}>{row.rate}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* ROI by Campaign */}
          <section className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">ROI by Campaign</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {pipelineByCampaign.filter((r) => r.utmCampaign && r._sum.expectedValue).length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">No campaign attribution data yet. Leads with UTM campaign parameters will appear here.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">Campaign</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500">Leads</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500">Pipeline Value</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500">Avg Lead Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pipelineByCampaign
                      .filter((r) => r.utmCampaign && r._sum.expectedValue)
                      .map((r) => {
                        const avg = r._count.id > 0 && r._sum.expectedValue
                          ? r._sum.expectedValue / r._count.id
                          : null;
                        return (
                          <tr key={r.utmCampaign!} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-medium text-slate-800 text-xs">{r.utmCampaign}</td>
                            <td className="px-4 py-2.5 text-right text-slate-600 text-xs">{r._count.id}</td>
                            <td className="px-4 py-2.5 text-right font-semibold text-teal-700 text-xs">{fmt(r._sum.expectedValue)}</td>
                            <td className="px-4 py-2.5 text-right text-slate-600 text-xs">{fmt(avg)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

        </div>
      </section>
    </div>
  );
}
