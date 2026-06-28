import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PortfolioForm from "@/components/admin/forms/PortfolioForm";

export const metadata: Metadata = { title: "New Project" };

export default async function NewPortfolioPage() {
  const [portfolioCategories, industries, locations] = await Promise.all([
    prisma.portfolioCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.industry.findMany({ where: { status: "published" }, orderBy: { title: "asc" } }),
    prisma.location.findMany({ where: { status: "published" }, orderBy: { title: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/portfolio" className="text-sm text-gray-500 hover:text-gray-700">
          ← Portfolio
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Project</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PortfolioForm
          portfolioCategories={portfolioCategories}
          industries={industries}
          locations={locations}
        />
      </div>
    </div>
  );
}
