"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// ─── Breadcrumb label map ────────────────────────────────────────────────────

const SEGMENT_LABELS: Record<string, string> = {
  admin:                 "Home",
  leads:                 "Leads",
  posts:                 "Blog Posts",
  pages:                 "Pages",
  portfolio:             "Portfolio",
  "case-studies":        "Case Studies",
  services:              "Services",
  industries:            "Industries",
  locations:             "Locations",
  seo:                   "SEO",
  settings:              "Settings",
  migration:             "Migration",
  redirects:             "Redirects",
  "portfolio-categories":"Portfolio Categories",
  "service-categories":  "Service Categories",
  "site-health":         "Site Health",
  "content-gaps":        "Content Gaps",
  "internal-links":      "Internal Links",
  "technical-seo":       "Technical SEO",
  "launch-audit":        "Launch Audit",
  pillars:               "Pillar Overrides",
  "silo-architecture":   "Silo Architecture",
  "case-study-health":   "Case Study Health",
  tracking:              "Tracking",
  branding:              "Branding",
  stats:                 "Stats",
  dashboard:             "Dashboard",
  "chat-sessions":       "AI Chat Sessions",
  import:                "WordPress Import",
  queue:                 "Import Queue",
  audit:                 "Content Audit",
  "seo-recovery":        "SEO Recovery",
  "content-clusters":    "Content Clusters",
  "cluster-plan":        "Cluster Plan",
  "redirect-plan":       "Redirect Plan",
  new:                   "New",
  edit:                  "Edit",
};

// ─── Quick-create actions ────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: "New Lead",
    href: "/admin/leads/new",
    color: "text-blue-600 bg-blue-50",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
      </svg>
    ),
  },
  {
    label: "New Post",
    href: "/admin/posts/new",
    color: "text-violet-600 bg-violet-50",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
      </svg>
    ),
  },
  {
    label: "New Page",
    href: "/admin/pages/new",
    color: "text-slate-600 bg-slate-100",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: "New Portfolio",
    href: "/admin/portfolio/new",
    color: "text-teal-600 bg-teal-50",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
  },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, handler]);
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);

  type Crumb = { label: string; href: string };
  const crumbs: Crumb[] = [];
  let acc = "";

  for (const seg of segments) {
    acc += `/${seg}`;
    const label = SEGMENT_LABELS[seg];
    if (label) {
      crumbs.push({ label, href: acc });
    } else if (/^\d+$/.test(seg)) {
      crumbs.push({ label: `#${seg}`, href: acc });
    } else {
      crumbs.push({ label: seg, href: acc });
    }
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-xs min-w-0">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && (
              <svg className="w-3 h-3 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            )}
            {isLast ? (
              <span className="font-semibold text-slate-700 truncate max-w-[140px]">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-slate-400 hover:text-slate-600 transition-colors truncate max-w-[100px]">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminHeader() {
  const pathname = usePathname();
  const router   = useRouter();

  const [profileOpen, setProfileOpen]     = useState(false);
  const [actionsOpen, setActionsOpen]     = useState(false);
  const [notifOpen,   setNotifOpen]       = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const profileRef  = useRef<HTMLDivElement>(null);
  const actionsRef  = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);

  useOutsideClick(profileRef,  () => setProfileOpen(false));
  useOutsideClick(actionsRef,  () => setActionsOpen(false));
  useOutsideClick(notifRef,    () => setNotifOpen(false));

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-14 shrink-0 bg-white border-b border-slate-200/80 flex items-center gap-3 px-5 z-30">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <Breadcrumb pathname={pathname} />
        {!pathname || pathname === "/admin" ? (
          <p className="text-xs font-semibold text-slate-700">Dashboard</p>
        ) : null}
      </div>

      {/* ── Search ──────────────────────────────────────────────────────────── */}
      <div className={`hidden md:flex items-center gap-2 h-9 px-3 rounded-xl border transition-all duration-150 bg-slate-50 ${
        searchFocused
          ? "border-blue-400 ring-2 ring-blue-400/20 bg-white w-72"
          : "border-slate-200 w-52 hover:border-slate-300"
      }`}>
        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="search"
          placeholder="Search…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none min-w-0"
        />
        {!searchFocused && (
          <kbd className="hidden lg:inline-block text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-mono shrink-0">
            ⌘K
          </kbd>
        )}
      </div>

      {/* ── Right cluster ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">

        {/* Quick create dropdown */}
        <div ref={actionsRef} className="relative">
          <button
            onClick={() => { setActionsOpen((v) => !v); setProfileOpen(false); setNotifOpen(false); }}
            className={`flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold transition-all ${
              actionsOpen
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
            }`}
            title="Quick create"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">Create</span>
          </button>

          {actionsOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/10 py-2 z-50">
              <p className="px-4 pt-1 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Quick Create
              </p>
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2">
                <Link
                  href="/admin/leads"
                  onClick={() => setActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                  </span>
                  <span className="text-sm font-medium text-slate-700">All Leads</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* View live site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="View live site"
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); setActionsOpen(false); }}
            className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors ${
              notifOpen ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
            title="Notifications"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {/* Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/10 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">3 new</span>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { icon: "👤", title: "New lead received", sub: "Someone submitted the contact form", time: "2m ago", dot: "bg-blue-500" },
                  { icon: "⏰", title: "Follow-up overdue", sub: "3 leads need attention today", time: "1h ago", dot: "bg-red-500" },
                  { icon: "✅", title: "Lead marked Won", sub: "A deal was closed successfully", time: "3h ago", dot: "bg-green-500" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{n.sub}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${n.dot}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                <Link
                  href="/admin/leads"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View all leads →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen((v) => !v); setActionsOpen(false); setNotifOpen(false); }}
            className={`flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-xl transition-colors ${
              profileOpen ? "bg-slate-100" : "hover:bg-slate-100"
            }`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">Admin</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Administrator</p>
            </div>
            <svg className={`w-3 h-3 text-slate-400 transition-transform hidden sm:block ${profileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-56 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/10 py-2 z-50">
              {/* Identity */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  A
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Admin</p>
                  <p className="text-[11px] text-slate-400">Eddie Marketing FZE</p>
                </div>
              </div>

              {/* Menu items */}
              <Link
                href="/admin/settings/branding"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                Settings
              </Link>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                View Live Site
              </Link>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
