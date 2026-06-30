import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLeadStatus } from "@/actions/updateLeadStatus";
import { updateLead } from "@/actions/updateLead";
import { NoteForm } from "@/components/leads/NoteForm";

export const dynamic = "force-dynamic";

// ─── constants ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { pill: string; dot: string; active: string; step: string }> = {
  new:             { pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",     dot: "bg-blue-500",   active: "bg-blue-600 text-white",    step: "border-blue-500 bg-blue-500" },
  contacted:       { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",  dot: "bg-amber-500",  active: "bg-amber-500 text-white",   step: "border-amber-500 bg-amber-500" },
  qualified:       { pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500", active: "bg-violet-600 text-white", step: "border-violet-500 bg-violet-500" },
  "proposal-sent": { pill: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", dot: "bg-indigo-500", active: "bg-indigo-600 text-white", step: "border-indigo-500 bg-indigo-500" },
  won:             { pill: "bg-green-50 text-green-700 ring-1 ring-green-200",   dot: "bg-green-500",  active: "bg-green-600 text-white",   step: "border-green-500 bg-green-500" },
  lost:            { pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",  dot: "bg-slate-400",  active: "bg-slate-600 text-white",   step: "border-slate-400 bg-slate-400" },
};

const STATUS_LABELS: Record<string, string> = {
  new:             "New",
  contacted:       "Contacted",
  qualified:       "Qualified",
  "proposal-sent": "Proposal Sent",
  won:             "Won",
  lost:            "Lost",
};

const PRIORITY_STYLES: Record<string, { badge: string; dot: string }> = {
  Low:    { badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",   dot: "bg-slate-300" },
  Medium: { badge: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",       dot: "bg-blue-400" },
  High:   { badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",    dot: "bg-amber-500" },
  Urgent: { badge: "bg-red-50 text-red-700 ring-1 ring-red-200",          dot: "bg-red-500" },
};

const EVENT_STYLES: Record<string, { dot: string; bg: string; text: string }> = {
  "Lead Created":         { dot: "bg-blue-500",   bg: "bg-blue-50",   text: "text-blue-700" },
  "Application Received": { dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700" },
  "Status Changed":       { dot: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700" },
  "Note Added":           { dot: "bg-slate-400",  bg: "bg-slate-50",  text: "text-slate-600" },
  "Follow-up Scheduled":  { dot: "bg-amber-500",  bg: "bg-amber-50",  text: "text-amber-700" },
  "Lead Assigned":        { dot: "bg-teal-500",   bg: "bg-teal-50",   text: "text-teal-700" },
  "Priority Changed":     { dot: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-700" },
};

const LEAD_SOURCE_STYLES: Record<string, { pill: string; label: string }> = {
  JOB_APPLICATION:        { pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", label: "Job Application" },
  INTERNSHIP_APPLICATION: { pill: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",       label: "Internship Application" },
  WEBSITE_FORM:           { pill: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",   label: "Website Form" },
};

const ALL_STATUSES   = Object.keys(STATUS_LABELS);
const ALL_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const ALL_CURRENCIES = ["USD", "AED", "EUR", "GBP", "SAR", "QAR", "KWD", "BHD", "OMR"];

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, currency = "USD") {
  if (!n) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function fmtFull(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function timeAgo(d: Date): string {
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60)     return "just now";
  if (secs < 3600)   return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400)  return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return fmtShort(d);
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_PALETTE = [
  "bg-blue-500", "bg-violet-500", "bg-teal-500",
  "bg-orange-500", "bg-pink-500", "bg-indigo-500", "bg-emerald-500",
];
function avatarColor(name: string) {
  return AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
}

function waLink(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden ${className}`}>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
        {icon && <span className="text-slate-400">{icon}</span>}
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  href,
  mono = false,
}: {
  label: string;
  value?: string | null;
  href?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-2 border-b border-slate-50 last:border-0">
      <span className="w-36 text-xs text-slate-400 font-medium shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-slate-800 font-medium break-all flex-1 ${mono ? "font-mono text-xs" : ""}`}>
        {href ? (
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
            {value}
          </a>
        ) : value}
      </span>
    </div>
  );
}

interface Props {
  params: Promise<{ id: string }>;
}

// ─── Page ────────────────────────────────────────────────────────────────────

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

  const statusAction = updateLeadStatus.bind(null, lead.id);
  const salesAction  = updateLead.bind(null, lead.id);

  const stStyle  = STATUS_STYLES[lead.status] ?? STATUS_STYLES.new;
  const prStyle  = lead.priority ? (PRIORITY_STYLES[lead.priority] ?? PRIORITY_STYLES.Medium) : null;
  const srcStyle = lead.leadSource ? (LEAD_SOURCE_STYLES[lead.leadSource] ?? null) : null;
  const wa       = waLink(lead.phone);
  const now      = new Date();
  const isOverdue = lead.nextFollowUpAt && lead.nextFollowUpAt < now;

  const currentStatusIdx = ALL_STATUSES.indexOf(lead.status);

  return (
    <div className="space-y-0 pb-10">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Back to Leads
        </Link>
      </div>

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 px-6 py-5 mb-5">
        <div className="flex items-start gap-4 flex-wrap">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-2xl ${avatarColor(lead.name)} flex items-center justify-center text-white text-lg font-bold shrink-0`}>
            {initials(lead.name)}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-slate-900">{lead.name}</h1>
              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stStyle.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stStyle.dot}`} />
                {STATUS_LABELS[lead.status] ?? lead.status}
              </span>
              {/* Priority badge */}
              {prStyle && lead.priority && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${prStyle.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${prStyle.dot}`} />
                  {lead.priority}
                </span>
              )}
              {/* Source badge */}
              {srcStyle && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${srcStyle.pill}`}>
                  {srcStyle.label}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap text-xs text-slate-400">
              <span>Lead #{lead.id}</span>
              {lead.company && <><span>·</span><span className="text-slate-600 font-medium">{lead.company}</span></>}
              {lead.country && <><span>·</span><span>{lead.country}</span></>}
              <span>·</span>
              <span>Added {timeAgo(lead.createdAt)}</span>
            </div>
          </div>

          {/* Quick-action buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              Email
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                Call
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
            )}
            {lead.linkedin && (
              <a
                href={lead.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0077b5]/10 text-[#0077b5] text-xs font-semibold hover:bg-[#0077b5]/20 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            )}
            {lead.portfolio && (
              <a
                href={lead.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Status pipeline stepper */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-0">
            {ALL_STATUSES.map((s, i) => {
              const isPast    = i < currentStatusIdx;
              const isCurrent = i === currentStatusIdx;
              const isWon     = s === "won";
              const isLost    = s === "lost";
              const sStyle    = STATUS_STYLES[s];
              return (
                <div key={s} className="flex items-center flex-1 min-w-0">
                  <form action={statusAction} className="flex-1 min-w-0">
                    <input type="hidden" name="status" value={s} />
                    <button
                      type="submit"
                      disabled={isCurrent}
                      title={isCurrent ? `Current: ${STATUS_LABELS[s]}` : `Move to ${STATUS_LABELS[s]}`}
                      className={`w-full text-center text-[10px] font-bold uppercase tracking-wide py-1.5 px-1 transition-all truncate rounded-none first:rounded-l-lg last:rounded-r-lg
                        ${isCurrent
                          ? `${sStyle.active} cursor-default`
                          : isPast
                          ? "bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer"
                          : isWon
                          ? "bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer"
                          : isLost
                          ? "bg-slate-50 text-slate-400 hover:bg-slate-100 cursor-pointer"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer"
                        }`}
                    >
                      {isCurrent && <span className="mr-1">●</span>}
                      {STATUS_LABELS[s]}
                    </button>
                  </form>
                  {i < ALL_STATUSES.length - 1 && (
                    <div className={`w-px h-6 shrink-0 ${i < currentStatusIdx ? "bg-slate-300" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Two-column grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ══ Left column (2/3) ══ */}
        <div className="lg:col-span-2 space-y-4">

          {/* ── Contact Information ─────────────────────────────────────────── */}
          <SectionCard
            title="Contact Information"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            }
          >
            <div className="divide-y divide-slate-50">
              <InfoRow label="Full Name"    value={lead.name} />
              <InfoRow label="Company"      value={lead.company} />
              <InfoRow label="Email"        value={lead.email}  href={`mailto:${lead.email}`} />
              <InfoRow label="Phone"        value={lead.phone}  href={lead.phone ? `tel:${lead.phone}` : undefined} />
              <InfoRow label="Country"      value={lead.country} />
            </div>
          </SectionCard>

          {/* ── Recruitment Details ─────────────────────────────────────────── */}
          {(lead.leadSource === "JOB_APPLICATION" || lead.leadSource === "INTERNSHIP_APPLICATION") && (
            <SectionCard
              title="Recruitment Details"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" /></svg>
              }
            >
              <div className="divide-y divide-slate-50">
                <InfoRow label="Role Applied For" value={lead.roleApplied} />
                <InfoRow label="Department"        value={lead.department} />
                <InfoRow label="LinkedIn"          value={lead.linkedin}  href={lead.linkedin ?? undefined} />
                <InfoRow label="Portfolio"         value={lead.portfolio} href={lead.portfolio ?? undefined} />
                {lead.leadSource === "INTERNSHIP_APPLICATION" && (
                  <>
                    <InfoRow label="University"      value={lead.university} />
                    <InfoRow label="Course / Degree" value={lead.currentPosition} />
                    <InfoRow label="Graduation Year" value={lead.graduationYear} />
                  </>
                )}
                {lead.leadSource === "JOB_APPLICATION" && (
                  <InfoRow label="Current Role" value={lead.currentPosition} />
                )}
              </div>
            </SectionCard>
          )}

          {/* ── Service Interest ─────────────────────────────────────────────── */}
          {lead.serviceInterest && (
            <SectionCard
              title="Service Interest"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              }
            >
              <p className="text-sm font-semibold text-slate-800">{lead.serviceInterest}</p>
            </SectionCard>
          )}

          {/* ── Lead Message ─────────────────────────────────────────────────── */}
          {lead.message && (
            <SectionCard
              title="Lead Message"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
              }
            >
              <blockquote className="border-l-2 border-blue-200 pl-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed italic">
                {lead.message}
              </blockquote>
            </SectionCard>
          )}

          {/* ── Attribution Data ─────────────────────────────────────────────── */}
          <SectionCard
            title="Attribution & Tracking"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {[
                { label: "Landing Page",  value: lead.landingPage,  href: lead.landingPage ?? undefined },
                { label: "Referrer",      value: lead.referrer },
                { label: "UTM Source",    value: lead.utmSource },
                { label: "UTM Medium",    value: lead.utmMedium },
                { label: "UTM Campaign",  value: lead.utmCampaign },
                { label: "UTM Content",   value: lead.utmContent },
                { label: "UTM Term",      value: lead.utmTerm },
              ].map(({ label, value, href }) => (
                <div key={label} className="flex gap-3 py-1.5 border-b border-slate-50 last:border-0">
                  <span className="w-28 text-[11px] text-slate-400 font-medium shrink-0 pt-0.5">{label}</span>
                  {value ? (
                    href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline break-all flex-1 truncate">
                        {value}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-700 font-mono break-all flex-1">{value}</span>
                    )
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── Internal Notes ──────────────────────────────────────────────── */}
          <SectionCard
            title="Internal Notes"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
            }
          >
            <NoteForm leadId={lead.id} />

            {lead.notes.length > 0 && (
              <div className="mt-5 space-y-3">
                {lead.notes.map((note) => (
                  <div key={note.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold shrink-0 mt-0.5">
                      {(note.createdBy ?? "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl rounded-tl-sm px-4 py-3">
                        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{note.note}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 ml-1">
                        <span className="font-medium text-slate-500">{note.createdBy ?? "Admin"}</span>
                        {" · "}{timeAgo(note.createdAt)}
                        <span className="ml-1 text-slate-300">· {fmtShort(note.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lead.notes.length === 0 && (
              <div className="mt-4 text-center py-6">
                <p className="text-xs text-slate-400">No internal notes yet.</p>
              </div>
            )}
          </SectionCard>

          {/* ── Timeline / Activity Log ──────────────────────────────────────── */}
          <SectionCard
            title="Activity Log"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            }
          >
            {lead.timeline.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <p className="text-xs text-slate-400">No activity recorded yet.</p>
              </div>
            ) : (
              <ol className="space-y-1">
                {lead.timeline.map((event, idx) => {
                  const evStyle = EVENT_STYLES[event.eventType] ?? { dot: "bg-slate-400", bg: "bg-slate-50", text: "text-slate-600" };
                  const isLast = idx === lead.timeline.length - 1;
                  return (
                    <li key={event.id} className="flex gap-3">
                      {/* Dot + line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ring-2 ring-white ${evStyle.dot}`} />
                        {!isLast && <div className="w-px flex-1 bg-slate-100 my-1" />}
                      </div>
                      {/* Content */}
                      <div className="pb-4 flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${evStyle.bg} ${evStyle.text}`}>
                            {event.eventType}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">{timeAgo(event.createdAt)}</span>
                        </div>
                        {event.eventText && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.eventText}</p>
                        )}
                        <p className="text-[10px] text-slate-300 mt-0.5">{fmtShort(event.createdAt)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </SectionCard>
        </div>

        {/* ══ Right column (1/3) ══ */}
        <div className="space-y-4">

          {/* ── Sales & CRM Data ─────────────────────────────────────────────── */}
          <SectionCard
            title="Sales & CRM"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
            }
          >
            {/* Summary pills */}
            {(lead.expectedValue || lead.assignedTo || lead.nextFollowUpAt) && (
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-100">
                {lead.expectedValue && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-xl">
                    <span className="text-[10px] text-emerald-600 font-medium">Pipeline</span>
                    <span className="text-xs font-bold text-emerald-700">{fmt(lead.expectedValue, lead.currency ?? "USD")}</span>
                  </div>
                )}
                {lead.assignedTo && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 rounded-xl">
                    <span className="text-[10px] text-blue-500 font-medium">Assigned</span>
                    <span className="text-xs font-bold text-blue-700">{lead.assignedTo}</span>
                  </div>
                )}
                {lead.nextFollowUpAt && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${isOverdue ? "bg-red-50" : "bg-amber-50"}`}>
                    <span className={`text-[10px] font-medium ${isOverdue ? "text-red-500" : "text-amber-600"}`}>Follow-up</span>
                    <span className={`text-xs font-bold ${isOverdue ? "text-red-700" : "text-amber-700"}`}>
                      {lead.nextFollowUpAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      {isOverdue && " ·  Overdue"}
                    </span>
                  </div>
                )}
              </div>
            )}

            <form action={salesAction} className="space-y-4">
              {/* Priority */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
                <select
                  name="priority"
                  defaultValue={lead.priority ?? "Medium"}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white transition-colors"
                >
                  {ALL_PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Expected Value + Currency */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Expected Value</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="expectedValue"
                    defaultValue={lead.expectedValue?.toString() ?? ""}
                    placeholder="0"
                    min="0"
                    step="100"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                  />
                  <select
                    name="currency"
                    defaultValue={lead.currency ?? "USD"}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white transition-colors"
                  >
                    {ALL_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  defaultValue={lead.assignedTo ?? ""}
                  placeholder="Team member name"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Next Follow-up */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Next Follow-up</label>
                <input
                  type="date"
                  name="nextFollowUpAt"
                  defaultValue={formatDateForInput(lead.nextFollowUpAt)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Save Changes
              </button>
            </form>
          </SectionCard>

          {/* ── Lead Metadata ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lead Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Lead ID</span>
                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">#{lead.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Created</span>
                <span className="text-slate-700 font-medium">{timeAgo(lead.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Created date</span>
                <span className="text-slate-500">{fmtFull(lead.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Notes</span>
                <span className="font-semibold text-slate-700">{lead.notes.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Events</span>
                <span className="font-semibold text-slate-700">{lead.timeline.length}</span>
              </div>
            </div>
          </div>

          {/* ── Quick Actions ─────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">Send Email</p>
                  <p className="text-[10px] text-slate-400 truncate">{lead.email}</p>
                </div>
              </a>

              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-green-50 hover:border-green-200 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-green-700">Call</p>
                    <p className="text-[10px] text-slate-400 truncate">{lead.phone}</p>
                  </div>
                </a>
              )}

              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700">WhatsApp</p>
                    <p className="text-[10px] text-slate-400">Open chat</p>
                  </div>
                </a>
              )}

              {lead.linkedin && (
                <a
                  href={lead.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0077b5]/10 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-[#0077b5]">LinkedIn</p>
                    <p className="text-[10px] text-slate-400">View profile</p>
                  </div>
                </a>
              )}

              {lead.portfolio && (
                <a
                  href={lead.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Portfolio</p>
                    <p className="text-[10px] text-slate-400">View work</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
