import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TemplateForm from "@/components/admin/forms/TemplateForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await prisma.emailTemplate.findUnique({ where: { id: Number(id) }, select: { name: true } });
  return { title: t ? `Edit "${t.name}"` : "Edit Template" };
}

export default async function EditTemplatePage({ params }: Props) {
  const { id } = await params;
  const template = await prisma.emailTemplate.findUnique({ where: { id: Number(id) } });
  if (!template) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/communications/templates" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Template</h1>
      </div>
      <TemplateForm template={{
        ...template,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      }} />
    </div>
  );
}
