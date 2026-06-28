import type { Metadata } from "next";
import Link from "next/link";
import LocationForm from "@/components/admin/forms/LocationForm";

export const metadata: Metadata = { title: "New Location" };

export default function NewLocationPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/locations" className="text-sm text-gray-500 hover:text-gray-700">← Locations</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Location</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <LocationForm />
      </div>
    </div>
  );
}
