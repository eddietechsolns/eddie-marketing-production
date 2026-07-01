import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmailComposer from "@/components/admin/EmailComposer";

export const metadata: Metadata = { title: "Compose Email" };

interface PageProps {
  searchParams: Promise<{
    leadId?: string; to?: string; toName?: string;
    subject?: string; draftId?: string;
  }>;
}

export default async function ComposePage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const leadId  = sp.leadId ? Number(sp.leadId) : undefined;
  const draftId = sp.draftId ? Number(sp.draftId) : undefined;

  const [templates, draft] = await Promise.all([
    prisma.emailTemplate.findMany({
      where: { isActive: true },
      orderBy: [{ usageCount: "desc" }, { name: "asc" }],
      select: { id: true, name: true, subject: true, body: true, category: true },
    }),
    draftId
      ? prisma.email.findUnique({ where: { id: draftId } })
      : Promise.resolve(null),
  ]);

  const defaultTo      = draft?.toEmail ?? sp.to ?? "";
  const defaultToName  = draft?.toName  ?? sp.toName ?? "";
  const defaultSubject = draft?.subject ?? sp.subject ?? "";
  const defaultBody    = draft?.body    ?? "";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/communications"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {draft ? "Edit Draft" : "New Email"}
          </h1>
          {leadId && <p className="text-sm text-gray-500">To: {defaultTo}</p>}
        </div>
      </div>

      <EmailComposer
        templates={templates}
        defaultTo={defaultTo}
        defaultToName={defaultToName}
        defaultSubject={defaultSubject}
        defaultBody={defaultBody}
        leadId={leadId}
        draftId={draftId}
      />
    </div>
  );
}
