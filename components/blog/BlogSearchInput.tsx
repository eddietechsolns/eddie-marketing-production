"use client";

import { useState } from "react";

interface BlogSearchInputProps {
  defaultValue?: string;
  currentCategory?: string;
}

export default function BlogSearchInput({ defaultValue, currentCategory }: BlogSearchInputProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <form action="/blog" method="GET" className="flex items-center max-w-md gap-2">
      {currentCategory && (
        <input type="hidden" name="category" value={currentCategory} />
      )}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search articles..."
          className="w-full bg-white/10 text-white placeholder-slate-400 text-sm border border-white/20 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 ems-gradient-bg text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
      >
        Search
      </button>
    </form>
  );
}
