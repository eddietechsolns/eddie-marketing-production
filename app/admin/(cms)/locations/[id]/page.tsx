import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LocationForm from "@/components/admin/forms/LocationForm";

export const metadata: Metadata = { title: "Edit Location" };

interface Props { params: Promise<{ id: string }> }

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  const location = await prisma.location.findUnique({ where: { id: parseInt(id) } });
  if (!location) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/locations" className="text-sm text-gray-500 hover:text-gray-700">← Locations</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{location.title}</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <LocationForm location={location} />
      </div>
    </div>
  );
}
