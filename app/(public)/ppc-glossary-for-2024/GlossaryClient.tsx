"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { GlossaryGroup, GlossaryTerm } from "./glossary-data";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function TermFaqToggle({ faq }: { faq: NonNullable<GlossaryTerm["faq"]> }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
      {faq.map((f, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full text-left flex items-start justify-between gap-3 py-1.5 group"
            aria-expanded={openIdx === i}
          >
            <span className="text-xs font-semibold text-slate-700 leading-snug group-hover:text-blue-700 transition-colors">
              {f.q}
            </span>
            <span
              className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all text-[10px] font-bold ${
                openIdx === i
                  ? "border-blue-500 bg-blue-500 text-white rotate-45"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              +
            </span>
          </button>
          {openIdx === i && (
            <p className="text-xs text-slate-500 leading-relaxed pb-2 pr-7">
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TermCard({ item, isSearching }: { item: GlossaryTerm; isSearching: boolean }) {
  const id = slugify(item.term);
  return (
    <div
      id={`term-${id}`}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all scroll-mt-32"
    >
      <dt className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
        {item.term}
      </dt>
      <dd className="text-sm text-slate-600 leading-relaxed mb-0">
        {item.definition}
      </dd>

      {/* Related Terms */}
      {item.relatedTerms && item.relatedTerms.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            See also:
          </span>
          {item.relatedTerms.map((rt) => (
            isSearching ? (
              <span
                key={rt}
                className="text-xs bg-slate-100 text-slate-500 rounded-full px-2.5 py-0.5"
              >
                {rt}
              </span>
            ) : (
              <a
                key={rt}
                href={`#term-${slugify(rt)}`}
                className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-full px-2.5 py-0.5 transition-colors"
              >
                {rt}
              </a>
            )
          ))}
        </div>
      )}

      {/* Links row */}
      {(item.relatedService || item.relatedBlog || item.relatedResource || (item.internalLinks && item.internalLinks.length > 0)) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {item.relatedService && (
            <Link
              href={item.relatedService.href}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span aria-hidden="true">→</span>
              {item.relatedService.label}
            </Link>
          )}
          {item.relatedBlog && (
            <Link
              href={item.relatedBlog.href}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 transition-colors"
            >
              <span aria-hidden="true">→</span>
              {item.relatedBlog.label}
            </Link>
          )}
          {item.relatedResource && (
            <Link
              href={item.relatedResource.href}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
            >
              <span aria-hidden="true">→</span>
              {item.relatedResource.label}
            </Link>
          )}
          {item.internalLinks?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <span aria-hidden="true">↗</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Inline FAQ */}
      {item.faq && item.faq.length > 0 && (
        <TermFaqToggle faq={item.faq} />
      )}
    </div>
  );
}

function InlineCta() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 my-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
      <div>
        <p className="font-bold text-white text-sm mb-1">
          Ready to put this into practice?
        </p>
        <p className="text-blue-100 text-xs leading-relaxed max-w-md">
          Our certified Google Ads team manages campaigns that deliver measurable ROI for UAE businesses — strategy, setup, and ongoing optimisation included.
        </p>
      </div>
      <a
        href="/request-for-a-proposal"
        className="shrink-0 bg-white text-blue-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
      >
        Get a Free PPC Audit
      </a>
    </div>
  );
}

interface Props {
  glossary: GlossaryGroup[];
  totalTerms: number;
}

export function GlossaryClient({ glossary, totalTerms }: Props) {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeLetters = glossary.map((g) => g.letter);
  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length >= 2;

  // Flatten all terms for search
  const allTerms = glossary.flatMap((g) => g.terms);

  const searchResults = isSearching
    ? allTerms.filter(
        (t) =>
          t.term.toLowerCase().includes(normalizedQuery) ||
          t.definition.toLowerCase().includes(normalizedQuery) ||
          t.relatedTerms?.some((rt) => rt.toLowerCase().includes(normalizedQuery))
      )
    : [];

  // IntersectionObserver for active letter highlight
  useEffect(() => {
    if (isSearching) {
      observerRef.current?.disconnect();
      return;
    }
    const sections = activeLetters
      .map((l) => document.getElementById(`letter-${l}`))
      .filter(Boolean) as HTMLElement[];

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLetter(entry.target.id.replace("letter-", ""));
          }
        });
      },
      { threshold: 0.1, rootMargin: "-80px 0px -55% 0px" }
    );
    sections.forEach((s) => observerRef.current?.observe(s));
    return () => observerRef.current?.disconnect();
  }, [isSearching, activeLetters.join("")]);

  return (
    <>
      {/* ── Sticky search + alphabet bar ─────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        {/* Search row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                placeholder={`Search ${totalTerms}+ PPC terms...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white placeholder-slate-400 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {isSearching ? (
              <p className="text-xs text-slate-500 shrink-0">
                {searchResults.length > 0
                  ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`
                  : "No results"}
              </p>
            ) : (
              <p className="text-xs text-slate-400 shrink-0 hidden sm:block">
                {totalTerms} terms · {activeLetters.length} sections
              </p>
            )}
          </div>
        </div>

        {/* Alphabet nav row */}
        {!isSearching && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
            <div className="flex items-center gap-0.5 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-2 shrink-0">
                Jump to:
              </span>
              {activeLetters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors shrink-0 ${
                    activeLetter === letter
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_276px] gap-10 lg:gap-14">

          {/* ── Main column ── */}
          <div>
            {isSearching ? (
              /* Search results */
              <div>
                <p className="text-sm text-slate-500 mb-6">
                  {searchResults.length > 0
                    ? `Showing ${searchResults.length} term${searchResults.length !== 1 ? "s" : ""} matching "${query}"`
                    : `No PPC terms match "${query}" — try a shorter or different search.`}
                </p>
                <dl className="space-y-4">
                  {searchResults.map((item) => (
                    <TermCard key={item.term} item={item} isSearching={true} />
                  ))}
                </dl>
              </div>
            ) : (
              /* Letter groups */
              glossary.map((group, groupIdx) => (
                <div key={group.letter}>
                  <section
                    id={`letter-${group.letter}`}
                    className="mb-10 scroll-mt-28"
                  >
                    {/* Letter header */}
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-blue-600">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-lg font-bold text-white leading-none">
                          {group.letter}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400 font-medium">
                        {group.terms.length} term
                        {group.terms.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Term cards */}
                    <dl className="space-y-4">
                      {group.terms.map((item) => (
                        <TermCard key={item.term} item={item} isSearching={false} />
                      ))}
                    </dl>
                  </section>

                  {/* Lead CTA every 4 sections */}
                  {(groupIdx + 1) % 4 === 0 && <InlineCta />}
                </div>
              ))
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-5 lg:sticky lg:top-28 self-start">
            {/* PPC Audit CTA */}
            <div className="ems-gradient-bg rounded-xl p-5 text-white shadow-lg">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-1.5">
                Run PPC Campaigns That Perform
              </h3>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                Certified Google Ads team. Transparent reporting. Results-driven
                management for UAE &amp; GCC businesses.
              </p>
              <Button variant="white" size="sm" href="/request-for-a-proposal" fullWidth>
                Get a Free PPC Audit
              </Button>
            </div>

            {/* Related Resources */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
                Related Resources
              </h3>
              <ul className="space-y-2">
                {[
                  { href: "/google-adwords-management", label: "Google Ads Management" },
                  { href: "/advertise-on-bing-with-bing-ads", label: "Microsoft Ads (Bing)" },
                  { href: "/paid-social-media-advertising", label: "Paid Social Advertising" },
                  { href: "/google-ads-training-2", label: "Google Ads Training Course" },
                  { href: "/bing-ads-training", label: "Bing Ads Training Course" },
                  { href: "/digital-marketing-training-dubai", label: "All Training Courses" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 group-hover:bg-blue-600 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* PPC Quick Stats */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
                PPC Quick Stats
              </h3>
              <ul className="space-y-3">
                {[
                  { stat: "2×", desc: "avg. ROI from Google Ads vs organic" },
                  { stat: "65%", desc: "of high-intent clicks go to paid ads" },
                  { stat: "200%", desc: "average ROI for search advertisers" },
                  { stat: "AED 2", desc: "average revenue per AED 1 Google Ads spend" },
                ].map((item) => (
                  <li key={item.stat} className="flex gap-3 items-start">
                    <span className="text-lg font-bold text-blue-600 leading-tight shrink-0">
                      {item.stat}
                    </span>
                    <span className="text-xs text-slate-600 leading-snug">
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Training CTA */}
            <div className="bg-white rounded-xl border border-blue-100 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
                Learn PPC Hands-On
              </p>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Google Ads Training — Dubai
              </p>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                2-day intensive. In-person, live online, or corporate group. Certificate included.
              </p>
              <Link
                href="/google-ads-training-2"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View Training Course →
              </Link>
            </div>

            {/* Trust */}
            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <p className="text-sm font-semibold mb-1">Need a PPC Expert?</p>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Eddie Marketing manages Google Ads for businesses across UAE and GCC — certified, transparent, results-driven.
              </p>
              <Link
                href="/request-for-a-proposal"
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
              >
                Talk to a specialist →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
