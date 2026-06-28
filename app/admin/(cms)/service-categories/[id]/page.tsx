import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceCategoryForm from "@/components/admin/forms/ServiceCategoryForm";

export const metadata: Metadata = { title: "Edit Service Category" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServiceCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await prisma.serviceCategory.findUnique({ where: { id: parseInt(id) } });
  if (!category) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/service-categories"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Service Categories
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{category.name}</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-xl">
        <ServiceCategoryForm category={category} />
      </div>
    </div>
  );
}
