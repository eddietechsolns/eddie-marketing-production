import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageForm from "@/components/admin/forms/PageForm";

export const metadata: Metadata = { title: "Edit Page" };

interface Props { params: Promise<{ id: string }> }

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id: parseInt(id) } });
  if (!page) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-700">← Pages</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{page.title}</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PageForm page={page} />
      </div>
    </div>
  );
}
