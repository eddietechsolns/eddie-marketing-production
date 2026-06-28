import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/settings";

const FOOTER_LINKS = {
  Services: {
    viewAll: "/services",
    links: [
      { label: "SEO", href: "/services/seo" },
      { label: "Google Ads", href: "/services/google-ads" },
      { label: "Social Media", href: "/services/social-media" },
      { label: "Web Design", href: "/services/web-design" },
      { label: "Content Marketing", href: "/services/content-marketing" },
      { label: "Email Marketing", href: "/services/email-marketing" },
    ],
  },
  Company: {
    viewAll: null,
    links: [
      { label: "About Us", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/request-for-a-proposal" },
      { label: "Get a Quote", href: "/request-for-a-proposal" },
    ],
  },
  Industries: {
    viewAll: "/industries",
    links: [
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Legal", href: "/industries/legal" },
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "E-Commerce", href: "/industries/ecommerce" },
      { label: "Finance", href: "/industries/finance" },
      { label: "Home Services", href: "/industries/home-services" },
    ],
  },
  Locations: {
    viewAll: "/locations",
    links: [
      { label: "Dubai", href: "/locations/dubai" },
      { label: "Abu Dhabi", href: "/locations/abu-dhabi" },
      { label: "Sharjah", href: "/locations/sharjah" },
      { label: "Ajman", href: "/ajman-cities-marketing" },
      { label: "UAE (Nationwide)", href: "/locations/uae" },
      { label: "GCC Region", href: "/locations/gcc" },
    ],
  },
  "Free Tools": {
    viewAll: "/tools",
    links: [
      { label: "SEO ROI Calculator", href: "/tools/seo-roi-calculator" },
      { label: "Google Ads Budget", href: "/tools/google-ads-budget-calculator" },
      { label: "UTM Builder", href: "/tools/utm-builder" },
      { label: "Meta Title Generator", href: "/tools/meta-title-generator" },
      { label: "Schema Generator", href: "/tools/schema-generator" },
      { label: "Website Cost Calculator", href: "/tools/website-cost-calculator" },
    ],
  },
  Academy: {
    viewAll: "/academy",
    links: [
      { label: "SEO Guides", href: "/academy/seo-guides" },
      { label: "Google Ads Guides", href: "/academy/google-ads-guides" },
      { label: "Social Media Guides", href: "/academy/social-media-guides" },
      { label: "Analytics Guides", href: "/academy/analytics-guides" },
      { label: "Local SEO Guides", href: "/academy/local-seo-guides" },
      { label: "Content Marketing", href: "/academy/content-marketing-guides" },
    ],
  },
};

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/eddie-marketing-solutions",
    Icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/eddietechsolns",
    Icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/eddietechsolns",
    Icon: FacebookIcon,
  },
];

export default async function Footer() {
  const settings = await getSiteSettings();
  const footerLogoUrl = settings.footerLogoUrl ?? "/brand/ems-logo-white.svg";

  return (
    <footer className="bg-slate-900" aria-label="Site footer">
      <div className="ems-gradient-divider" aria-hidden="true" />
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-base font-semibold text-white mb-1">
                Ready to grow your business?
              </p>
              <p className="text-sm text-slate-400">
                Get a free strategy session with our senior team — no sales pitch, just answers.
              </p>
            </div>
            <Link
              href="/request-for-a-proposal"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white ems-btn-gradient rounded-lg"
            >
              Get a Free Strategy Session
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 mb-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center mb-5" aria-label="Eddie Marketing Solutions — Home">
                <Image
                  src={footerLogoUrl}
                  alt="Eddie Marketing Solutions FZE"
                  width={210}
                  height={44}
                  className="h-9 w-auto"
                  unoptimized
                />
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Full-service digital marketing agency. Measurable results for ambitious businesses across UAE, GCC & Europe.
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-start gap-2.5 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Dubai, United Arab Emirates</span>
                </div>
                <a
                  href="mailto:info@eddietechsolns.com"
                  className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors group"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@eddietechsolns.com</span>
                </a>
              </div>

              <div className="flex items-center gap-2.5 mb-6">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${label}`}
                    className="footer-social-icon w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span>Accepting new clients</span>
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([section, { viewAll, links }]) => (
              <div key={section}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 mb-5">
                  {section}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {viewAll && (
                    <li className="pt-1">
                      <Link
                        href={viewAll}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        View all
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Eddie Marketing Solutions FZE. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap.xml" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
