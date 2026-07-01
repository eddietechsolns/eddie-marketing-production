"use client";

import { useState } from "react";
import Link from "next/link";
import type { ScoredRecommendation } from "@/lib/content-gap-engine";
import dynamic from "next/dynamic";

// Lazy-load the studio to keep initial bundle light
const AIPublishingStudio = dynamic(
  () => import("@/components/admin/AIPublishingStudio"),
  { ssr: false }
);

interface Props {
  topRecs: ScoredRecommendation[];
}

const TYPE_COLORS: Record<string, string> = {
  blog: "bg-orange-100 text-orange-700",
  "case-study": "bg-violet-100 text-violet-700",
  portfolio: "bg-teal-100 text-teal-700",
  tool: "bg-blue-100 text-blue-700",
  academy: "bg-pink-100 text-pink-700",
};

const FALLBACK_HREFS: Record<string, string> = {
  blog: "/admin/posts/new",
  "case-study": "/admin/case-studies/new",
  portfolio: "/admin/portfolio/new",
  tool: "/admin/pages/new",
  academy: "/admin/posts/new",
};

export default function PublishingCentreWidget({ topRecs }: Props) {
  const [activeRec, setActiveRec] = useState<ScoredRecommendation | null>(null);

  if (topRecs.length === 0) {
    return (
      <div className="px-5 py-4 text-sm text-slate-400">
        No content gap recommendations right now. Great job!
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-100">
        {topRecs.map((rec: ScoredRecommendation, i: number) => {
          const isBlog = rec.contentType === "blog" || rec.contentType === "academy";

          return (
            <div key={rec.slug} className="flex items-center gap-4 px-5 py-4">
              {/* Rank number */}
              <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                {i + 1}
              </div>

              {/* Recommendation info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      TYPE_COLORS[rec.contentType] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {rec.contentType}
                  </span>
                  <span className="text-[10px] text-slate-400">{rec.clusterName}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 truncate">{rec.title}</p>
                <p className="text-xs text-slate-400 truncate">{rec.reason}</p>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-700">
                    {Math.round(rec.priorityScore)}
                    <span className="text-slate-400 font-normal">/100</span>
                  </p>
                </div>

                {isBlog ? (
                  /* AI Studio button for blog-type content */
                  <button
                    type="button"
                    onClick={() => setActiveRec(rec)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>✦</span>
                    Create →
                  </button>
                ) : (
                  /* Regular link for non-blog types */
                  <Link
                    href={FALLBACK_HREFS[rec.contentType] ?? "/admin/posts/new"}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Create →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Publishing Studio modal */}
      {activeRec && (
        <AIPublishingStudio
          recommendation={activeRec}
          onClose={() => setActiveRec(null)}
        />
      )}
    </>
  );
}
