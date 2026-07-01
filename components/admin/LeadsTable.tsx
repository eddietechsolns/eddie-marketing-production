"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  new:             { pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",       dot: "bg-blue-500"   },
  contacted:       { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",    dot: "bg-amber-500"  },
  qualified:       { pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500" },
  "proposal-sent": { pill: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", dot: "bg-indigo-500" },
  won:             { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  lost:            { pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",   dot: "bg-slate-400"  },
};

const STATUS_LABELS: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  "proposal-sent": "Proposal Sent", won: "Won", lost: "Lost",
};

const PRIORITY_STYLES: Record<string, { pill: string; dot: string; row: string }> = {
  Low:    { pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",    dot: "bg-slate-300",  row: ""              },
  Medium: { pill: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",          dot: "bg-sky-400",    row: ""              },
  High:   { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",    dot: "bg-amber-500",  row: ""              },
  Urgent: { pill: "bg-red-50 text-red-700 ring-1 ring-red-200",          dot: "bg-red-500",    row: "bg-red-50/25"  },
};

const LEAD_SOURCE_LABELS: Record<string, string> = {
  JOB_APPLICATION: "Job App", INTERNSHIP_APPLICATION: "Internship", WEBSITE_FORM: "Form",
};

const LEAD_SOURCE_PILL: Record<string, string> = {
  JOB_APPLICATION:        "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  INTERNSHIP_APPLICATION: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  WEBSITE_FORM:           "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(d: Date): string {
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function fmtAed(n: number | null | undefined): string | null {
  if (!n) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "AED", maximumFractionDigits: 0,
  }).format(n);
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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

function waLink(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SerializedLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  serviceInterest: string | null;
  roleApplied: string | null;
  status: string;
  priority: string | null;
  expectedValue: number | null;
  assignedTo: string | null;
  nextFollowUpAt: string | null;
  createdAt: string;
  leadSource: string | null;
}

interface Props {
  leads: SerializedLead[];
  totalAll: number;
  sortedCount: number;
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconEye() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
    </svg>
  );
}

function IconArchive() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LeadsTable({ leads, totalAll, sortedCount }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const now = new Date();
  const allSelected = leads.length > 0 && leads.every((l) => selected.has(l.id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(leads.map((l) => l.id)));
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function deleteLead(id: number) {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setOpenDropdown(null);
    setBusy(true);
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  async function archiveLead(id: number) {
    setOpenDropdown(null);
    setBusy(true);
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "lost" }),
    });
    setBusy(false);
    router.refresh();
  }

  async function bulkDelete() {
    if (!confirm(`Permanently delete ${selected.size} lead${selected.size !== 1 ? "s" : ""}? This cannot be undone.`)) return;
    setBusy(true);
    await Promise.all([...selected].map((id) => fetch(`/api/admin/leads/${id}`, { method: "DELETE" })));
    setSelected(new Set());
    setBusy(false);
    router.refresh();
  }

  async function bulkArchive() {
    if (!confirm(`Archive ${selected.size} lead${selected.size !== 1 ? "s" : ""} (mark as Lost)?`)) return;
    setBusy(true);
    await Promise.all(
      [...selected].map((id) =>
        fetch(`/api/admin/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "lost" }),
        })
      )
    );
    setSelected(new Set());
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-2">

      {/* ── Bulk Actions Bar ─────────────────────────────────────────────────── */}
      {someSelected && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold">{selected.size}</span>
            <span className="text-sm text-blue-200">lead{selected.size !== 1 ? "s" : ""} selected</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={bulkArchive}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 disabled:opacity-50 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <IconArchive />
              Archive selected
            </button>
            <button
              onClick={bulkDelete}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-400 disabled:opacity-50 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <IconTrash />
              Delete selected
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="ml-1 p-1.5 hover:bg-white/15 rounded-lg transition-colors"
              title="Clear selection"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">

        {/* Click-away overlay for open dropdowns */}
        {openDropdown !== null && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenDropdown(null)}
          />
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[920px]">

            {/* ── Sticky header ──────────────────────────────────────────────── */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    title={allSelected ? "Deselect all" : "Select all"}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden lg:table-cell whitespace-nowrap">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell whitespace-nowrap">
                  Service / Role
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden lg:table-cell whitespace-nowrap">
                  Priority
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden xl:table-cell whitespace-nowrap">
                  Value
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden xl:table-cell whitespace-nowrap">
                  Assigned
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden 2xl:table-cell whitespace-nowrap">
                  Follow-up
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell whitespace-nowrap">
                  Added
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            {/* ── Body ───────────────────────────────────────────────────────── */}
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => {
                const createdAt       = new Date(lead.createdAt);
                const nextFollowUpAt  = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : null;
                const overdue         = !!nextFollowUpAt && nextFollowUpAt < now;
                const wa              = waLink(lead.phone);
                const priority        = lead.priority ?? "Medium";
                const prStyle         = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Medium;
                const stStyle         = STATUS_STYLES[lead.status] ?? STATUS_STYLES.new;
                const isSelected      = selected.has(lead.id);
                const isDropOpen      = openDropdown === lead.id;

                return (
                  <tr
                    key={lead.id}
                    className={`group transition-colors ${
                      isSelected
                        ? "bg-blue-50/70"
                        : prStyle.row
                        ? `hover:bg-slate-50/80 ${prStyle.row}`
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(lead.id)}
                        className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                      />
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${avatarColor(lead.name)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                        >
                          {initials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              href={`/admin/leads/${lead.id}`}
                              className="font-semibold text-slate-900 text-[13px] leading-snug hover:text-blue-600 transition-colors"
                            >
                              {lead.name}
                            </Link>
                            {lead.leadSource && LEAD_SOURCE_LABELS[lead.leadSource] && (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                                  LEAD_SOURCE_PILL[lead.leadSource] ?? "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {LEAD_SOURCE_LABELS[lead.leadSource]}
                              </span>
                            )}
                          </div>
                          {lead.company && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">{lead.company}</p>
                          )}
                          {!lead.company && lead.country && (
                            <p className="text-xs text-slate-400 mt-0.5">{lead.country}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-xs text-slate-500 font-mono hover:text-blue-600 transition-colors truncate block max-w-[200px]"
                        title={lead.email}
                      >
                        {lead.email}
                      </a>
                    </td>

                    {/* Service / Role */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-600 block truncate max-w-[160px]">
                        {lead.roleApplied ?? lead.serviceInterest ?? (
                          <span className="text-slate-300">—</span>
                        )}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${prStyle.pill}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${prStyle.dot} shrink-0`} />
                        {priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${stStyle.pill}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${stStyle.dot} shrink-0`} />
                        {STATUS_LABELS[lead.status] ?? lead.status}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="px-4 py-4 hidden xl:table-cell">
                      {fmtAed(lead.expectedValue) ? (
                        <span className="text-xs font-semibold text-emerald-700">{fmtAed(lead.expectedValue)}</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Assigned */}
                    <td className="px-4 py-4 hidden xl:table-cell">
                      {lead.assignedTo ? (
                        <span className="text-xs text-slate-600">{lead.assignedTo}</span>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Follow-up */}
                    <td className="px-4 py-4 hidden 2xl:table-cell">
                      {nextFollowUpAt ? (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            overdue ? "text-red-600" : "text-slate-500"
                          }`}
                        >
                          {overdue && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          )}
                          {fmtShort(nextFollowUpAt)}
                          {overdue && <span className="text-[10px] font-normal"> Overdue</span>}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Added */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-400" suppressHydrationWarning>
                        {timeAgo(createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">

                        {/* Quick icon: Email (shows on hover) */}
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title={`Email ${lead.name}`}
                        >
                          <IconEmail />
                        </a>

                        {/* Quick icon: WhatsApp (shows on hover, only if phone) */}
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="WhatsApp"
                          >
                            <IconWhatsApp />
                          </a>
                        )}

                        {/* Actions dropdown */}
                        <div className="relative z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(isDropOpen ? null : lead.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Actions
                            <IconChevronDown />
                          </button>

                          {isDropOpen && (
                            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 overflow-hidden">
                              <Link
                                href={`/admin/leads/${lead.id}`}
                                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <span className="text-slate-400"><IconEye /></span>
                                View
                              </Link>
                              <Link
                                href={`/admin/leads/${lead.id}`}
                                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <span className="text-slate-400"><IconEdit /></span>
                                Edit
                              </Link>
                              <button
                                onClick={() => archiveLead(lead.id)}
                                disabled={busy}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                              >
                                <span className="text-slate-400"><IconArchive /></span>
                                Archive
                              </button>
                              <div className="my-1 mx-2 border-t border-slate-100" />
                              <button
                                onClick={() => deleteLead(lead.id)}
                                disabled={busy}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                <IconTrash />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-xs text-slate-400">
            Showing <span className="font-medium text-slate-600">{sortedCount}</span> lead{sortedCount !== 1 ? "s" : ""}
            {sortedCount < totalAll && (
              <> · <span className="text-slate-400">{totalAll - sortedCount} more not shown — apply filters to narrow results</span></>
            )}
          </p>
          {someSelected && (
            <p className="text-xs text-blue-600 font-medium">{selected.size} selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
