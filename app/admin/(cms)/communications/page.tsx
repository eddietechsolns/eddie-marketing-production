import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmailList from "@/components/admin/EmailList";

export const metadata: Metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function InboxPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q        = sp.q?.trim() ?? "";
  const page     = Math.max(1, Number(sp.page ?? "1"));
  const pageSize = 25;

  const where: Record<string, unknown> = { folder: "inbox" };
  if (q) {
    where.OR = [
      { subject:  { contains: q, mode: "insensitive" } },
      { fromEmail:{ contains: q, mode: "insensitive" } },
      { fromName: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, emails, unreadCount] = await Promise.all([
    prisma.email.count({ where }),
    prisma.email.findMany({
      where,
      select: {
        id: true, subject: true, fromEmail: true, fromName: true,
        toEmail: true, toName: true, status: true, folder: true,
        sentAt: true, readAt: true, createdAt: true, leadId: true,
        lead: { select: { id: true, name: true } },
        _count: { select: { attachments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.email.count({ where: { folder: "inbox", readAt: null } }),
  ]);

  return (
    <div>
      <CommunicationsHeader active="inbox" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Inbox</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {total} message{total !== 1 ? "s" : ""}
            {unreadCount > 0 && <span className="ml-1 text-blue-600 font-semibold">· {unreadCount} unread</span>}
          </p>
        </div>
        <SearchBar q={q} />
      </div>

      <EmailList
        emails={emails.map(serialize)}
        folder="inbox"
        total={total}
        page={page}
        pageSize={pageSize}
        q={q}
      />
    </div>
  );
}

function serialize(e: {
  id: number; subject: string; fromEmail: string; fromName: string | null;
  toEmail: string; toName: string | null; status: string; folder: string;
  sentAt: Date | null; readAt: Date | null; createdAt: Date; leadId: number | null;
  lead: { id: number; name: string } | null;
  _count: { attachments: number };
}) {
  return {
    ...e,
    sentAt: e.sentAt?.toISOString() ?? null,
    readAt: e.readAt?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
  };
}

function SearchBar({ q }: { q: string }) {
  return (
    <form method="GET" className="flex gap-2">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search emails…"
          className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />
      </div>
      <button type="submit" className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700">
        Search
      </button>
    </form>
  );
}

export function CommunicationsHeader({ active }: { active: string }) {
  const tabs = [
    { href: "/admin/communications",          label: "Inbox",     key: "inbox" },
    { href: "/admin/communications/sent",     label: "Sent",      key: "sent" },
    { href: "/admin/communications/drafts",   label: "Drafts",    key: "drafts" },
    { href: "/admin/communications/templates",label: "Templates", key: "templates" },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              active === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Link
        href="/admin/communications/compose"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Compose
      </Link>
    </div>
  );
}
