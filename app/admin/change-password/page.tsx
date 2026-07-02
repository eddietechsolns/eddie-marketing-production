"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(false);
  const [success, setSuccess]                 = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const strength = (() => {
    if (newPassword.length === 0) return 0;
    let s = 0;
    if (newPassword.length >= 8)  s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][strength];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin"), 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #060819 0%, #0c0a27 50%, #0a1628 100%)",
      padding: "24px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", transform: "translate(-50%,-50%)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
      </div>

      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: "48px 40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Lock icon */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
            border: "1px solid rgba(99,102,241,0.3)",
            marginBottom: 20,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(165,180,252,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
            Password Change Required
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 14, color: "rgba(148,163,184,0.8)", lineHeight: 1.6 }}>
            For security, you must set a new password<br />before accessing the dashboard.
          </p>
        </div>

        {/* Info banner */}
        <div style={{
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 28,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(165,180,252,0.85)", lineHeight: 1.5 }}>
            You are signed in with a temporary bootstrap password. Choose a strong, unique password to secure your account.
          </p>
        </div>

        {success ? (
          <div style={{
            textAlign: "center",
            padding: "24px 0",
            color: "#4ade80",
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Password updated!</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(74,222,128,0.7)" }}>Redirecting to dashboard…</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* New Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(203,213,225,0.8)", marginBottom: 8 }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    color: "#f1f5f9",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.6)", padding: 4 }}
                >
                  {showNew
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>

              {/* Strength meter */}
              {newPassword.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map((i) => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(203,213,225,0.8)", marginBottom: 8 }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${confirmPassword && confirmPassword !== newPassword ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 10,
                    color: "#f1f5f9",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = confirmPassword && confirmPassword !== newPassword ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.6)", padding: 4 }}
                >
                  {showConfirm
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#f87171" }}>Passwords do not match</p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "12px 14px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 13, color: "#f87171" }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              style={{
                width: "100%",
                padding: "14px",
                background: loading || !newPassword || !confirmPassword
                  ? "rgba(99,102,241,0.3)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || !newPassword || !confirmPassword ? "not-allowed" : "pointer",
                letterSpacing: "0.3px",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: "spin 0.8s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Updating password…
                </>
              ) : "Set New Password"}
            </button>

            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              input::placeholder { color: rgba(148,163,184,0.4); }
            `}</style>
          </form>
        )}

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "rgba(100,116,139,0.6)" }}>
          🔒 Eddie Marketing Solutions — Admin Portal
        </p>
      </div>
    </div>
  );
}
