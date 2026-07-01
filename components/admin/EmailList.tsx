"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EmailRow {
  id: number;
  subject: string;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  toName: string | null;
  status: string;
  folder: string;
  sentAt: string | null;
  readAt: string | null;
  createdAt: string;
  leadId: number | null;
  lead: { id: number; name: string } | null;
  _count: { attachments: number };
}

interface EmailListProps {
  emails: EmailRow[];
  folder: "inbox" | "sent" | "drafts" | "trash";
  total: number;
  page: number;
  pageSize: number;
  q: string;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "Just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)   return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent:   "bg-emerald-100 text-emerald-700",
    draft:  "bg-gray-100 text-gray-600",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function EmailList({ emails: init, folder, total, page, pageSize, q }: EmailListProps) {
  const router = useRouter();
  const [emails, setEmails] = useState(init);
  const [deleting, setDeleting] = useState<number | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const deleteEmail = useCallback(async (id: number, permanent: boolean) => {
    if (permanent && !confirm("Permanently delete this email?")) return;
    setDeleting(id);
    await fetch(`/api/admin/emails/${id}`, { method: "DELETE" });
    setDeleting(null);
    setEmails((prev) => prev.filter((e) => e.id !== id));
    router.refresh();
  }, [router]);

  function buildUrl(params: Record<string, string>) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    sp.set("page", String(page));
    for (const [k, v] of Object.entries(params)) {
      if (v) sp.set(k, v); else sp.delete(k);
    }
    return `/admin/communications${folder !== "inbox" ? `/${folder}` : ""}?${sp.toString()}`;
  }

  if (emails.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">
          {folder === "inbox"  && "Your inbox is empty."}
          {folder === "sent"   && "No sent emails yet."}
          {folder === "drafts" && "No saved drafts."}
          {folder === "trash"  && "Trash is empty."}
        </p>
        {folder !== "inbox" && (
          <Link href="/admin/communications/compose" className="inline-block mt-3 text-sm text-blue-600 hover:underline">
            Compose a new email →
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {emails.map((email) => {
          const isUnread = folder === "inbox" && !email.readAt;
          const date     = folder === "sent" ? email.sentAt : email.createdAt;
          const party    = folder === "sent" || folder === "drafts"
            ? (email.toName ?? email.toEmail)
            : (email.fromName ?? email.fromEmail);

          return (
            <div
              key={email.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group ${
                deleting === email.id ? "opacity-40" : ""
              }`}
            >
              {/* Unread dot */}
              <div className={`w-2 h-2 rounded-full shrink-0 ${isUnread ? "bg-blue-500" : "bg-transparent"}`} />

              {/* Content */}
              <Link href={`/admin/communications/${email.id}`} className="flex-1 min-w-0 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                      {party}
                    </span>
                    {email.lead && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium shrink-0">
                        Lead #{email.lead.id}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${isUnread ? "text-gray-700" : "text-gray-500"}`}>
                    <span className={isUnread ? "font-semibold" : ""}>{email.subject || "(no subject)"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {email._count.attachments > 0 && (
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                  )}
                  <StatusBadge status={email.status} />
                  <span className="text-xs text-gray-400 w-16 text-right">{timeAgo(date)}</span>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {folder === "drafts" && (
                  <Link
                    href={`/admin/communications/compose?draftId=${email.id}`}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                    title="Continue editing"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                    </svg>
                  </Link>
                )}
                <button
                  onClick={() => deleteEmail(email.id, folder === "trash")}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  title={folder === "trash" ? "Delete permanently" : "Move to trash"}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500">
            {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildUrl({ page: String(p) })}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium ${
                  p === page ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
