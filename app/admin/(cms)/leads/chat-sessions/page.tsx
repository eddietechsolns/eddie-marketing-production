import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Chat Sessions | Admin" };

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dubai",
  }).format(d);
}

function excerpt(text: string, max = 100) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default async function ChatSessionsPage() {
  const sessions = await prisma.chatSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 30,
      },
      lead: {
        select: { id: true, name: true, email: true, status: true },
      },
    },
  });

  const totalSessions = await prisma.chatSession.count();
  const leadsCreated = await prisma.chatSession.count({ where: { leadId: { not: null } } });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Chat Sessions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Conversations from the Eddie AI Assistant widget
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          ← All Leads
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Sessions", value: totalSessions },
          { label: "Leads Captured", value: leadsCreated },
          { label: "Conversion Rate", value: totalSessions ? `${Math.round((leadsCreated / totalSessions) * 100)}%` : "—" },
          { label: "Shown (last 100)", value: sessions.length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {sessions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-slate-500">No chat sessions yet. They will appear here once visitors use the AI assistant.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {["Date", "Landing Page", "Messages", "Service Intent", "Lead Captured", "Conversation"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const userMessages = session.messages.filter((m) => m.role === "user");
                  const allText = session.messages.map((m) => m.content).join(" ").toLowerCase();

                  // Detect service interest from conversation
                  const services = ["SEO", "Google Ads", "social media", "website", "content", "email", "analytics", "proposal"];
                  const serviceIntent = services.find((s) => allText.includes(s.toLowerCase()));

                  // Conversation summary (last user message)
                  const lastUserMsg = userMessages[userMessages.length - 1]?.content ?? "—";

                  return (
                    <tr key={session.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        {fmtDate(session.createdAt)}
                      </td>
                      <td className="px-4 py-3 max-w-[160px]">
                        <span className="truncate block text-slate-600 text-xs">
                          {session.landingPage ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {session.messages.length}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {serviceIntent ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {serviceIntent}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {session.lead ? (
                          <Link
                            href={`/admin/leads/${session.lead.id}`}
                            className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 hover:bg-green-200 transition-colors"
                          >
                            ✓ {session.lead.name}
                          </Link>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="text-xs text-slate-500 truncate">
                          {excerpt(lastUserMsg, 80)}
                        </p>
                      </td>
                    </tr>
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
