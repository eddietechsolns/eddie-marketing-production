import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLeadStatus } from "@/actions/updateLeadStatus";
import { updateLead } from "@/actions/updateLead";
import { NoteForm } from "@/components/leads/NoteForm";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  qualified: "bg-purple-100 text-purple-700 border-purple-200",
  "proposal-sent": "bg-orange-100 text-orange-700 border-orange-200",
  won: "bg-green-100 text-green-700 border-green-200",
  lost: "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  "proposal-sent": "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

const PRIORITY_COLORS: Record<string, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
};

const EVENT_DOT: Record<string, string> = {
  "Lead Created":         "bg-blue-400",
  "Application Received": "bg-violet-400",
  "Status Changed":       "bg-purple-400",
  "Note Added":           "bg-slate-400",
  "Follow-up Scheduled":  "bg-amber-400",
  "Lead Assigned":        "bg-teal-400",
  "Priority Changed":     "bg-orange-400",
};

const LEAD_SOURCE_LABELS: Record<string, string> = {
  JOB_APPLICATION:        "Job Application",
  INTERNSHIP_APPLICATION: "Internship Application",
  WEBSITE_FORM:           "Website Form",
};

const LEAD_SOURCE_COLORS: Record<string, string> = {
  JOB_APPLICATION:        "bg-violet-100 text-violet-700 border-violet-200",
  INTERNSHIP_APPLICATION: "bg-teal-100 text-teal-700 border-teal-200",
  WEBSITE_FORM:           "bg-slate-100 text-slate-600 border-slate-200",
};

const ALL_STATUSES   = Object.keys(STATUS_LABELS);
const ALL_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const ALL_CURRENCIES = ["USD", "AED", "EUR", "GBP", "SAR", "QAR", "KWD", "BHD", "OMR"];

