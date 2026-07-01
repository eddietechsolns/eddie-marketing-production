import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EmailList from "@/components/admin/EmailList";
import { CommunicationsHeader } from "@/app/admin/(cms)/communications/page";

export const metadata: Metadata = { title: "Drafts" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function DraftsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q    = sp.q?.trim() ?? "";
  const page = Math.max(1, Number(sp.page ?? "1"));
  const pageSize = 25;

  const where: Record<string, unknown> = { folder: "drafts" };
  if (q) {
    where.OR = [
      { subject: { contains: q, mode: "insensitive" } },
      { toEmail: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, emails] = await Promise.all([
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
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return (
    <div>
      <CommunicationsHeader active="drafts" />

      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Drafts</h2>
        <p className="text-xs text-gray-500 mt-0.5">{total} saved draft{total !== 1 ? "s" : ""}</p>
      </div>

      <EmailList
        emails={emails.map((e) => ({
          ...e,
          sentAt: e.sentAt?.toISOString() ?? null,
          readAt: e.readAt?.toISOString() ?? null,
          createdAt: e.createdAt.toISOString(),
        }))}
        folder="drafts"
        total={total}
        page={page}
        pageSize={pageSize}
        q={q}
      />
    </div>
  );
}
