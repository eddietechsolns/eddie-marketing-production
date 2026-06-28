import type { Metadata } from "next";
import Link from "next/link";
import PortfolioCategoryForm from "@/components/admin/forms/PortfolioCategoryForm";

export const metadata: Metadata = { title: "New Portfolio Category" };

export default function NewPortfolioCategoryPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/portfolio-categories"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Portfolio Categories
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Portfolio Category</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-xl">
        <PortfolioCategoryForm />
      </div>
    </div>
  );
}
