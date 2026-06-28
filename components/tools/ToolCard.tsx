import Link from "next/link";
import type { Tool } from "@/lib/tools-data";
import { TYPE_LABELS, TYPE_COLORS, DIFFICULTY_COLORS } from "@/lib/tools-data";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "featured" | "compact";
}

export default function ToolCard({ tool, variant = "default" }: ToolCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all"
      >
        <span className="text-2xl shrink-0 mt-0.5">{tool.iconEmoji}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
            {tool.name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{tool.category}</p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="group relative flex flex-col p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">{tool.iconEmoji}</span>
            <div className="flex items-center gap-2">
              {tool.isNew && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                  New
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[tool.type]}`}
              >
                {TYPE_LABELS[tool.type]}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
            {tool.name}
          </h3>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed line-clamp-2">
            {tool.tagline}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className={`font-medium ${DIFFICULTY_COLORS[tool.difficulty]}`}>
                {tool.difficulty}
              </span>
              <span>·</span>
              <span>{tool.timeToComplete}</span>
            </div>
            <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
              Open →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{tool.iconEmoji}</span>
        <div className="flex items-center gap-1.5">
          {tool.isNew && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">
              New
            </span>
          )}
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[tool.type]}`}
          >
            {TYPE_LABELS[tool.type]}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors leading-snug">
        {tool.name}
      </h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2 flex-1">
        {tool.tagline}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className={`font-medium ${DIFFICULTY_COLORS[tool.difficulty]}`}>
            {tool.difficulty}
          </span>
          <span>·</span>
          <span>{tool.timeToComplete}</span>
        </div>
        <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
          Use →
        </span>
      </div>
    </Link>
  );
}
