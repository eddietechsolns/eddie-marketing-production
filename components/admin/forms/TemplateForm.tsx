"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string | null;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TemplateFormProps {
  template?: Template;
}

const CATEGORIES = ["general", "follow_up", "proposal", "introduction"];

export default function TemplateForm({ template }: TemplateFormProps) {
  const router = useRouter();
  const isEdit = !!template;

  const [name,     setName]     = useState(template?.name ?? "");
  const [subject,  setSubject]  = useState(template?.subject ?? "");
  const [body,     setBody]     = useState(template?.body ?? "");
  const [category, setCategory] = useState(template?.category ?? "");
  const [isActive, setIsActive] = useState(template?.isActive ?? true);
  const [preview,  setPreview]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");

  async function handleSave() {
    setError("");
    if (!name.trim())    { setError("Name is required"); return; }
    if (!subject.trim()) { setError("Subject is required"); return; }

    setSaving(true);
    const url    = isEdit ? `/api/admin/email-templates/${template!.id}` : "/api/admin/email-templates";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subject, body, category: category || undefined, isActive }),
    });
    setSaving(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({})) as { error?: string };
      setError(d.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/communications/templates");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete template "${template?.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/email-templates/${template!.id}`, { method: "DELETE" });
    setDeleting(false);
    router.push("/admin/communications/templates");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Template Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Proposal Follow-up"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">— none —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject Line <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your email subject…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">Body (HTML supported)</label>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
            {preview ? (
              <div
                className="border border-gray-200 rounded-lg p-4 min-h-64 prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: body || "<p class='text-gray-300 italic'>Nothing to preview.</p>" }}
              />
            ) : (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                placeholder="Write your template body here…&#10;&#10;You can use plain text or HTML tags.&#10;&#10;Common variables: {{name}}, {{company}}, {{service}}"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono leading-relaxed"
              />
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Template"}
            </button>
            <button
              onClick={() => router.push("/admin/communications/templates")}
              className="px-5 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="ml-auto px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Visibility</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="isActive" checked={isActive} onChange={() => setIsActive(true)} className="accent-blue-600" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="isActive" checked={!isActive} onChange={() => setIsActive(false)} className="accent-blue-600" />
              <span className="text-sm text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Variable Guide</h3>
          <ul className="space-y-1.5 text-xs">
            {["{{name}}", "{{company}}", "{{service}}", "{{email}}", "{{phone}}"].map((v) => (
              <li key={v} className="font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">{v}</li>
            ))}
          </ul>
          <p className="text-[10px] text-gray-400 mt-3">Variables are replaced when composing from a lead profile.</p>
        </div>

        {isEdit && template && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Stats</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Times used</dt>
                <dd className="font-semibold text-gray-900">{template.usageCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">{new Date(template.createdAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Last updated</dt>
                <dd className="text-gray-700">{new Date(template.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
