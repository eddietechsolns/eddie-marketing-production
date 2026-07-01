"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string | null;
}

interface Attachment {
  filename: string;
  data: string;
  mimeType: string;
  size: number;
}

interface EmailComposerProps {
  templates?: Template[];
  defaultTo?: string;
  defaultToName?: string;
  defaultSubject?: string;
  defaultBody?: string;
  leadId?: number;
  draftId?: number;
  draftFolder?: string;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function EmailComposer({
  templates = [],
  defaultTo = "",
  defaultToName = "",
  defaultSubject = "",
  defaultBody = "",
  leadId,
  draftId,
}: EmailComposerProps) {
  const router = useRouter();

  const [to,      setTo]      = useState(defaultTo);
  const [toName,  setToName]  = useState(defaultToName);
  const [cc,      setCc]      = useState("");
  const [bcc,     setBcc]     = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [body,    setBody]    = useState(defaultBody);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showCc,  setShowCc]  = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  function applyTemplate(id: string) {
    const t = templates.find((t) => String(t.id) === id);
    if (!t) return;
    setSubject(t.subject);
    setBody(t.body);
    setSelectedTemplate(id);
  }

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const MAX_FILE = 5 * 1024 * 1024;
    const MAX_TOTAL = 20 * 1024 * 1024;
    const total = attachments.reduce((s, a) => s + a.size, 0);

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE) {
        setError(`"${file.name}" exceeds the 5 MB per-file limit`);
        continue;
      }
      if (total + file.size > MAX_TOTAL) {
        setError("Total attachments exceed 20 MB");
        break;
      }
      const data = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve((r.result as string).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      setAttachments((prev) => [
        ...prev,
        { filename: file.name, data, mimeType: file.type || "application/octet-stream", size: file.size },
      ]);
    }
  }

  async function submit(send: boolean) {
    setError("");
    setSuccess("");
    if (!to.trim())      { setError("Recipient email is required"); return; }
    if (!subject.trim()) { setError("Subject is required"); return; }

    if (send) setSending(true); else setSaving(true);

    try {
      let url    = "/api/admin/emails";
      let method = "POST";

      if (draftId && !send) {
        url    = `/api/admin/emails/${draftId}`;
        method = "PATCH";
      }

      const payload: Record<string, unknown> = {
        toEmail: to.trim(), toName: toName.trim() || undefined,
        cc: cc.trim() || undefined, bcc: bcc.trim() || undefined,
        subject: subject.trim(), body,
        leadId: leadId ?? undefined,
        send, attachments,
      };

      if (method === "PATCH") {
        delete payload.send;
        delete payload.attachments;
        delete payload.leadId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as { id?: number; error?: string };

      if (!res.ok && res.status !== 207) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      if (res.status === 207 && data.error) {
        setError(`Failed to send: ${data.error}`);
        return;
      }

      if (send) {
        if (draftId) {
          await fetch(`/api/admin/emails/${draftId}/send`, { method: "POST" });
        }
        setSuccess("Email sent successfully!");
        setTimeout(() => router.push("/admin/communications/sent"), 1500);
      } else {
        setSuccess("Draft saved.");
        setTimeout(() => router.push("/admin/communications/drafts"), 1000);
      }
    } finally {
      setSending(false);
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 flex-wrap">
        {templates.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Template:</label>
            <select
              value={selectedTemplate}
              onChange={(e) => applyTemplate(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— select template —</option>
              {templates.map((t) => (
                <option key={t.id} value={String(t.id)}>{t.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              preview ? "bg-slate-800 text-white border-slate-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="divide-y divide-gray-100">
        {/* To */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="text-xs font-semibold text-gray-400 w-12 shrink-0">To</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="flex-1 text-sm focus:outline-none text-gray-800"
          />
          <input
            type="text"
            value={toName}
            onChange={(e) => setToName(e.target.value)}
            placeholder="Display name (optional)"
            className="w-48 text-sm focus:outline-none text-gray-500 border-l border-gray-100 pl-3"
          />
          <div className="flex gap-1 shrink-0">
            {!showCc && (
              <button onClick={() => setShowCc(true)} className="text-xs text-blue-600 hover:text-blue-800 px-1">+Cc</button>
            )}
            {!showBcc && (
              <button onClick={() => setShowBcc(true)} className="text-xs text-blue-600 hover:text-blue-800 px-1">+Bcc</button>
            )}
          </div>
        </div>

        {showCc && (
          <div className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-xs font-semibold text-gray-400 w-12 shrink-0">Cc</span>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@example.com, another@example.com"
              className="flex-1 text-sm focus:outline-none text-gray-800"
            />
            <button onClick={() => { setShowCc(false); setCc(""); }} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>
          </div>
        )}

        {showBcc && (
          <div className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-xs font-semibold text-gray-400 w-12 shrink-0">Bcc</span>
            <input
              type="text"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="bcc@example.com"
              className="flex-1 text-sm focus:outline-none text-gray-800"
            />
            <button onClick={() => { setShowBcc(false); setBcc(""); }} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>
          </div>
        )}

        {/* Subject */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="text-xs font-semibold text-gray-400 w-12 shrink-0">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject…"
            className="flex-1 text-sm font-medium focus:outline-none text-gray-800"
          />
        </div>

        {/* Body */}
        <div className="relative">
          {preview ? (
            <div
              className="p-4 min-h-64 text-sm text-gray-800 prose prose-sm max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: body || "<p class='text-gray-300'>Nothing to preview yet.</p>" }}
            />
          ) : (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here…&#10;&#10;You can use plain text or HTML tags for formatting."
              rows={18}
              className="w-full px-4 py-3 text-sm focus:outline-none resize-none text-gray-800 font-mono leading-relaxed"
            />
          )}
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="px-4 py-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 mb-2">Attachments</p>
            <ul className="flex flex-wrap gap-2">
              {attachments.map((a, i) => (
                <li key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                  <span className="text-gray-700 font-medium">{a.filename}</span>
                  <span className="text-gray-400">{formatBytes(a.size)}</span>
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                    className="text-gray-300 hover:text-red-500 ml-1 transition-colors"
                  >✕</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50 flex-wrap">
        <button
          onClick={() => submit(true)}
          disabled={sending || saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {sending ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          )}
          {sending ? "Sending…" : "Send Email"}
        </button>

        <button
          onClick={() => submit(false)}
          disabled={sending || saving}
          className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
          Attach
        </button>

        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        {error   && <p className="text-red-600 text-xs flex-1">{error}</p>}
        {success && <p className="text-emerald-600 text-xs font-medium flex-1">{success}</p>}
      </div>
    </div>
  );
}
