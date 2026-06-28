import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/forms/ServiceForm";

export const metadata: Metadata = { title: "Edit Service" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const [service, serviceCategories] = await Promise.all([
    prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    }),
    prisma.serviceCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!service) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/services" className="text-sm text-gray-500 hover:text-gray-700">
          ← Services
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{service.title}</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ServiceForm service={service} serviceCategories={serviceCategories} />
      </div>
    </div>
  );
}
