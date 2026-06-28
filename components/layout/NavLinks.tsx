"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Locations", href: "/locations" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Academy", href: "/academy" },
  { label: "About", href: "/about" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-0 mx-4 xl:mx-8" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative px-2.5 xl:px-3.5 py-2 text-sm rounded-md transition-all duration-150 font-medium ${
              isActive
                ? "text-blue-700 bg-blue-50/80"
                : "text-slate-700 hover:text-blue-700 hover:bg-blue-50/60"
            }`}
          >
            {item.label}
            {isActive && (
              <span className="absolute bottom-0.5 left-2.5 right-2.5 xl:left-3.5 xl:right-3.5 h-0.5 ems-gradient-bg rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
