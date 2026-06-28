import type { Metadata } from "next";
import Link from "next/link";
import WpImporter from "@/components/admin/WpImporter";

export const metadata: Metadata = { title: "WordPress Import" };

export default function WpImportPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/migration" className="text-sm text-gray-500 hover:text-gray-700">
          ← Migration
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">WordPress Import</h1>
      </div>
      <WpImporter />
    </div>
  );
}
