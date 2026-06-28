"use client";

import { useEffect, useState } from "react";
import type { AcademySection } from "@/lib/academy-data";

interface TableOfContentsProps {
  sections: AcademySection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile collapsible */}
      <div className="lg:hidden mb-6 border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-700 bg-slate-50"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
            </svg>
            Table of Contents
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <nav className="px-5 py-4 space-y-1 border-t border-slate-100">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left flex items-start gap-3 py-2 px-3 rounded-lg text-sm transition-colors ${
                  activeId === s.id
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${activeId === s.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</span>
                <span className="leading-snug">{s.title}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop sticky */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3 px-1">
            In This Guide
          </p>
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`w-full text-left flex items-start gap-3 py-2.5 px-3 rounded-xl text-sm transition-all ${
                activeId === s.id
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 transition-colors ${activeId === s.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>{i + 1}</span>
              <span className="leading-snug">{s.title}</span>
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 px-1">
              <span className="font-medium text-slate-500">{sections.length} sections</span> in this guide
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
