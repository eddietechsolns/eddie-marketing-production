import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/forms/ServiceForm";

export const metadata: Metadata = { title: "New Service" };

export default async function NewServicePage() {
  const serviceCategories = await prisma.serviceCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/services" className="text-sm text-gray-500 hover:text-gray-700">
          ← Services
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Service</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ServiceForm serviceCategories={serviceCategories} />
      </div>
    </div>
  );
}
