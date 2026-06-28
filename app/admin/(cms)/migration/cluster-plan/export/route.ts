import { NextResponse } from "next/server";
import { computeActionPlan, runClusterAnalysis } from "@/lib/cluster-analysis";

function csvEscape(value: string): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(values: string[]): string {
  return values.map(csvEscape).join(",");
}

export async function GET() {
  const { clusterMap, uncategorized } = await runClusterAnalysis();
  const plan = computeActionPlan(clusterMap, uncategorized);

  const header = csvRow([
    "Content Type",
    "Title",
    "Slug",
    "Cluster",
    "Recommended Action",
    "Reason",
  ]);

  const rows = plan.map(ai =>
    csvRow([
      ai.item.kind === "page" ? "Page" : "Blog Post",
      ai.item.title,
      ai.item.slug,
      ai.clusterName,
      ai.action,
      ai.reason,
    ])
  );

  const csv = [header, ...rows].join("\r\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cluster-action-plan.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
