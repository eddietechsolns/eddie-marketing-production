"use client";

import { useActionState, useState } from "react";
import { handleWpImport, type ImportState, type PreviewRecord } from "@/lib/actions/wp-import";

const SLUG_SOURCE_STYLES: Record<string, string> = {
  "wp:post_name": "bg-green-100 text-green-700",
  legacyUrl:      "bg-blue-100 text-blue-700",
  title:          "bg-orange-100 text-orange-700",
};
const SLUG_SOURCE_LABELS: Record<string, string> = {
  "wp:post_name": "post_name",
  legacyUrl:      "URL",
  title:          "title",
};

function SlugSourceBadge({ source }: { source: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${SLUG_SOURCE_STYLES[source] ?? "bg-gray-100 text-gray-600"}`}>
      {SLUG_SOURCE_LABELS[source] ?? source}
    </span>
  );
}

const TYPE_LABELS: Record<string, string> = {
  post: "Post",
  page: "Page",
  portfolio: "Portfolio",
};

const TYPE_COLORS: Record<string, string> = {
  post: "bg-blue-100 text-blue-700",
  page: "bg-purple-100 text-purple-700",
  portfolio: "bg-orange-100 text-orange-700",
};

const STATUS_COLORS: Record<string, string> = {
  publish: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  private: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function WpImporter() {
  const [state, action, pending] = useActionState<ImportState, FormData>(
    handleWpImport,
    { step: "idle" }
  );

  if (state.step === "done") return <DoneView state={state} action={action} />;
  if (state.step === "preview") return <PreviewView state={state} action={action} pending={pending} />;
  return <UploadView action={action} pending={pending} error={state.error} />;
}

// ── Step 1: Upload ────────────────────────────────────────────────────────────

function UploadView({
  action,
  pending,
  error,
}: {
  action: (p: FormData) => void;
  pending: boolean;
  error?: string | null;
}) {
  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Upload WordPress Export</h2>
        <p className="text-sm text-gray-500 mb-5">
          Export your WordPress site via <strong>Tools → Export → All content</strong>, then upload
          the <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.xml</code> file below.
          Only pages, posts, portfolio items, and categories are imported. Attachments, comments, and
          users are ignored.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={action}>
          <input type="hidden" name="step" value="parse" />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors mb-4">
            <svg className="mx-auto mb-3 w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm text-gray-600 mb-2">Select WordPress XML export file</p>
            <input
              type="file"
              name="xmlFile"
              accept=".xml,application/xml,text/xml"
              required
              className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-2 text-xs text-gray-400">Maximum 50 MB</p>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {pending ? "Parsing XML…" : "Parse & Preview"}
          </button>
        </form>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
        <strong>What gets imported:</strong> pages, posts (with categories), and portfolio items.
        SEO titles, meta descriptions, and canonical URLs from Rank Math (and Yoast as fallback) are preserved.
        Featured image URLs are stored but media files are not downloaded.
      </div>
    </div>
  );
}

// ── Step 2: Preview & select ──────────────────────────────────────────────────

function PreviewView({
  state,
  action,
  pending,
}: {
  state: Extract<ImportState, { step: "preview" }>;
  action: (p: FormData) => void;
  pending: boolean;
}) {
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(state.records.map((r) => r.wpId))
  );
  const [filter, setFilter] = useState<string>("all");
  const [updateExisting, setUpdateExisting] = useState<boolean>(false);

  const filtered = filter === "all" ? state.records : state.records.filter((r) => r.type === filter);

  function toggleAll() {
    if (filtered.every((r) => selected.has(r.wpId))) {
      setSelected((s) => { const n = new Set(s); filtered.forEach((r) => n.delete(r.wpId)); return n; });
    } else {
      setSelected((s) => { const n = new Set(s); filtered.forEach((r) => n.add(r.wpId)); return n; });
    }
  }

  function toggle(wpId: number) {
    setSelected((s) => { const n = new Set(s); n.has(wpId) ? n.delete(wpId) : n.add(wpId); return n; });
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.wpId));
  const types = ["all", ...Array.from(new Set(state.records.map((r) => r.type)))];

  const counts = {
    post: state.records.filter((r) => r.type === "post").length,
    page: state.records.filter((r) => r.type === "page").length,
    portfolio: state.records.filter((r) => r.type === "portfolio").length,
  };

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        {(["post", "page", "portfolio"] as const).map((t) =>
          counts[t] > 0 ? (
            <div key={t} className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[t]}`}>
                {TYPE_LABELS[t]}
              </span>
              <span className="text-sm font-semibold text-gray-900">{counts[t]}</span>
            </div>
          ) : null
        )}
        {state.totalCategories > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
              Category
            </span>
            <span className="text-sm font-semibold text-gray-900">{state.totalCategories}</span>
          </div>
        )}
      </div>

      {state.error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filter === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t === "all" ? `All (${state.records.length})` : `${TYPE_LABELS[t] ?? t} (${counts[t as keyof typeof counts] ?? 0})`}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {selected.size} of {state.records.length} selected
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 text-xs">Type</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 text-xs">Title</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 text-xs">Slug</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 text-xs">Slug Source</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 text-xs">Status</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 text-xs">Legacy URL</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 text-xs">SEO Title</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((record) => (
                <RecordRow
                  key={record.wpId}
                  record={record}
                  selected={selected.has(record.wpId)}
                  onToggle={() => toggle(record.wpId)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Import actions */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center gap-3">
          <ImportForm
            action={action}
            pending={pending}
            previewId={state.previewId}
            selectedIds={Array.from(selected)}
            importAll={false}
            updateExisting={updateExisting}
            label={`Import Selected (${selected.size})`}
            disabled={selected.size === 0}
          />
          <ImportForm
            action={action}
            pending={pending}
            previewId={state.previewId}
            selectedIds={[]}
            importAll={true}
            updateExisting={updateExisting}
            label={`Import All (${state.records.length})`}
            variant="secondary"
          />
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none ml-1">
            <input
              type="checkbox"
              checked={updateExisting}
              onChange={(e) => setUpdateExisting(e.target.checked)}
              className="rounded border-gray-300"
            />
            Update existing records (SEO fields only)
          </label>
          <form action={action}>
            <input type="hidden" name="step" value="parse" />
            <button type="submit" className="text-xs text-gray-500 hover:text-gray-700 underline">
              Upload different file
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RecordRow({
  record,
  selected,
  onToggle,
}: {
  record: PreviewRecord;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <tr className={`hover:bg-gray-50 ${selected ? "" : "opacity-50"}`}>
      <td className="px-4 py-2.5">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="rounded border-gray-300"
        />
      </td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[record.type] ?? "bg-gray-100 text-gray-600"}`}>
          {TYPE_LABELS[record.type] ?? record.type}
        </span>
      </td>
      <td className="px-3 py-2.5 font-medium text-gray-900 max-w-[200px] truncate" title={record.title}>
        {record.title}
      </td>
      <td className="px-3 py-2.5 font-mono text-xs text-gray-500 max-w-[150px] truncate" title={record.slug}>
        {record.slug || "—"}
      </td>
      <td className="px-3 py-2.5">
        <SlugSourceBadge source={record.slugSource} />
      </td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[record.status] ?? "bg-gray-100 text-gray-600"}`}>
          {record.status}
        </span>
      </td>
      <td className="px-3 py-2.5 text-xs text-gray-400 max-w-[150px] truncate" title={record.legacyUrl}>
        {record.legacyUrl || "—"}
      </td>
      <td className="px-3 py-2.5 text-xs text-gray-500 max-w-[150px] truncate" title={record.seoTitle ?? ""}>
        {record.seoTitle || "—"}
      </td>
    </tr>
  );
}

