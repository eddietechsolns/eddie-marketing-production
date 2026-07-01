"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface SerializedMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface SerializedSession {
  id: string;
  visitorId: string;
  landingPage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
  messages: SerializedMessage[];
  lead: { id: number; name: string; email: string; status: string } | null;
  serviceIntent: string | null;
  messageCount: number;
}

interface Props {
  sessions: SerializedSession[];
  total: number;
  filteredCount: number;
  activeFilters: boolean;
  filterOptions: {
    landingPages: string[];
    devices: string[];
    countries: string[];
    services: string[];
  };
  currentFilters: {
    dateFrom: string;
    dateTo: string;
    landing: string;
    device: string;
    country: string;
    service: string;
    leadCaptured: string;
  };
}

const SERVICE_KEYWORDS = [
  "SEO", "Google Ads", "Social Media", "Website", "Content Marketing",
  "Email Marketing", "Analytics", "PPC", "Branding", "Video", "Lead Generation",
];

function detectService(messages: SerializedMessage[]): string | null {
  const text = messages.map((m) => m.content).join(" ").toLowerCase();
  return SERVICE_KEYWORDS.find((s) => text.includes(s.toLowerCase())) ?? null;
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-AE", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
    timeZone: "Asia/Dubai",
  }).format(new Date(iso));
}

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("en-AE", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true, timeZone: "Asia/Dubai",
  }).format(new Date(iso));
}

