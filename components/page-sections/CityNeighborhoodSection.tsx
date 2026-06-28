import Link from "next/link";
import type { CityHubMeta } from "@/lib/city-content";

interface Props {
  title: string;
  hubSlug: string;
  hubConfig: CityHubMeta;
}

export function CityNeighborhoodSection({ title, hubSlug, hubConfig }: Props) {
  // Strip the trailing " Marketing" from the page title to get the area name
  const area = title.replace(/\s+marketing\s*$/i, "").trim();
  const emirate = hubConfig.emirate;

  return (
    <div className="space-y-10">
      {/* ── Area Overview ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          Digital Marketing for {area} Businesses
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          {area} businesses compete in one of {emirate}&apos;s most connected and
          commercially active areas. A location-specific digital marketing
          strategy — built around {area}&apos;s search patterns, local intent, and
          community channels — consistently outperforms generic UAE-wide
          campaigns in both lead quality and cost-per-acquisition.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Eddie Marketing Solutions builds and manages neighbourhood-level
          campaigns across SEO, Google Ads, Google Business Profile
          optimisation, and social media — designed to put your business in
          front of {area}&apos;s most valuable prospects at the moment they are
          ready to buy.
        </p>
      </section>

      {/* ── Why local matters ───────────────────────────────────────────── */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-bold text-slate-900 mb-4">
          Why {area}-Specific Marketing Wins
        </h3>
        <ul className="space-y-3">
          {[
            `Local customers search with neighbourhood intent — "${area}" appears explicitly in high-converting search queries`,
            "Google Business Profile and local SEO deliver the highest-converting, lowest-cost leads for {area} businesses",
            `Geo-targeted Google Ads focused on {area} reduce wasted spend and lift conversion rates versus broad UAE targeting`,
            `Social media ads targeting {area} residents build community trust, brand recognition, and repeat business`,
            "Competitors without a local SEO strategy are invisible to buyers searching for services in your area",
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <svg
                className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-slate-700 leading-relaxed">
                {point.replace(/\{area\}/g, area)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── What we deliver ─────────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-slate-900 mb-4">What You Get</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: "search", title: "Local SEO", desc: `Rank on Google for "${area} + [your service]" searches` },
            { icon: "ads", title: "Google Ads", desc: `Geo-targeted campaigns converting ${area} searchers` },
            { icon: "map", title: "Google Business", desc: "Profile optimisation for local pack visibility" },
            { icon: "social", title: "Social Media", desc: `Community-building and ads reaching ${area} residents` },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-4 bg-white border border-slate-200 rounded-xl">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {item.icon === "search" && <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                  {item.icon === "ads" && <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />}
                  {item.icon === "map" && <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                  {item.icon === "social" && <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />}
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-0.5">{item.title}</p>
                <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Navigation links ────────────────────────────────────────────── */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/${hubSlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All {emirate} neighbourhoods
        </Link>
        {hubConfig.locationSlug && (
          <Link
            href={`/locations/${hubConfig.locationSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {emirate} digital marketing guide →
          </Link>
        )}
      </div>
    </div>
  );
}