function ImportForm({
  action,
  pending,
  previewId,
  selectedIds,
  importAll,
  updateExisting,
  label,
  variant = "primary",
  disabled = false,
}: {
  action: (p: FormData) => void;
  pending: boolean;
  previewId: string;
  selectedIds: number[];
  importAll: boolean;
  updateExisting: boolean;
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="step" value="import" />
      <input type="hidden" name="previewId" value={previewId} />
      <input type="hidden" name="importAll" value={String(importAll)} />
      <input type="hidden" name="updateExisting" value={String(updateExisting)} />
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="selectedId" value={id} />
      ))}
      <button
        type="submit"
        disabled={pending || disabled}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {pending ? "Importing…" : label}
      </button>
    </form>
  );
}

// ── Step 3: Done ──────────────────────────────────────────────────────────────

function DoneView({
  state,
  action,
}: {
  state: Extract<ImportState, { step: "done" }>;
  action: (p: FormData) => void;
}) {
  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Import Complete</h2>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          <Stat label="Imported" value={state.imported} color="text-green-600" />
          <Stat label="Updated" value={state.updated} color="text-blue-600" />
          <Stat label="Skipped" value={state.skipped} color="text-yellow-600" />
          <Stat label="Failed" value={state.failed.length} color="text-red-600" />
        </div>

        {state.failed.length > 0 && (
          <div className="mb-5 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-xs font-semibold text-red-700 mb-2">Errors:</p>
            <ul className="text-xs text-red-600 space-y-1">
              {state.failed.map((msg, i) => (
                <li key={i} className="truncate" title={msg}>• {msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <a href="/admin/migration/queue?type=posts" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            View Import Queue
          </a>
          <form action={action}>
            <input type="hidden" name="step" value="parse" />
            <button type="submit" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Import Another File
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
