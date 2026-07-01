import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CommunicationsHeader } from "@/app/admin/(cms)/communications/page";

export const metadata: Metadata = { title: "Email Templates" };
export const dynamic = "force-dynamic";

const CATEGORY_COLORS: Record<string, string> = {
  follow_up:    "bg-blue-100 text-blue-700",
  proposal:     "bg-purple-100 text-purple-700",
  introduction: "bg-green-100 text-green-700",
  general:      "bg-gray-100 text-gray-600",
};

export default async function TemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: [{ usageCount: "desc" }, { name: "asc" }],
  });

  return (
    <div>
      <CommunicationsHeader active="templates" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Email Templates</h2>
          <p className="text-xs text-gray-500 mt-0.5">{templates.length} template{templates.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/communications/templates/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-gray-400 text-sm mb-3">No templates yet.</p>
          <Link href="/admin/communications/templates/new" className="text-blue-600 text-sm hover:underline">
            Create your first template →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/admin/communications/templates/${t.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                  {t.name}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!t.isActive && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">inactive</span>
                  )}
                  {t.category && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${CATEGORY_COLORS[t.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {t.category.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 font-medium mb-2 truncate">{t.subject}</p>
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                {t.body.replace(/<[^>]+>/g, " ").trim() || "No body content"}
              </p>
              <p className="text-[10px] text-gray-300 mt-3">
                Used {t.usageCount} time{t.usageCount !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
