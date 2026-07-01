import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const email = await prisma.email.findUnique({ where: { id: Number(id) }, select: { subject: true } });
  return { title: email?.subject || "Email" };
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default async function EmailViewPage({ params }: Props) {
  const { id } = await params;
  const email = await prisma.email.findUnique({
    where: { id: Number(id) },
    include: {
      attachments: { select: { id: true, filename: true, size: true, mimeType: true } },
      lead: { select: { id: true, name: true, email: true } },
    },
  });

  if (!email) notFound();

  if (!email.readAt && email.folder === "inbox") {
    await prisma.email.update({ where: { id: email.id }, data: { readAt: new Date() } });
  }

  const backHref =
    email.folder === "sent"   ? "/admin/communications/sent"   :
    email.folder === "drafts" ? "/admin/communications/drafts" :
    "/admin/communications";

  const sentDate = email.sentAt ?? email.createdAt;

  const STATUS_COLORS: Record<string, string> = {
    sent:   "bg-emerald-100 text-emerald-700",
    draft:  "bg-gray-100 text-gray-600",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl">
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={backHref} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{email.subject || "(no subject)"}</h1>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase ${STATUS_COLORS[email.status] ?? "bg-gray-100 text-gray-600"}`}>
          {email.status}
        </span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex gap-3">
            <span className="text-xs font-semibold text-gray-400 w-14 shrink-0 pt-0.5">From</span>
            <span className="text-gray-800">
              {email.fromName ? `${email.fromName} <${email.fromEmail}>` : email.fromEmail}
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-xs font-semibold text-gray-400 w-14 shrink-0 pt-0.5">To</span>
            <span className="text-gray-800">
              {email.toName ? `${email.toName} <${email.toEmail}>` : email.toEmail}
            </span>
          </div>
          {email.cc && (
            <div className="flex gap-3">
              <span className="text-xs font-semibold text-gray-400 w-14 shrink-0 pt-0.5">Cc</span>
              <span className="text-gray-800">{email.cc}</span>
            </div>
          )}
          <div className="flex gap-3">
            <span className="text-xs font-semibold text-gray-400 w-14 shrink-0 pt-0.5">Date</span>
            <span className="text-gray-800">
              {sentDate.toLocaleDateString("en-GB", {
                weekday: "short", day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
          </div>
          {email.lead && (
            <div className="flex gap-3">
              <span className="text-xs font-semibold text-gray-400 w-14 shrink-0 pt-0.5">Lead</span>
              <Link href={`/admin/leads/${email.lead.id}`} className="text-blue-600 hover:underline">
                {email.lead.name} (#{email.lead.id})
              </Link>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Link
            href={`/admin/communications/compose?to=${encodeURIComponent(email.toEmail)}&toName=${encodeURIComponent(email.toName ?? "")}&subject=${encodeURIComponent(`Re: ${email.subject}`)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            Reply
          </Link>
          <Link
            href={`/admin/communications/compose?subject=${encodeURIComponent(`Fwd: ${email.subject}`)}&body=${encodeURIComponent(`\n\n--- Forwarded message ---\nFrom: ${email.fromEmail}\nSubject: ${email.subject}\n\n`)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
            </svg>
            Forward
          </Link>
          {email.status === "failed" && (
            <form action={`/api/admin/emails/${email.id}/send`} method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                Retry Send
              </button>
            </form>
          )}
        </div>

        {email.errorMsg && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <strong>Send error:</strong> {email.errorMsg}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        <div
          className="p-6 prose prose-sm max-w-none text-gray-800 leading-relaxed min-h-48"
          dangerouslySetInnerHTML={{ __html: email.body || "<p class='text-gray-400 italic'>Empty email body.</p>" }}
        />
      </div>

      {/* Attachments */}
      {email.attachments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Attachments ({email.attachments.length})
          </h3>
          <ul className="flex flex-wrap gap-2">
            {email.attachments.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
                <span className="font-medium text-gray-700">{a.filename}</span>
                <span className="text-gray-400">{formatBytes(a.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
