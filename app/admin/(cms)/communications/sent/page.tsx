import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EmailList from "@/components/admin/EmailList";
import { CommunicationsHeader } from "@/app/admin/(cms)/communications/page";

export const metadata: Metadata = { title: "Sent Emails" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; leadId?: string }>;
}

export default async function SentPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q      = sp.q?.trim() ?? "";
  const leadId = sp.leadId ? Number(sp.leadId) : undefined;
  const page   = Math.max(1, Number(sp.page ?? "1"));
  const pageSize = 25;

  const where: Record<string, unknown> = { folder: "sent" };
  if (leadId) where.leadId = leadId;
  if (q) {
    where.OR = [
      { subject:  { contains: q, mode: "insensitive" } },
      { toEmail:  { contains: q, mode: "insensitive" } },
      { toName:   { contains: q, mode: "insensitive" } },
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
      orderBy: { sentAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return (
    <div>
      <CommunicationsHeader active="sent" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sent{leadId ? " (filtered by lead)" : ""}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{total} sent email{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <EmailList
        emails={emails.map((e) => ({
          ...e,
          sentAt: e.sentAt?.toISOString() ?? null,
          readAt: e.readAt?.toISOString() ?? null,
          createdAt: e.createdAt.toISOString(),
        }))}
        folder="sent"
        total={total}
        page={page}
        pageSize={pageSize}
        q={q}
      />
    </div>
  );
}
