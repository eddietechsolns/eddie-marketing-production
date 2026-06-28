"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface JobCard {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  description: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  jobs: JobCard[];
}

export function JobsHubSection({ jobs }: Props) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [employmentType, setEmploymentType] = useState("All");
  const [location, setLocation] = useState("All");

  // Derive filter options from actual data
  const departments = useMemo(() => unique(jobs.map((j) => j.department)), [jobs]);
  const employmentTypes = useMemo(() => unique(jobs.map((j) => j.employmentType)), [jobs]);
  const locations = useMemo(() => unique(jobs.map((j) => j.location)), [jobs]);

  // Filtered result
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (q && !j.title.toLowerCase().includes(q) && !j.department.toLowerCase().includes(q) && !(j.description ?? "").toLowerCase().includes(q)) return false;
      if (department !== "All" && j.department !== department) return false;
      if (employmentType !== "All" && j.employmentType !== employmentType) return false;
      if (location !== "All" && j.location !== location) return false;
      return true;
    });
  }, [jobs, search, department, employmentType, location]);

  const hasFilters = search !== "" || department !== "All" || employmentType !== "All" || location !== "All";

  function clearFilters() {
    setSearch("");
    setDepartment("All");
    setEmploymentType("All");
    setLocation("All");
  }

  return (
    <>
      {/* ── Filter bar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search positions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>

            {/* Department */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer min-w-[150px]"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Employment Type */}
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer min-w-[160px]"
            >
              <option value="All">All Employment Types</option>
              {employmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Location */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer min-w-[150px]"
            >
              <option value="All">All Locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Active result count */}
          {jobs.length > 0 && (
            <p className="text-xs text-slate-400 mt-2.5">
              {filtered.length} {filtered.length === 1 ? "position" : "positions"}
              {hasFilters && ` matching your filters`}
              {!hasFilters && ` open`}
            </p>
          )}
        </div>
      </div>

      {/* ── Card grid ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {jobs.length === 0 ? (
          /* No jobs in DB at all */
          <NoJobsState type="none" onClear={clearFilters} />
        ) : filtered.length === 0 ? (
          /* Jobs exist but nothing matches filters */
          <NoJobsState type="filtered" onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Job card ────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: JobCard }) {
  return (
    <div className="group flex flex-col bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full mb-2">
            {job.department}
          </span>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
            {job.title}
          </h3>
        </div>
        <span className="shrink-0 mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          Hiring
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
        <MetaBadge icon="📍" text={job.location} />
        <MetaBadge icon="💼" text={job.employmentType} />
        <MetaBadge icon="🎓" text={job.experienceLevel} />
      </div>

      {/* Description */}
      {job.description && (
        <p className="text-xs text-slate-500 leading-relaxed mb-5 flex-1 line-clamp-3">
          {job.description}
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[11px] text-slate-400 font-medium">{job.employmentType}</div>
        <Link
          href={`/careers/jobs/${job.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors group/link"
        >
          View Position
          <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function MetaBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

function NoJobsState({ type, onClear }: { type: "none" | "filtered"; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5 text-2xl">
        {type === "none" ? "📋" : "🔍"}
      </div>
      {type === "none" ? (
        <>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No open positions right now</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
            We hire on a rolling basis. Submit a general application and we will reach out when a suitable role opens.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/careers#apply"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit General Application
            </Link>
            <Link
              href="/internships"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              View Internship Positions
            </Link>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No positions match your filters</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
            Try broadening your search or removing a filter. You can also submit a general application and we will match you to roles as they open.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClear}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
            <Link
              href="/careers#apply"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Submit General Application
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
