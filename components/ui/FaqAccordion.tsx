"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
}

export function FaqAccordion({
  items,
  eyebrow = "FAQ",
  title = "Frequently Asked Questions",
}: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <div className="bg-white border-t border-slate-100 py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
            {eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        <div className="space-y-2">
          {items.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-colors ${
                  isOpen
                    ? "border-blue-200 bg-blue-50/40"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? "border-blue-500 bg-blue-500 text-white rotate-45"
                        : "border-slate-300 text-slate-400"
                    }`}
                  >
                    <svg
                      className="w-2.5 h-2.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="h-px bg-blue-100 mb-4" />
                    <p className="text-sm text-slate-600 leading-[1.8]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
