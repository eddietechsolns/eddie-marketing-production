import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RedirectForm from "@/components/admin/forms/RedirectForm";

export const metadata: Metadata = { title: "Edit Redirect" };

interface Props { params: Promise<{ id: string }> }

export default async function EditRedirectPage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.redirect.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/redirects" className="text-sm text-gray-500 hover:text-gray-700">← Redirects</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900 font-mono text-base">{item.sourceUrl}</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <RedirectForm redirect={item} />
      </div>
    </div>
  );
}