function fmt(n: number | null | undefined, currency = "USD") {
  if (!n) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

interface Props {
  params: Promise<{ id: string }>;
}

function InfoRow({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-36 text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-900 font-medium break-all">
        {href ? <a href={href} className="text-orange-600 hover:underline">{value}</a> : value}
      </span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      notes:    { orderBy: { createdAt: "desc" } },
      timeline: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) notFound();

  const statusAction  = updateLeadStatus.bind(null, lead.id);
  const salesAction   = updateLead.bind(null, lead.id);

  return (
    <div className="p-8 max-w-5xl">
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Link href="/admin/leads" className="text-xs text-slate-500 hover:text-slate-700">
          ← Back to leads
        </Link>
        <div className="flex items-center flex-wrap gap-3 mt-3">
          <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[lead.status] ?? "bg-slate-100 text-slate-500"}`}>
            {STATUS_LABELS[lead.status] ?? lead.status}
          </span>
          {lead.priority && (
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_COLORS[lead.priority] ?? ""}`}>
              {lead.priority}
            </span>
          )}
          {lead.leadSource && LEAD_SOURCE_LABELS[lead.leadSource] && (
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${LEAD_SOURCE_COLORS[lead.leadSource] ?? "bg-slate-100 text-slate-500"}`}>
              {LEAD_SOURCE_LABELS[lead.leadSource]}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Lead #{lead.id} ·{" "}
          {lead.createdAt.toLocaleDateString("en-GB", {
            weekday: "short", day: "numeric", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* 1. Contact Information */}
          <Card title="1 — Contact Information">
            <div className="space-y-3">
              <InfoRow label="Name"    value={lead.name} />
              <InfoRow label="Company" value={lead.company} />
              <InfoRow label="Email"   value={lead.email}   href={`mailto:${lead.email}`} />
              <InfoRow label="Phone"   value={lead.phone}   href={`tel:${lead.phone}`} />
              <InfoRow label="Country" value={lead.country} />
            </div>
          </Card>

          {/* 2. Recruitment Details — shown for job/internship applications */}
          {(lead.leadSource === "JOB_APPLICATION" || lead.leadSource === "INTERNSHIP_APPLICATION") && (
            <Card title="2 — Recruitment Details">
              <div className="space-y-3">
                <InfoRow label="Role Applied For" value={lead.roleApplied} />
                <InfoRow label="Department"       value={lead.department} />
                <InfoRow label="LinkedIn"         value={lead.linkedin}   href={lead.linkedin ?? undefined} />
                <InfoRow label="Portfolio"        value={lead.portfolio}  href={lead.portfolio ?? undefined} />
                {lead.leadSource === "INTERNSHIP_APPLICATION" && (
                  <>
                    <InfoRow label="University"       value={lead.university} />
                    <InfoRow label="Course / Degree"  value={lead.currentPosition} />
                    <InfoRow label="Graduation Year"  value={lead.graduationYear} />
                  </>
                )}
                {lead.leadSource === "JOB_APPLICATION" && (
                  <InfoRow label="Current Role" value={lead.currentPosition} />
                )}
              </div>
            </Card>
          )}

          {/* 3. Service Interest */}
          {lead.serviceInterest && (
            <Card title="3 — Service Interest">
              <p className="text-sm text-slate-800 font-medium">{lead.serviceInterest}</p>
            </Card>
          )}

          {/* 4. Lead Message */}
          {lead.message && (
            <Card title="4 — Lead Message">
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
            </Card>
          )}

          {/* 5. Attribution Data */}
          <Card title="5 — Attribution Data">
            <div className="space-y-2">
              {[
                { label: "Landing Page",  value: lead.landingPage,  href: lead.landingPage ?? undefined },
                { label: "Referrer",      value: lead.referrer },
                { label: "UTM Source",    value: lead.utmSource },
                { label: "UTM Medium",    value: lead.utmMedium },
                { label: "UTM Campaign",  value: lead.utmCampaign },
                { label: "UTM Content",   value: lead.utmContent },
                { label: "UTM Term",      value: lead.utmTerm },
              ].map(({ label, value, href }) => (
                <div key={label} className="flex gap-3 text-xs">
                  <span className="w-28 text-slate-400 shrink-0">{label}</span>
                  {value ? (
                    href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline break-all">{value}</a>
                    ) : (
                      <span className="text-slate-700 break-all">{value}</span>
                    )
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 8. Notes */}
          <Card title="8 — Internal Notes">
            <NoteForm leadId={lead.id} />
            {lead.notes.length > 0 && (
              <div className="mt-5 space-y-3">
                {lead.notes.map((note) => (
                  <div key={note.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{note.note}</p>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {note.createdBy ?? "Admin"} ·{" "}
                      {note.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 7. Timeline */}
          <Card title="7 — Timeline">
            {lead.timeline.length === 0 ? (
              <p className="text-sm text-slate-400">No events yet.</p>
            ) : (
              <ol className="relative border-l border-slate-200 ml-2 space-y-4">
                {lead.timeline.map((event) => (
                  <li key={event.id} className="ml-4">
                    <span className={`absolute -left-1.5 mt-1 w-3 h-3 rounded-full border-2 border-white ${EVENT_DOT[event.eventType] ?? "bg-slate-300"}`} />
                    <p className="text-xs font-semibold text-slate-700">{event.eventType}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{event.eventText}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {event.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Status update */}
          <Card title="Update Status">
            <div className="space-y-1.5">
              {ALL_STATUSES.map((s) => (
                <form key={s} action={statusAction}>
                  <input type="hidden" name="status" value={s} />
                  <button
                    type="submit"
                    disabled={lead.status === s}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                      lead.status === s
                        ? `${STATUS_COLORS[s]} font-semibold cursor-default`
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {lead.status === s && "● "}{STATUS_LABELS[s]}
                  </button>
                </form>
              ))}
            </div>
          </Card>

          {/* 6. Sales Data */}
          <Card title="6 — Sales Data">
            <form action={salesAction} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Priority</label>
                <select
                  name="priority"
                  defaultValue={lead.priority ?? "Medium"}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  {ALL_PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Expected Value</label>
                  <input
                    type="number"
                    name="expectedValue"
                    defaultValue={lead.expectedValue?.toString() ?? ""}
                    placeholder="0"
                    min="0"
                    step="100"
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Currency</label>
                  <select
                    name="currency"
                    defaultValue={lead.currency ?? "USD"}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    {ALL_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  defaultValue={lead.assignedTo ?? ""}
                  placeholder="Team member name"
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Next Follow-up</label>
                <input
                  type="date"
                  name="nextFollowUpAt"
                  defaultValue={formatDateForInput(lead.nextFollowUpAt)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Save Sales Data
              </button>
            </form>

            {/* Current values summary */}
            {(lead.expectedValue || lead.assignedTo || lead.nextFollowUpAt) && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                {lead.expectedValue && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pipeline value</span>
                    <span className="font-semibold text-slate-800">{fmt(lead.expectedValue, lead.currency ?? "USD")}</span>
                  </div>
                )}
                {lead.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned to</span>
                    <span className="text-slate-700">{lead.assignedTo}</span>
                  </div>
                )}
                {lead.nextFollowUpAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Follow-up</span>
                    <span className={lead.nextFollowUpAt < new Date() ? "text-red-600 font-medium" : "text-slate-700"}>
                      {lead.nextFollowUpAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {lead.nextFollowUpAt < new Date() ? " (overdue)" : ""}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
