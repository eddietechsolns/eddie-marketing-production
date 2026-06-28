import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortfolioForm from "@/components/admin/forms/PortfolioForm";

export const metadata: Metadata = { title: "Edit Project" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({ params }: Props) {
  const { id } = await params;
  const [project, portfolioCategories, industries, locations] = await Promise.all([
    prisma.portfolioProject.findUnique({
      where: { id: parseInt(id) },
      include: { category: true, industries: true, locations: true },
    }),
    prisma.portfolioCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.industry.findMany({ where: { status: "published" }, orderBy: { title: "asc" } }),
    prisma.location.findMany({ where: { status: "published" }, orderBy: { title: "asc" } }),
  ]);
  if (!project) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/portfolio" className="text-sm text-gray-500 hover:text-gray-700">
          ← Portfolio
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PortfolioForm
          project={project}
          portfolioCategories={portfolioCategories}
          industries={industries}
          locations={locations}
        />
      </div>
    </div>
  );
}
