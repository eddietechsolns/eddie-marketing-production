"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setShake(false);

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        const raw = (data.error ?? "Login failed") as string;
        const msg =
          raw.toLowerCase().includes("server") ||
          raw.toLowerCase().includes("unavailable")
            ? "The authentication service is temporarily unavailable. Please try again in a moment."
            : raw.toLowerCase().includes("invalid") ||
              raw.toLowerCase().includes("password") ||
              raw.toLowerCase().includes("email")
            ? "Unable to sign in. Please verify your email and password."
            : raw;
        setError(msg);
        setShake(true);
        setTimeout(() => setShake(false), 650);
      }
    } catch {
      setError(
        "Network connection failed. Please check your connection and try again."
      );
      setShake(true);
      setTimeout(() => setShake(false), 650);
    } finally {
      setLoading(false);
    }
  }

  const emailActive = emailFocused || email.length > 0;
  const passwordActive = passwordFocused || password.length > 0;

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        body{margin:0;padding:0}

        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-25px) scale(1.07)}66%{transform:translate(-25px,38px) scale(0.94)}}
        @keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-50px,35px) scale(0.88)}75%{transform:translate(35px,-45px) scale(1.12)}}
        @keyframes orb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,50px) scale(1.1)}}

        @keyframes card-enter{from{opacity:0;transform:translateY(28px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes left-enter{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}

        @keyframes shake{
          0%,100%{transform:translateX(0)}
          12%{transform:translateX(-10px)}
          24%{transform:translateX(10px)}
          36%{transform:translateX(-7px)}
          48%{transform:translateX(7px)}
          60%{transform:translateX(-4px)}
          72%{transform:translateX(4px)}
        }

        @keyframes spin{to{transform:rotate(360deg)}}

        @keyframes ping{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.7);opacity:0}}

        @keyframes flow{to{stroke-dashoffset:-24}}

        @keyframes node-pulse{0%,100%{opacity:0.7}50%{opacity:1}}

        .em-card-enter{animation:card-enter 0.72s cubic-bezier(0.16,1,0.3,1) both}
        .em-left-enter{animation:left-enter 0.72s cubic-bezier(0.16,1,0.3,1) both}
        .em-shake{animation:shake 0.65s ease-in-out}

        .em-input{
          display:block;
          width:100%;
          background:rgba(10,14,30,0.7);
          border:1.5px solid rgba(99,102,241,0.18);
          border-radius:14px;
          padding:22px 16px 9px 48px;
          font-size:0.9375rem;
          color:#f1f5f9;
          outline:none;
          transition:border-color 0.2s ease,box-shadow 0.2s ease,background 0.2s ease;
          font-family:inherit;
          -webkit-appearance:none;
        }
        .em-input:focus{
          border-color:rgba(99,102,241,0.65);
          box-shadow:0 0 0 3px rgba(99,102,241,0.13),inset 0 1px 0 rgba(255,255,255,0.04);
          background:rgba(10,14,30,0.85);
        }
        .em-input:-webkit-autofill,
        .em-input:-webkit-autofill:focus{
          -webkit-box-shadow:0 0 0 100px rgba(10,14,30,0.95) inset !important;
          -webkit-text-fill-color:#f1f5f9 !important;
          caret-color:#f1f5f9;
        }
        .em-input-pr{padding-right:48px}

        .em-label{
          position:absolute;
          left:48px;
          top:50%;
          transform:translateY(-50%);
          font-size:0.875rem;
          color:rgba(148,163,184,0.65);
          pointer-events:none;
          transition:top 0.18s ease,transform 0.18s ease,font-size 0.18s ease,color 0.18s ease;
          z-index:2;
          white-space:nowrap;
        }
        .em-label-active{
          top:11px;
          transform:translateY(0);
          font-size:0.68rem;
          color:rgba(99,102,241,0.85);
          letter-spacing:0.04em;
          font-weight:500;
        }

        .em-icon{
          position:absolute;
          left:15px;
          top:50%;
          transform:translateY(-50%);
          color:rgba(100,116,139,0.6);
          pointer-events:none;
          transition:color 0.2s;
          display:flex;
          align-items:center;
        }
        .em-icon-active{color:rgba(99,102,241,0.85)}

        .em-btn{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          width:100%;
          padding:15px 20px;
          border-radius:14px;
          font-size:0.9375rem;
          font-weight:600;
          letter-spacing:0.015em;
          color:white;
          border:none;
          cursor:pointer;
          background:linear-gradient(135deg,#4338ca 0%,#5b21b6 40%,#4f46e5 100%);
          background-size:200% 100%;
          transition:all 0.28s ease;
          position:relative;
          overflow:hidden;
          font-family:inherit;
        }
        .em-btn::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 60%);
          opacity:0;
          transition:opacity 0.28s;
        }
        .em-btn:hover:not(:disabled){
          transform:translateY(-2px);
          box-shadow:0 10px 35px rgba(79,70,229,0.55);
          background-position:right center;
        }
        .em-btn:hover::after{opacity:1}
        .em-btn:active:not(:disabled){transform:translateY(0)}
        .em-btn:disabled{opacity:0.65;cursor:not-allowed}

        .em-spinner{
          width:17px;height:17px;
          border:2px solid rgba(255,255,255,0.28);
          border-top-color:white;
          border-radius:50%;
          animation:spin 0.65s linear infinite;
          flex-shrink:0;
        }

        .em-check{
          width:18px;height:18px;
          border:1.5px solid rgba(99,102,241,0.35);
          border-radius:5px;
          background:rgba(10,14,30,0.7);
          appearance:none;
          -webkit-appearance:none;
          cursor:pointer;
          transition:all 0.18s;
          flex-shrink:0;
          position:relative;
        }
        .em-check:checked{background:#4f46e5;border-color:#4f46e5}
        .em-check:checked::after{
          content:'';
          position:absolute;
          left:3px;top:1px;
          width:9px;height:6px;
          border-left:2px solid white;
          border-bottom:2px solid white;
          transform:rotate(-45deg);
        }
        .em-check:focus-visible{outline:2px solid rgba(99,102,241,0.7);outline-offset:2px}

        .em-eye-btn{
          position:absolute;
          right:13px;top:50%;
          transform:translateY(-50%);
          background:none;border:none;
          cursor:pointer;
          color:rgba(100,116,139,0.6);
          padding:4px;
          display:flex;align-items:center;justify-content:center;
          border-radius:6px;
          transition:color 0.2s;
          font-family:inherit;
        }
        .em-eye-btn:hover{color:rgba(99,102,241,0.9)}
        .em-eye-btn:focus-visible{outline:2px solid rgba(99,102,241,0.6);outline-offset:2px}

        .em-forgot{
          background:none;border:none;
          cursor:pointer;
          font-size:0.8125rem;
          color:rgba(99,102,241,0.75);
          padding:0;
          transition:color 0.2s;
          font-family:inherit;
          text-decoration:none;
        }
        .em-forgot:hover{color:rgba(139,92,246,1)}
        .em-forgot:focus-visible{outline:2px solid rgba(99,102,241,0.6);outline-offset:2px;border-radius:3px}

        .em-feature{
          display:flex;
          align-items:center;
          gap:10px;
          padding:5px 0;
          transition:transform 0.2s ease;
        }
        .em-feature:hover{transform:translateX(5px)}

        .em-grid{
          background-image:
            linear-gradient(rgba(99,102,241,0.045) 1px,transparent 1px),
            linear-gradient(90deg,rgba(99,102,241,0.045) 1px,transparent 1px);
          background-size:44px 44px;
        }

        @media(max-width:1023px){
          .em-left-panel{display:none!important}
          .em-mobile-logo{display:flex!important}
        }
        @media(min-width:1024px){
          .em-left-panel{display:flex!important}
          .em-mobile-logo{display:none!important}
          .em-card-logo{display:flex!important}
        }
        .em-card-logo{display:none}
        .em-mobile-logo{display:none}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          background: "#060819",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient orbs */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(79,70,229,0.22) 0%,transparent 70%)",
              top: -220,
              left: -150,
              animation: "orb1 14s ease-in-out infinite",
              filter: "blur(48px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 560,
              height: 560,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%)",
              bottom: -120,
              right: "18%",
              animation: "orb2 17s ease-in-out infinite",
              filter: "blur(56px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)",
              top: "38%",
              left: "28%",
              animation: "orb3 20s ease-in-out infinite",
              filter: "blur(64px)",
            }}
          />
        </div>

        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div
          className="em-left-panel"
          style={{
            width: "44%",
            minHeight: "100vh",
            background:
              "linear-gradient(150deg,#040613 0%,#0c0a27 35%,#10092a 60%,#080f1f 100%)",
            position: "relative",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 52px",
            overflow: "hidden",
            borderRight: "1px solid rgba(99,102,241,0.09)",
            zIndex: 1,
          }}
        >
          <div
            className="em-grid"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, opacity: 0.55 }}
          />

          {/* Brand */}
          <div
            style={{ position: "relative", zIndex: 1 }}
            className={mounted ? "em-left-enter" : ""}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(79,70,229,0.45)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <polygon
                    points="10,2 18,6.5 18,13.5 10,18 2,13.5 2,6.5"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="10" cy="10" r="3" fill="white" />
                </svg>
              </div>
              <span
                style={{
                  color: "rgba(241,245,249,0.88)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                }}
              >
                Eddie Marketing Solutions
              </span>
            </div>
          </div>

          {/* Centre: illustration + copy */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingBlock: "36px",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.7s ease 0.1s",
            }}
          >
            {/* SVG illustration */}
            <div
              style={{ marginBottom: 36, lineHeight: 0 }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 400 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", maxWidth: 380 }}
                role="img"
                aria-label="Platform illustration"
              >
                {/* Outer orbit ring */}
                <ellipse
                  cx="200"
                  cy="140"
                  rx="155"
                  ry="82"
                  stroke="rgba(99,102,241,0.12)"
                  strokeWidth="1"
                  strokeDasharray="5 7"
                />
                {/* Inner orbit ring */}
                <ellipse
                  cx="200"
                  cy="140"
                  rx="110"
                  ry="58"
                  stroke="rgba(139,92,246,0.1)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />

                {/* AI core glow */}
                <circle cx="200" cy="140" r="38" fill="rgba(79,70,229,0.12)" />
                <circle
                  cx="200"
                  cy="140"
                  r="28"
                  fill="rgba(79,70,229,0.2)"
                  stroke="rgba(99,102,241,0.45)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="200"
                  cy="140"
                  r="18"
                  fill="rgba(79,70,229,0.35)"
                  stroke="rgba(139,92,246,0.55)"
                  strokeWidth="1"
                />
                <circle cx="200" cy="140" r="9" fill="rgba(139,92,246,0.9)" />
                <text
                  x="200"
                  y="144"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="white"
                  letterSpacing="0.05em"
                >
                  AI
                </text>

                {/* Pulsing ring */}
                <circle
                  cx="200"
                  cy="140"
                  r="28"
                  fill="none"
                  stroke="rgba(99,102,241,0.25)"
                  strokeWidth="1"
                >
                  <animate
                    attributeName="r"
                    values="30;52;30"
                    dur="3.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="3.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Orbiting satellite nodes */}
                {[
                  {
                    angle: 0,
                    label: "SEO",
                    color: "rgba(16,185,129",
                    dur: "22s",
                  },
                  {
                    angle: 72,
                    label: "CRM",
                    color: "rgba(245,158,11",
                    dur: "22s",
                  },
                  {
                    angle: 144,
                    label: "DATA",
                    color: "rgba(239,68,68",
                    dur: "22s",
                  },
                  {
                    angle: 216,
                    label: "WEB",
                    color: "rgba(59,130,246",
                    dur: "22s",
                  },
                  {
                    angle: 288,
                    label: "AUTO",
                    color: "rgba(168,85,247",
                    dur: "22s",
                  },
                ].map(({ angle, label, color, dur }) => (
                  <g key={label}>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`${angle} 200 140`}
                      to={`${angle + 360} 200 140`}
                      dur={dur}
                      repeatCount="indefinite"
                    />
                    <circle
                      cx="355"
                      cy="140"
                      r="19"
                      fill={`${color},0.12)`}
                      stroke={`${color},0.45)`}
                      strokeWidth="1"
                    />
                    <text
                      x="355"
                      y="144"
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="600"
                      fill={`${color},0.9)`}
                    >
                      {label}
                    </text>
                  </g>
                ))}

                {/* Data flow lines */}
                {[
                  { x1: 48, y1: 44, x2: 177, y2: 127, color: "99,102,241", dur: "2s" },
                  { x1: 48, y1: 236, x2: 177, y2: 153, color: "139,92,246", dur: "2.6s" },
                  { x1: 340, y1: 42, x2: 223, y2: 127, color: "59,130,246", dur: "1.9s" },
                ].map(({ x1, y1, x2, y2, color, dur }, i) => (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={`rgba(${color},0.22)`}
                    strokeWidth="1"
                    strokeDasharray="5 5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-20"
                      dur={dur}
                      repeatCount="indefinite"
                    />
                  </line>
                ))}

                {/* Corner anchor nodes */}
                {[
                  { cx: 48, cy: 44, color: "rgba(99,102,241", dur: "3s" },
                  { cx: 48, cy: 236, color: "rgba(139,92,246", dur: "3.8s" },
                  { cx: 340, cy: 42, color: "rgba(59,130,246", dur: "2.7s" },
                ].map(({ cx, cy, color, dur }, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill={`${color},0.35)`}
                    stroke={`${color},0.65)`}
                    strokeWidth="1"
                  >
                    <animate
                      attributeName="r"
                      values="5;8;5"
                      dur={dur}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}

                {/* Mini bar chart (bottom-left) */}
                <g transform="translate(18, 168)">
                  {[
                    { h: 16, y: 28 },
                    { h: 24, y: 20 },
                    { h: 36, y: 8 },
                    { h: 20, y: 24 },
                    { h: 30, y: 14 },
                  ].map(({ h, y }, i) => (
                    <rect
                      key={i}
                      x={i * 11}
                      y={y}
                      width="8"
                      height={h}
                      fill={`rgba(99,102,241,${0.35 + i * 0.07})`}
                      rx="2"
                    />
                  ))}
                </g>

                {/* Trend line (top-right) */}
                <polyline
                  points="260,46 275,34 292,41 308,22 325,28 340,18"
                  stroke="rgba(16,185,129,0.55)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="340" cy="18" r="3.5" fill="rgba(16,185,129,0.85)" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.65rem,2.2vw,2.1rem)",
                fontWeight: 800,
                color: "#f8fafc",
                letterSpacing: "-0.03em",
                lineHeight: 1.18,
                marginBottom: 12,
              }}
            >
              Welcome Back
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(148,163,184,0.8)",
                lineHeight: 1.7,
                maxWidth: 330,
                marginBottom: 30,
              }}
            >
              Manage your websites, CRM, AI, SEO, publishing and marketing
              operations from one intelligent platform.
            </p>

            {/* Feature list */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
              role="list"
            >
              {[
                { label: "CRM & Sales Pipeline", color: "#f59e0b" },
                { label: "AI Content Studio", color: "#8b5cf6" },
                { label: "Website Manager", color: "#3b82f6" },
                { label: "Publishing Centre", color: "#06b6d4" },
                { label: "SEO Intelligence", color: "#10b981" },
                { label: "Analytics Dashboard", color: "#f97316" },
                { label: "AI Concierge", color: "#a78bfa" },
              ].map(({ label, color }) => (
                <div
                  key={label}
                  className="em-feature"
                  role="listitem"
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: `${color}1a`,
                      border: `1px solid ${color}38`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 5.5l2.5 2.5 4.5-4.5"
                        stroke={color}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: "0.83rem",
                      color: "rgba(203,213,225,0.82)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderTop: "1px solid rgba(99,102,241,0.1)",
              paddingTop: 18,
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.7s ease 0.15s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(100,116,139,0.75)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Platform v2.0
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: "0.7rem",
                    color: "rgba(16,185,129,0.8)",
                    letterSpacing: "0.04em",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "inline-block",
                      boxShadow: "0 0 6px rgba(16,185,129,0.7)",
                    }}
                  />
                  SSL Secured
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "rgba(100,116,139,0.55)",
                }}
              >
                © Eddie Marketing Solutions
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 488,
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.1s",
            }}
            className={mounted ? "em-card-enter" : ""}
          >
            {/* Mobile-only brand header */}
            <div
              className="em-mobile-logo"
              style={{
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 24px rgba(79,70,229,0.45)",
                  marginBottom: 12,
                }}
              >
                <svg width="26" height="26" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <polygon
                    points="10,2 18,6.5 18,13.5 10,18 2,13.5 2,6.5"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="10" cy="10" r="3" fill="white" />
                </svg>
              </div>
              <div
                style={{
                  color: "#f1f5f9",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Eddie Marketing
              </div>
              <div
                style={{
                  color: "rgba(148,163,184,0.65)",
                  fontSize: "0.8rem",
                  marginTop: 3,
                }}
              >
                Administration Portal
              </div>
            </div>

            {/* Glass card */}
            <div
              className={shake ? "em-shake" : ""}
              style={{
                background: "rgba(10,14,32,0.78)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(99,102,241,0.16)",
                borderRadius: 24,
                padding: "38px 36px 36px",
                boxShadow:
                  "0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.035), inset 0 1px 0 rgba(255,255,255,0.055)",
              }}
            >
              {/* Desktop logo row inside card */}
              <div
                className="em-card-logo"
                style={{
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <polygon
                      points="10,2 18,6.5 18,13.5 10,18 2,13.5 2,6.5"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle cx="10" cy="10" r="3" fill="white" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      color: "#f1f5f9",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Eddie Marketing
                  </div>
                  <div
                    style={{
                      color: "rgba(148,163,184,0.55)",
                      fontSize: "0.7rem",
                      marginTop: 1,
                    }}
                  >
                    Administration Portal
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div style={{ marginBottom: 26 }}>
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#f8fafc",
                    letterSpacing: "-0.025em",
                    margin: 0,
                    marginBottom: 6,
                  }}
                >
                  Sign in
                </h1>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(148,163,184,0.7)",
                    margin: 0,
                  }}
                >
                  Enter your credentials to access the dashboard
                </p>
              </div>

              {/* Error alert */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  style={{
                    background: "rgba(239,68,68,0.09)",
                    border: "1px solid rgba(239,68,68,0.28)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 1 }}
                    aria-hidden="true"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="rgba(239,68,68,0.75)"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M8 5v3.5M8 10.5v.7"
                      stroke="rgba(239,68,68,0.75)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(252,165,165,0.95)",
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
                noValidate
              >
                {/* Email */}
                <div style={{ position: "relative" }}>
                  <div
                    className={`em-icon ${emailActive ? "em-icon-active" : ""}`}
                    aria-hidden="true"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="1.5"
                        y="3.5"
                        width="13"
                        height="9"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M1.5 6l6.5 3.5L14.5 6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <label
                    htmlFor="email"
                    className={`em-label ${emailActive ? "em-label-active" : ""}`}
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                    autoComplete="email"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    aria-label="Email address"
                    aria-required="true"
                    className="em-input"
                  />
                </div>

                {/* Password */}
                <div style={{ position: "relative" }}>
                  <div
                    className={`em-icon ${passwordActive ? "em-icon-active" : ""}`}
                    aria-hidden="true"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="3"
                        y="7"
                        width="10"
                        height="7.5"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M5 7V5a3 3 0 016 0v2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <circle cx="8" cy="10.5" r="1.2" fill="currentColor" />
                    </svg>
                  </div>
                  <label
                    htmlFor="password"
                    className={`em-label ${passwordActive ? "em-label-active" : ""}`}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onKeyDown={(e) =>
                      setCapsLock(e.getModifierState("CapsLock"))
                    }
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                    aria-required="true"
                    aria-describedby={capsLock ? "caps-warning" : undefined}
                    className="em-input em-input-pr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="em-eye-btn"
                  >
                    {showPassword ? (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 8.5S4.5 4 8.5 4s6.5 4.5 6.5 4.5S12.5 13 8.5 13 2 8.5 2 8.5z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle
                          cx="8.5"
                          cy="8.5"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <line
                          x1="3"
                          y1="3"
                          x2="14"
                          y2="14"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 8.5S4.5 4 8.5 4s6.5 4.5 6.5 4.5S12.5 13 8.5 13 2 8.5 2 8.5z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle
                          cx="8.5"
                          cy="8.5"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Caps Lock warning */}
                {capsLock && (
                  <div
                    id="caps-warning"
                    role="status"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.75rem",
                      color: "rgba(245,158,11,0.9)",
                      padding: "7px 11px",
                      background: "rgba(245,158,11,0.07)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: 9,
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6.5 1.5L12 11H1L6.5 1.5z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.5 5.5v2.5M6.5 9.5v.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Caps Lock is on
                  </div>
                )}

                {/* Remember me + Forgot password */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="em-check"
                      aria-label="Remember me for 7 days"
                      defaultChecked={false}
                    />
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "rgba(148,163,184,0.7)",
                      }}
                    >
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="em-forgot"
                    aria-label="Forgot your password?"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="em-btn"
                  aria-label="Sign in to your account"
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span className="em-spinner" aria-hidden="true" />
                      Authenticating…
                    </>
                  ) : (
                    "Sign in to Dashboard"
                  )}
                </button>
              </form>

              {/* Security badge */}
              <div
                style={{
                  marginTop: 22,
                  padding: "11px 14px",
                  background: "rgba(16,185,129,0.055)",
                  border: "1px solid rgba(16,185,129,0.14)",
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
                aria-label="Secure login indicator"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 1.5L14 4v5C14 12 11.5 14.5 8 14.5 4.5 14.5 2 12 2 9V4L8 1.5z"
                    stroke="rgba(16,185,129,0.75)"
                    strokeWidth="1.3"
                    fill="rgba(16,185,129,0.08)"
                  />
                  <path
                    d="M5.5 8l2 2 3-3"
                    stroke="rgba(16,185,129,0.8)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(16,185,129,0.88)",
                      fontWeight: 600,
                    }}
                  >
                    🔒 Secure Login
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(100,116,139,0.65)",
                      marginLeft: 7,
                    }}
                  >
                    Protected by encrypted authentication
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
