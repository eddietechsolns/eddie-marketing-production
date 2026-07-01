"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/lib/userRoles";

interface Activity {
  id: number;
  action: string;
  detail: string | null;
  ip: string | null;
  createdAt: string;
}

interface UserData {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  activities?: Activity[];
}

interface UserFormProps {
  user?: UserData;
}

const ACTION_LABELS: Record<string, string> = {
  account_created:    "Account Created",
  account_updated:    "Account Updated",
  password_reset:     "Password Reset",
  login:              "Logged In",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const isEdit = !!user;

  const [name,     setName]     = useState(user?.name ?? "");
  const [email,    setEmail]    = useState(user?.email ?? "");
  const [role,     setRole]     = useState(user?.role ?? "editor");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [password, setPassword] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Email is required"); return; }
    if (!isEdit && !password) { setError("Password is required for new users"); return; }
    if (password && password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setSaving(true);

    const body: Record<string, unknown> = { name: name.trim() || null, email: email.trim(), role, isActive };
    if (password) body.password = password;

    const url    = isEdit ? `/api/admin/users/${user!.id}` : "/api/admin/users";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({})) as { error?: string };
      setError(d.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* Main form */}
      <div className="xl:col-span-2 space-y-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {ROLES.filter((r) => r.value !== "admin").map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <div className="flex gap-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password {isEdit ? <span className="text-gray-400 font-normal">(leave blank to keep current)</span> : <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? "Enter new password to change…" : "Min. 8 characters"}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="px-5 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar — user info + activity log */}
      <div className="space-y-5">
        {isEdit && user && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">User ID</dt>
                <dd className="text-gray-900 font-mono">#{user.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Last Login</dt>
                <dd className="text-gray-900">{user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">{new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Role permissions guide */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Role Permissions</h3>
          <ul className="space-y-2">
            {[
              { role: "Super Admin",       desc: "Full access — users, content, settings" },
              { role: "Marketing Manager", desc: "Content, services, blog, SEO" },
              { role: "Sales",             desc: "Leads, CRM, chat sessions" },
              { role: "Editor",            desc: "Blog posts, pages, portfolio" },
              { role: "HR",                desc: "Jobs, applications, recruitment" },
            ].map(({ role: r, desc }) => (
              <li key={r} className="text-xs">
                <span className="font-semibold text-gray-800">{r}</span>
                <span className="text-gray-400"> — </span>
                <span className="text-gray-500">{desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Log */}
        {isEdit && user?.activities && user.activities.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Activity Log</h3>
            <ul className="space-y-3">
              {user.activities.map((a) => (
                <li key={a.id} className="text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-gray-800">
                      {ACTION_LABELS[a.action] ?? a.action}
                    </span>
                    <span className="text-gray-400 shrink-0">{timeAgo(a.createdAt)}</span>
                  </div>
                  {a.detail && <p className="text-gray-500 mt-0.5">{a.detail}</p>}
                  {a.ip    && <p className="text-gray-400 mt-0.5 font-mono">IP: {a.ip}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
