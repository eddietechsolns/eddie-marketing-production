"use client";

import { useState } from "react";
import Link from "next/link";

interface EmailRow {
  id: number;
  subject: string;
  status: string;
  folder: string;
  toEmail: string;
  fromEmail: string;
  sentAt: string | null;
  createdAt: string;
  _count: { attachments: number };
}

interface LeadEmailPanelProps {
  leadId: number;
  leadEmail: string;
  leadName: string;
  emails: EmailRow[];
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  sent:   "bg-emerald-100 text-emerald-700",
  draft:  "bg-gray-100 text-gray-500",
  failed: "bg-red-100 text-red-700",
};

export default function LeadEmailPanel({ leadId, leadEmail, leadName, emails: initialEmails }: LeadEmailPanelProps) {
  const [emails] = useState(initialEmails);

  const composeUrl = `/admin/communications/compose?leadId=${leadId}&to=${encodeURIComponent(leadEmail)}&toName=${encodeURIComponent(leadName)}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {emails.length} email{emails.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Link
          href={composeUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          Compose Email
        </Link>
      </div>

      {emails.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="text-xs text-slate-400 mb-3">No emails sent to this lead yet.</p>
          <Link
            href={composeUrl}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Send the first email →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {emails.map((email) => (
            <Link
              key={email.id}
              href={`/admin/communications/${email.id}`}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                  {email.subject || "(no subject)"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${STATUS_COLORS[email.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {email.status}
                  </span>
                  {email._count.attachments > 0 && (
                    <span className="text-[10px] text-slate-400">📎 {email._count.attachments}</span>
                  )}
                  <span className="text-[10px] text-slate-400" suppressHydrationWarning>
                    {timeAgo(email.status === "sent" ? email.sentAt : email.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {emails.length >= 10 && (
            <Link
              href={`/admin/communications/sent?leadId=${leadId}`}
              className="block text-center text-xs text-blue-600 hover:text-blue-800 py-2 font-medium"
            >
              View all emails for this lead →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