function ActionsDropdown({ session, onDelete }: { session: SerializedSession; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function exportConversation() {
    const lines: string[] = [
      `Chat Session Export`,
      `Session ID: ${session.id}`,
      `Date: ${fmtDate(session.createdAt)}`,
      `Landing Page: ${session.landingPage ?? "—"}`,
      `Device / Channel: ${session.utmMedium ?? "—"}`,
      `Lead Captured: ${session.lead ? `Yes — ${session.lead.name} (${session.lead.email})` : "No"}`,
      `Service Intent: ${session.serviceIntent ?? "—"}`,
      ``,
      `─── Conversation ───────────────────────────────────`,
    ];
    session.messages.forEach((m) => {
      const role = m.role === "user" ? "Visitor" : "Eddie AI";
      lines.push(``, `[${fmtTime(m.createdAt)}] ${role}:`, m.content);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-session-${session.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
      >
        Actions
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
          {session.lead && (
            <Link
              href={`/admin/leads/${session.lead.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              View Lead
            </Link>
          )}
          <button
            onClick={exportConversation}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Transcript
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => { setOpen(false); onDelete(session.id); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete Session
          </button>
        </div>
      )}
    </div>
  );
}

function ConversationExpand({ messages }: { messages: SerializedMessage[] }) {
  return (
    <div className="max-h-96 overflow-y-auto p-4 space-y-3 bg-slate-50 rounded-xl border border-slate-100">
      {messages.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">No messages in this session.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role !== "user" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 0 1 6 6c0 3.314-2.686 6-6 6S4 11.314 4 8a6 6 0 0 1 6-6Zm0 14c-4.418 0-8 1.79-8 4v.5h16V20c0-2.21-3.582-4-8-4Z"/>
                </svg>
              </div>
            )}
            <div className={`max-w-[72%] ${msg.role === "user" ? "order-first" : ""}`}>
              <div
                className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-slate-800 text-white rounded-br-sm"
                    : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
              <p className={`mt-0.5 text-[10px] text-slate-400 ${msg.role === "user" ? "text-right" : ""}`}>
                {fmtTime(msg.createdAt)}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function ChatSessionsTable({
  sessions,
  total,
  filteredCount,
  activeFilters,
  filterOptions,
  currentFilters,
}: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localSessions, setLocalSessions] = useState(sessions);

  useEffect(() => { setLocalSessions(sessions); }, [sessions]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this chat session permanently? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/chat-sessions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocalSessions((prev) => prev.filter((s) => s.id !== id));
        if (expandedId === id) setExpandedId(null);
        router.refresh();
      } else {
        alert("Failed to delete session.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  const hasFilters = activeFilters;

  return (
    <div className="space-y-4">
      {/* ── Filter Panel ──────────────────────────────────────────────────── */}
      <form method="get" action="/admin/leads/chat-sessions" className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">

        {/* Row 1: Date Range */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20 shrink-0">Date Range</span>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              name="dateFrom"
              defaultValue={currentFilters.dateFrom}
              className={`border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${currentFilters.dateFrom ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50"}`}
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              name="dateTo"
              defaultValue={currentFilters.dateTo}
              className={`border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${currentFilters.dateTo ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50"}`}
            />
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Row 2: Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">

          {/* Landing Page */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Landing Page</label>
            <select
              name="landing"
              defaultValue={currentFilters.landing}
              className={`border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${currentFilters.landing ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50"}`}
            >
              <option value="">All pages</option>
              {filterOptions.landingPages.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Service Intent */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Intent</label>
            <select
              name="service"
              defaultValue={currentFilters.service}
              className={`border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${currentFilters.service ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50"}`}
            >
              <option value="">All services</option>
              {SERVICE_KEYWORDS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country</label>
            <select
              name="country"
              defaultValue={currentFilters.country}
              className={`border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${currentFilters.country ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50"}`}
            >
              <option value="">All countries</option>
              {filterOptions.countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Device / Channel */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Device / Channel</label>
            <select
              name="device"
              defaultValue={currentFilters.device}
              className={`border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${currentFilters.device ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50"}`}
            >
              <option value="">All channels</option>
              {filterOptions.devices.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Lead Captured */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Captured</label>
            <select
              name="leadCaptured"
              defaultValue={currentFilters.leadCaptured}
              className={`border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${currentFilters.leadCaptured ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50"}`}
            >
              <option value="">All sessions</option>
              <option value="yes">Yes — lead captured</option>
              <option value="no">No — visitor only</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 select-none">Apply</label>
            <div className="flex gap-1.5">
              <button
                type="submit"
                className="flex-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Apply
              </button>
              {hasFilters && (
                <a
                  href="/admin/leads/chat-sessions"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors flex items-center"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {localSessions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">
            {hasFilters ? "No sessions match these filters" : "No chat sessions yet"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {hasFilters ? "Try adjusting your filters" : "Sessions will appear here once visitors use the AI assistant"}
          </p>
          {hasFilters && (
            <a href="/admin/leads/chat-sessions" className="inline-flex mt-3 text-xs text-blue-600 hover:underline">
              Clear all filters
            </a>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {/* Result count */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{localSessions.length}</span>
              {hasFilters && <> of <span className="font-semibold text-slate-700">{total}</span> total</>}
              {" "}sessions
              {hasFilters && <span className="ml-1.5 text-blue-500 font-medium">· filtered</span>}
            </p>
            <p className="text-xs text-slate-400">Click a row to expand conversation</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-800">
                  {[
                    { label: "Date & Time", w: "" },
                    { label: "Visitor / Lead", w: "w-44" },
                    { label: "Landing Page", w: "w-40" },
                    { label: "Service Intent", w: "w-36" },
                    { label: "Channel", w: "w-28" },
                    { label: "Messages", w: "w-20 text-center" },
                    { label: "Lead Captured", w: "w-36" },
                    { label: "", w: "w-24" },
                  ].map(({ label, w }) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-[10px] font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap ${w}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {localSessions.map((session) => {
                  const isExpanded = expandedId === session.id;
                  const isDeleting = deletingId === session.id;
                  const service = session.serviceIntent ?? detectService(session.messages);

                  return (
                    <>
                      <tr
                        key={session.id}
                        onClick={() => setExpandedId(isExpanded ? null : session.id)}
                        className={`border-b border-slate-100 cursor-pointer transition-colors ${
                          isExpanded
                            ? "bg-blue-50/60 hover:bg-blue-50"
                            : "hover:bg-slate-50/80"
                        } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
                      >
                        {/* Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-xs font-medium text-slate-700">{fmtDate(session.createdAt).split(",")[0]}</p>
                          <p className="text-[10px] text-slate-400">{fmtDate(session.createdAt).split(",").slice(1).join(",").trim()}</p>
                        </td>

                        {/* Visitor / Lead */}
                        <td className="px-4 py-3">
                          {session.lead ? (
                            <div>
                              <p className="text-xs font-semibold text-slate-800 leading-tight">{session.lead.name}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{session.lead.email}</p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-mono">{session.visitorId.slice(0, 12)}…</p>
                          )}
                        </td>

                        {/* Landing Page */}
                        <td className="px-4 py-3">
                          <span className="text-[11px] text-slate-500 block truncate max-w-[160px]" title={session.landingPage ?? undefined}>
                            {session.landingPage ?? <span className="text-slate-300">—</span>}
                          </span>
                        </td>

                        {/* Service Intent */}
                        <td className="px-4 py-3">
                          {service ? (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-100">
                              {service}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px]">—</span>
                          )}
                        </td>

                        {/* Channel */}
                        <td className="px-4 py-3">
                          {session.utmMedium ? (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              {session.utmMedium}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px]">direct</span>
                          )}
                        </td>

                        {/* Messages */}
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center rounded-full w-7 h-7 text-[11px] font-bold ${
                            session.messageCount >= 10
                              ? "bg-blue-100 text-blue-700"
                              : session.messageCount >= 5
                              ? "bg-slate-100 text-slate-700"
                              : "bg-slate-50 text-slate-400"
                          }`}>
                            {session.messageCount}
                          </span>
                        </td>

                        {/* Lead Captured */}
                        <td className="px-4 py-3">
                          {session.lead ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              {session.lead.name}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-100">
                              Visitor only
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td
                          className="px-4 py-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionsDropdown session={session} onDelete={handleDelete} />
                        </td>
                      </tr>

                      {/* Expanded conversation */}
                      {isExpanded && (
                        <tr key={`${session.id}-expand`} className="bg-blue-50/30">
                          <td colSpan={8} className="px-4 pb-4 pt-2">
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                              {/* Conversation header */}
                              <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <p className="text-xs font-semibold text-slate-700">
                                    Conversation — {session.messageCount} messages
                                  </p>
                                  <span className="text-[10px] text-slate-400">{fmtDate(session.createdAt)}</span>
                                </div>
                                <button
                                  onClick={() => setExpandedId(null)}
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <ConversationExpand messages={session.messages} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
