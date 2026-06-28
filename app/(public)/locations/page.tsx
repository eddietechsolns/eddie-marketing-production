import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "Digital Marketing Across the UAE",
  description:
    "Eddie Marketing Solutions serves businesses across Dubai, Abu Dhabi, Sharjah, and the wider UAE with location-specific digital marketing strategies.",
  path: "/locations",
});

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    where: { status: "published" },
    orderBy: [{ state: "asc" }, { city: "asc" }],
    select: { id: true, slug: true, title: true, city: true, state: true, excerpt: true },
  });

  const byState = new Map<string, typeof locations>();
  for (const loc of locations) {
    const state = loc.state ?? "UAE";
    if (!byState.has(state)) byState.set(state, []);
    byState.get(state)!.push(loc);
  }

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema(),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/locations#page`,
            name: `Service Locations | ${SITE_NAME}`,
            url: `${SITE_URL}/locations`,
            description: "Digital marketing services across the UAE.",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Locations</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Local Expertise · UAE
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            Digital Marketing Across the UAE
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            We serve businesses across Dubai, Abu Dhabi, Sharjah, and the wider UAE — with location-specific digital marketing strategies built for each emirate&apos;s unique market conditions.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">
            Get a Local Marketing Strategy
          </Button>
        </div>
      </div>

      {/* ── UAE Coverage Strip ────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"].map((emirate) => (
              <div key={emirate} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-300 whitespace-nowrap">{emirate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Locations ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {locations.length === 0 ? (
          <p className="text-slate-500">No locations listed yet.</p>
        ) : byState.size > 1 ? (
          <div className="space-y-10">
            {[...byState.entries()].sort(([a], [b]) => {
              if (a === "Dubai") return -1;
              if (b === "Dubai") return 1;
              return a.localeCompare(b);
            }).map(([state, locs]) => (
              <div key={state}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4 pb-2 border-b border-slate-200">
                  {state}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {locs.map((location) => (
                    <Link
                      key={location.id}
                      href={`/locations/${location.slug}`}
                      className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {location.title}
                          </h3>
                        </div>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      {location.city && location.state && (
                        <p className="text-sm text-slate-400 mt-0.5 pl-5.5">
                          {location.city}, {location.state}
                        </p>
                      )}
                      {location.excerpt && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{location.excerpt}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/locations/${location.slug}`}
                className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <h2 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {location.title}
                    </h2>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {location.city && location.state && (
                  <p className="text-sm text-slate-400 mt-0.5 pl-5">{location.city}, {location.state}</p>
                )}
                {location.excerpt && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{location.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Serve Anywhere in the UAE</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Don&apos;t see your city?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            We work with businesses across all seven emirates. Contact us for a strategy built for your specific market and location.
          </p>
          <Button variant="accent" size="lg" href="/request-for-a-proposal">Get a Free Consultation</Button>
        </div>
      </div>
    </>
  );
}
