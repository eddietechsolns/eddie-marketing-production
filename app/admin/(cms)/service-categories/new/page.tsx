import type { Metadata } from "next";
import Link from "next/link";
import ServiceCategoryForm from "@/components/admin/forms/ServiceCategoryForm";

export const metadata: Metadata = { title: "New Service Category" };

export default function NewServiceCategoryPage() {
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
        <h1 className="text-xl font-bold text-gray-900">New Service Category</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-xl">
        <ServiceCategoryForm />
      </div>
    </div>
  );
}
