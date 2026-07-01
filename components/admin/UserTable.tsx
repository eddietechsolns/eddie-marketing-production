"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoleLabel, getRoleColor } from "@/lib/userRoles";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  q: string;
  role: string;
  status: string;
  currentUserId: number;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "Just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30)  return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return email[0].toUpperCase();
}

function AvatarCircle({ name, email, role }: { name: string | null; email: string; role: string }) {
  const colors: Record<string, string> = {
    super_admin:       "bg-purple-600",
    admin:             "bg-gray-600",
    marketing_manager: "bg-blue-600",
    sales:             "bg-green-600",
    editor:            "bg-yellow-500",
    hr:                "bg-pink-500",
  };
  const bg = colors[role] ?? "bg-slate-500";
  return (
    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials(name, email)}
    </div>
  );
}

function ResetPasswordModal({
  userId,
  userName,
  onClose,
}: {
  userId: number;
  userName: string;
  onClose: () => void;
}) {
  const [pw, setPw]       = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const router = useRouter();

  async function handleReset() {
    setError("");
    if (pw.length < 8) { setError("Password must be at least 8 characters"); return; }
    setSaving(true);
    const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: pw }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({})) as { error?: string };
      setError(d.error ?? "Failed to reset password");
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Reset Password</h3>
        <p className="text-sm text-gray-500 mb-4">Set a new password for <strong>{userName}</strong></p>

        <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserTable({
  users: initialUsers,
  total,
  page,
  pageSize,
  q,
  role,
  status,
  currentUserId,
}: UserTableProps) {
  const router = useRouter();
  const [users, setUsers]           = useState(initialUsers);
  const [loadingId, setLoadingId]   = useState<number | null>(null);
  const [resetTarget, setResetTarget] = useState<User | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  function buildUrl(params: Record<string, string>) {
    const sp = new URLSearchParams();
    if (q)       sp.set("q",      q);
    if (role)    sp.set("role",   role);
    if (status)  sp.set("status", status);
    sp.set("page", String(page));
    for (const [k, v] of Object.entries(params)) {
      if (v) sp.set(k, v); else sp.delete(k);
    }
    return `/admin/users?${sp.toString()}`;
  }

  const toggleStatus = useCallback(async (user: User) => {
    if (user.id === currentUserId) {
      alert("You cannot deactivate your own account.");
      return;
    }
    setLoadingId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    setLoadingId(null);
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } else {
      const d = await res.json().catch(() => ({})) as { error?: string };
      alert(d.error ?? "Failed to update status");
    }
  }, [currentUserId]);

  const deleteUser = useCallback(async (user: User) => {
    if (user.id === currentUserId) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Delete "${user.name ?? user.email}"? This action cannot be undone.`)) return;
    setLoadingId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    setLoadingId(null);
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({})) as { error?: string };
      alert(d.error ?? "Failed to delete user");
    }
  }, [currentUserId, router]);

  return (
    <>
      {resetTarget && (
        <ResetPasswordModal
          userId={resetTarget.id}
          userName={resetTarget.name ?? resetTarget.email}
          onClose={() => setResetTarget(null)}
        />
      )}

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Login</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${loadingId === user.id ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AvatarCircle name={user.name} email={user.email} role={user.role} />
                      <div>
                        <p className="font-medium text-gray-900">{user.name ?? "—"}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(user)}
                      disabled={loadingId === user.id}
                      title={user.isActive ? "Click to deactivate" : "Click to activate"}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                        user.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{timeAgo(user.lastLoginAt)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setResetTarget(user)}
                        className="text-xs font-medium text-gray-600 hover:text-amber-600 transition-colors"
                      >
                        Reset PW
                      </button>
                      {user.id !== currentUserId && (
                        <button
                          onClick={() => deleteUser(user)}
                          disabled={loadingId === user.id}
                          className="text-xs font-medium text-gray-600 hover:text-red-600 transition-colors disabled:opacity-40"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500">
            Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total} users
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildUrl({ page: String(p) })}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
