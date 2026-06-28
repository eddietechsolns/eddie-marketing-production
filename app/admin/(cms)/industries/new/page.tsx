import type { Metadata } from "next";
import Link from "next/link";
import IndustryForm from "@/components/admin/forms/IndustryForm";

export const metadata: Metadata = { title: "New Industry" };

export default function NewIndustryPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/industries" className="text-sm text-gray-500 hover:text-gray-700">← Industries</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Industry</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <IndustryForm />
      </div>
    </div>
  );
}
