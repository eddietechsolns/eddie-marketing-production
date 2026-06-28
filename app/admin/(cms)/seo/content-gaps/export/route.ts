import { prisma } from "@/lib/prisma";
import {
  CLUSTERS,
  computeCoverage,
  scoredRecommendations,
  toCsvRow,
  CSV_HEADERS,
} from "@/lib/content-gap-engine";

export const dynamic = "force-dynamic";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const [rawPosts, rawCaseStudies, rawPortfolio] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "published" },
      select: { title: true, categories: { select: { name: true } } },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published" },
      select: { title: true, serviceType: true, industry: true },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "published" },
      select: { title: true, services: true },
    }),
  ]);

  const coverages = computeCoverage(CLUSTERS, {
    blogPosts: rawPosts,
    caseStudies: rawCaseStudies,
    portfolioProjects: rawPortfolio,
  });

  const recs = scoredRecommendations(coverages);

  const rows = [
    CSV_HEADERS.map(escapeCsv).join(","),
    ...recs.map((r) => toCsvRow(r).map(escapeCsv).join(",")),
  ].join("\n");

  return new Response(rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="content-gaps.csv"',
    },
  });
}
