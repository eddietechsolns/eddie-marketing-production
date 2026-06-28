import Link from "next/link";
import Image from "next/image";
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import { getSiteSettings } from "@/lib/settings";

export default async function Header() {
  const settings = await getSiteSettings();
  const logoUrl = settings.headerLogoUrl ?? "/brand/ems-logo.svg";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center shrink-0" aria-label="Eddie Marketing Solutions — Home">
            <Image
              src={logoUrl}
              alt="Eddie Marketing Solutions FZE"
              width={210}
              height={44}
              className="h-9 w-auto"
              priority
              unoptimized
            />
          </Link>

          <NavLinks />

          <div className="flex items-center gap-3">
            <Link
              href="/request-for-a-proposal"
              className="hidden lg:inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white ems-btn-gradient rounded-lg"
            >
              Get a Free Strategy Session
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
