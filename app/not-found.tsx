import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Page Not Found — 404",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Locations", href: "/locations" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Portfolio", href: "/portfolio" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-white">
          <div className="text-center max-w-lg">
            {/* 404 number */}
            <div className="mb-6">
              <span className="text-[7rem] font-black leading-none text-slate-100 select-none block">
                404
              </span>
            </div>

            {/* Message */}
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-500 mb-3">
              Page Not Found
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              This page doesn&apos;t exist
            </h1>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              The page you&apos;re looking for may have been moved, renamed, or removed.
              Try one of the links below or head back to the homepage.
            </p>

            {/* Primary action */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors mb-8 shadow-sm"
            >
              Back to Homepage
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M13 6l6 6-6 6" />
              </svg>
            </Link>

            {/* Quick navigation */}
            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-4">
                Or explore
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <p className="mt-8 text-sm text-slate-500">
              Looking to grow your business?{" "}
              <Link
                href="/request-for-a-proposal"
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Get a free strategy session →
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
