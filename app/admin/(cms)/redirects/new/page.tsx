import type { Metadata } from "next";
import Link from "next/link";
import RedirectForm from "@/components/admin/forms/RedirectForm";

export const metadata: Metadata = { title: "New Redirect" };

export default function NewRedirectPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/redirects" className="text-sm text-gray-500 hover:text-gray-700">← Redirects</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Redirect</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <RedirectForm />
      </div>
    </div>
  );
}
