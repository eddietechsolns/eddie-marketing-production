"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Locations", href: "/locations" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Free Tools", href: "/tools" },
  { label: "Marketing Academy", href: "/academy" },
  { label: "About Us", href: "/about" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen(!open)}
        className="lg:hidden flex flex-col items-center justify-center w-9 h-9 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors gap-[5px]"
      >
        <span
          className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-200 ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-200 ${
            open ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-200 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id="mobile-nav-menu"
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div
            className="absolute top-[73px] left-0 right-0 bg-white border-b border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="max-w-7xl mx-auto px-4 pt-2 pb-4" aria-label="Mobile navigation">
              <div className="flex flex-col">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center justify-between py-3 px-3 rounded-lg text-sm font-medium border-b border-slate-100 last:border-0 transition-colors ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/request-for-a-proposal"
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white ems-btn-gradient rounded-lg"
              >
                Get a Free Strategy Session
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
