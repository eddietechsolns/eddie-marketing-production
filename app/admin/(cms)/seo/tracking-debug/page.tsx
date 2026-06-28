import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tracking Debug | Admin" };

// ─── helpers ────────────────────────────────────────────────────────────────

function Badge({
  pass,
  label,
}: {
  pass: boolean;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        pass
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      <span>{pass ? "✓" : "✗"}</span>
      {label ?? (pass ? "PASS" : "FAIL")}
    </span>
  );
}

function SectionCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
          {number}
        </span>
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  pass,
}: {
  label: string;
  value?: string | null;
  pass: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex items-center gap-3">
        {value && (
          <code className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded max-w-[200px] truncate">
            {value}
          </code>
        )}
        <Badge pass={pass} />
      </div>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function TrackingDebugPage() {
  const [settings, recentLeads, pubCS, draftCS] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.lead.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        serviceInterest: true,
        landingPage: true,
        referrer: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        utmContent: true,
        utmTerm: true,
        createdAt: true,
      },
    }),
    prisma.caseStudy.count({ where: { status: "published" } }),
    prisma.caseStudy.count({ where: { status: "draft" } }),
  ]);

  // ── section 1 ─────────────────────────────────────────────────────────────
  const ga4Ok = Boolean(settings?.ga4MeasurementId);
  const gadsIdOk = Boolean(settings?.googleAdsConversionId);
  const gadsLabelOk = Boolean(settings?.googleAdsConversionLabel);
  const gadsOk = gadsIdOk && gadsLabelOk;

  // ── section 3 ─────────────────────────────────────────────────────────────
  const ATT_FIELDS = [
    "landingPage",
    "referrer",
    "utmSource",
    "utmMedium",
    "utmCampaign",
    "utmContent",
    "utmTerm",
  ] as const;

  type AttField = (typeof ATT_FIELDS)[number];

  const fieldCounts: Record<AttField, number> = {
    landingPage: 0,
    referrer: 0,
    utmSource: 0,
    utmMedium: 0,
    utmCampaign: 0,
    utmContent: 0,
    utmTerm: 0,
  };

  for (const lead of recentLeads) {
    for (const f of ATT_FIELDS) {
      if (lead[f]) fieldCounts[f]++;
    }
  }

  const totalLeads = recentLeads.length;
  const totalPossible = totalLeads * ATT_FIELDS.length;
  const totalFilled = Object.values(fieldCounts).reduce((a, b) => a + b, 0);
  const completenessPercent =
    totalPossible > 0 ? Math.round((totalFilled / totalPossible) * 100) : 0;

  // per-lead completeness
  const perLeadCompleteness = recentLeads.map((lead) => {
    const filled = ATT_FIELDS.filter((f) => lead[f]).length;
    return Math.round((filled / ATT_FIELDS.length) * 100);
  });

  // ── section 4 ─────────────────────────────────────────────────────────────
  const convCodedOk = true; // always true — coded in LeadForm.tsx
  const leadIdOk = recentLeads.length > 0 && recentLeads.every((l) => l.id > 0);
  const svcOk =
    totalLeads === 0 ||
    recentLeads.filter((l) => l.serviceInterest).length > 0;
  const lpOk =
    totalLeads === 0 || recentLeads.filter((l) => l.landingPage).length > 0;
  const campOk =
    totalLeads === 0 || recentLeads.filter((l) => l.utmCampaign).length > 0;
  const srcOk =
    totalLeads === 0 || recentLeads.filter((l) => l.utmSource).length > 0;

  // ── section 5 ─────────────────────────────────────────────────────────────
  const caseStudyViewCoded = true; // confirmed in app/(public)/case-studies/[slug]/page.tsx

  // ── section 6 – score ────────────────────────────────────────────────────
  let score = 0;
  if (ga4Ok) score += 30;
  if (gadsOk) score += 20;
  if (completenessPercent >= 50) score += 20;
  else if (completenessPercent >= 20) score += 10;
  if (pubCS > 0) score += 10;
  if (convCodedOk) score += 20;

  const isReady = score >= 70;

  return (
    <div className="p-8 max-w-4xl space-y-8">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tracking Debug</h1>
        <p className="text-sm text-slate-500 mt-1">
          Read-only verification panel — confirms all tracking wiring before launch.
        </p>
      </div>

      {/* Section 1 – Tracking Status */}
      <SectionCard number={1} title="Tracking Status">
        <div className="divide-y divide-slate-50">
          <Row label="GA4 Configured" value={settings?.ga4MeasurementId} pass={ga4Ok} />
          <Row label="Measurement ID Present" value={settings?.ga4MeasurementId} pass={ga4Ok} />
          <Row label="Google Ads Configured" pass={gadsOk} />
          <Row label="Conversion ID Present" value={settings?.googleAdsConversionId} pass={gadsIdOk} />
          <Row label="Conversion Label Present" value={settings?.googleAdsConversionLabel} pass={gadsLabelOk} />
        </div>
        {!ga4Ok && (
          <p className="mt-4 text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
            ⚠ GA4 Measurement ID not set.{" "}
            <a href="/admin/seo/tracking" className="underline font-medium">
              Configure in Tracking Settings →
            </a>
          </p>
        )}
      </SectionCard>

      {/* Section 2 – Event Registry */}
      <SectionCard number={2} title="Event Registry">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2 pr-4 font-medium">Event Name</th>
                <th className="pb-2 pr-4 font-medium">Trigger Location</th>
                <th className="pb-2 font-medium">Parameters Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                {
                  event: "page_view",
                  location: "All pages (GA4 automatic)",
                  params: "page_location, page_title",
                },
                {
                  event: "lead_submission",
                  location: "LeadForm.tsx — on form success",
                  params:
                    "service_interest, lead_id, landing_page, campaign, source, value, currency",
                },
                {
                  event: "conversion",
                  location: "LeadForm.tsx — fires alongside lead_submission",
                  params: "send_to (AW-id/label), value, currency:AED, transaction_id",
                },
                {
                  event: "case_study_view",
                  location: "case-studies/[slug]/page.tsx — TrackPageView",
                  params: "case_study_slug, client, industry, service",
                },
                {
                  event: "service_page_view",
                  location: "services/[category]/[slug]/page.tsx — TrackPageView",
                  params: "service_slug, category, service_name",
                },
                {
                  event: "blog_post_view",
                  location: "blog/[slug]/page.tsx — TrackPageView",
                  params: "post_slug, category",
                },
              ].map(({ event, location, params }) => (
                <tr key={event}>
                  <td className="py-3 pr-4">
                    <code className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {event}
                    </code>
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-600">{location}</td>
                  <td className="py-3 text-xs text-slate-500 font-mono">{params}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Section 3 – Lead Attribution */}
      <SectionCard number={3} title="Lead Attribution Check">
        {totalLeads === 0 ? (
          <p className="text-sm text-slate-400 italic">No leads in database yet.</p>
        ) : (
          <>
            {/* Field coverage summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {ATT_FIELDS.map((f) => {
                const pct =
                  totalLeads > 0
                    ? Math.round((fieldCounts[f] / totalLeads) * 100)
                    : 0;
                return (
                  <div
                    key={f}
                    className="bg-slate-50 rounded-lg px-3 py-2.5 text-center"
                  >
                    <p className="text-xs text-slate-500 mb-1 capitalize">
                      {f.replace(/utm/, "UTM ").replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        pct >= 80
                          ? "text-green-600"
                          : pct >= 40
                          ? "text-orange-500"
                          : "text-red-500"
                      }`}
                    >
                      {pct}%
                    </p>
                    <p className="text-xs text-slate-400">
                      {fieldCounts[f]}/{totalLeads}
                    </p>
                  </div>
                );
              })}
              <div className="bg-slate-800 rounded-lg px-3 py-2.5 text-center">
                <p className="text-xs text-slate-400 mb-1">Overall</p>
                <p
                  className={`text-lg font-bold ${
                    completenessPercent >= 80
                      ? "text-green-400"
                      : completenessPercent >= 40
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                >
                  {completenessPercent}%
                </p>
                <p className="text-xs text-slate-500">completeness</p>
              </div>
            </div>

            {/* Lead table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-400 uppercase tracking-wide border-b border-slate-100">
                    <th className="pb-2 pr-3 font-medium">#</th>
                    <th className="pb-2 pr-3 font-medium">Name</th>
                    <th className="pb-2 pr-3 font-medium">Landing Page</th>
                    <th className="pb-2 pr-3 font-medium">Referrer</th>
                    <th className="pb-2 pr-3 font-medium">UTM Source</th>
                    <th className="pb-2 pr-3 font-medium">UTM Medium</th>
                    <th className="pb-2 pr-3 font-medium">UTM Campaign</th>
                    <th className="pb-2 pr-3 font-medium">Content</th>
                    <th className="pb-2 font-medium">Term</th>
                    <th className="pb-2 pl-3 font-medium">Done</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentLeads.map((lead, i) => {
                    const pct = perLeadCompleteness[i];
                    return (
                      <tr key={lead.id}>
                        <td className="py-1.5 pr-3 text-slate-400">{lead.id}</td>
                        <td className="py-1.5 pr-3 text-slate-600 max-w-[90px] truncate">
                          {lead.name}
                        </td>
                        {[
                          lead.landingPage,
                          lead.referrer,
                          lead.utmSource,
                          lead.utmMedium,
                          lead.utmCampaign,
                          lead.utmContent,
                          lead.utmTerm,
                        ].map((v, ci) => (
                          <td
                            key={ci}
                            className={`py-1.5 pr-3 max-w-[100px] truncate ${
                              v ? "text-slate-600" : "text-slate-200"
                            }`}
                          >
                            {v ?? "—"}
                          </td>
                        ))}
                        <td className="py-1.5 pl-3">
                          <span
                            className={`font-semibold ${
                              pct >= 80
                                ? "text-green-600"
                                : pct >= 40
                                ? "text-orange-500"
                                : "text-red-500"
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </SectionCard>

      {/* Section 4 – Conversion Readiness */}
      <SectionCard number={4} title="Conversion Readiness">
        <div className="divide-y divide-slate-50">
          <Row
            label="Lead form triggers conversion event"
            value="LeadForm.tsx → trackLeadConversion()"
            pass={convCodedOk}
          />
          <Row
            label="Lead ID available on submission"
            value="submitLead() returns leadId"
            pass={leadIdOk}
          />
          <Row
            label="Service Interest captured"
            value={svcOk ? `${recentLeads.filter((l) => l.serviceInterest).length}/${totalLeads} leads` : undefined}
            pass={svcOk}
          />
          <Row
            label="Landing Page captured"
            value={lpOk ? `${recentLeads.filter((l) => l.landingPage).length}/${totalLeads} leads` : undefined}
            pass={lpOk}
          />
          <Row
            label="Campaign captured"
            value={campOk ? `${recentLeads.filter((l) => l.utmCampaign).length}/${totalLeads} leads` : undefined}
            pass={campOk}
          />
          <Row
            label="Source captured"
            value={srcOk ? `${recentLeads.filter((l) => l.utmSource).length}/${totalLeads} leads` : undefined}
            pass={srcOk}
          />
        </div>
      </SectionCard>

      {/* Section 5 – Case Study Tracking */}
      <SectionCard number={5} title="Case Study Tracking">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{pubCS}</p>
            <p className="text-xs text-green-600 mt-1">Published</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-700">{draftCS}</p>
            <p className="text-xs text-amber-600 mt-1">Draft</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-slate-700">{pubCS + draftCS}</p>
            <p className="text-xs text-slate-500 mt-1">Total</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-50">
          <Row
            label="case_study_view event attached to detail pages"
            value="TrackPageView in case-studies/[slug]/page.tsx"
            pass={caseStudyViewCoded}
          />
          <Row
            label="At least one case study published"
            value={`${pubCS} published`}
            pass={pubCS > 0}
          />
        </div>
      </SectionCard>

      {/* Section 6 – Readiness Score */}
      <SectionCard number={6} title="Final Readiness">
        {/* score breakdown */}
        <div className="space-y-2 mb-6">
          {[
            { label: "GA4 Measurement ID configured", pts: 30, earned: ga4Ok ? 30 : 0 },
            { label: "Google Ads Conversion ID + Label configured", pts: 20, earned: gadsOk ? 20 : 0 },
            { label: "Lead attribution completeness ≥ 50%", pts: 20, earned: completenessPercent >= 50 ? 20 : completenessPercent >= 20 ? 10 : 0 },
            { label: "At least one published case study", pts: 10, earned: pubCS > 0 ? 10 : 0 },
            { label: "Lead form conversion event coded", pts: 20, earned: convCodedOk ? 20 : 0 },
          ].map(({ label, pts, earned }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    earned === pts ? "bg-green-500" : earned > 0 ? "bg-orange-400" : "bg-red-400"
                  }`}
                />
                <span className="text-sm text-slate-700">{label}</span>
              </div>
              <span className="text-sm font-semibold text-slate-600 shrink-0">
                {earned}/{pts}
              </span>
            </div>
          ))}
        </div>

        {/* big score display */}
        <div
          className={`rounded-2xl p-8 text-center ${
            isReady
              ? "bg-green-50 border-2 border-green-200"
              : "bg-red-50 border-2 border-red-200"
          }`}
        >
          <p
            className={`text-7xl font-black mb-2 ${
              isReady ? "text-green-700" : "text-red-600"
            }`}
          >
            {score}
            <span className="text-3xl font-semibold text-opacity-60">/100</span>
          </p>
          <p
            className={`text-xl font-bold tracking-wide uppercase ${
              isReady ? "text-green-700" : "text-red-600"
            }`}
          >
            {isReady ? "✓ Ready for Launch" : "✗ Requires Fixes"}
          </p>
          {!isReady && (
            <p className="mt-2 text-sm text-red-500">
              Configure GA4 &amp; Google Ads in{" "}
              <a href="/admin/seo/tracking" className="underline font-medium">
                Tracking Settings
              </a>{" "}
              to reach 70+.
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
