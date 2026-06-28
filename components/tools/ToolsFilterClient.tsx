"use client";

import { useState, useMemo } from "react";
import type { Tool, ToolCategory } from "@/lib/tools-data";
import { TOOL_CATEGORIES } from "@/lib/tools-data";
import ToolCard from "./ToolCard";

interface ToolsFilterClientProps {
  tools: Tool[];
  initialCategory?: ToolCategory | null;
}

export default function ToolsFilterClient({
  tools,
  initialCategory = null,
}: ToolsFilterClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(initialCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = !activeCategory || tool.category === activeCategory;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        tool.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [tools, query, activeCategory]);

  return (
    <div>
      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center text-sm text-slate-500 shrink-0">
          <span className="font-semibold text-slate-900">{filtered.length}</span>
          &nbsp;tool{filtered.length !== 1 ? "s" : ""}
          {activeCategory ? ` in ${activeCategory}` : ""}
          {query ? ` matching "${query}"` : ""}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeCategory === null
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          All Tools
        </button>
        {TOOL_CATEGORIES.map((cat) => {
          const count = tools.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeCategory === cat ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold text-slate-700 mb-1">No tools found</p>
          <p className="text-sm">
            Try a different search term or{" "}
            <button
              onClick={() => { setQuery(""); setActiveCategory(null); }}
              className="text-blue-600 hover:underline"
            >
              clear all filters
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
