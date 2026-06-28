import Link from "next/link";
import type { CityHubCard, CityHubMeta } from "@/lib/city-content";
import Button from "@/components/ui/Button";

interface Props {
  cards: CityHubCard[];
  config: CityHubMeta;
  hubSlug: string;
  /** Fallback neighbourhood slugs when HTML parsing returns 0 cards */
  fallbackSlugs?: string[];
}

export function CityHubSection({ cards, config, hubSlug, fallbackSlugs = [] }: Props) {
  const displayCards = cards.length > 0 ? cards : fallbackSlugs.map((slug) => ({
    name: slug
      .replace(/-marketing$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    image: null,
    wpSlug: slug,
    localSlug: slug,
  }));

  const available = displayCards.filter((c) => c.localSlug !== null);
  const unavailable = displayCards.filter((c) => c.localSlug === null);

  return (
    <>
      {/* ── Summary strip ────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600 font-medium">
                <span className="font-bold text-slate-900">{available.length}</span> neighbourhoods with dedicated marketing pages
                {unavailable.length > 0 && (
                  <span className="text-slate-400 ml-1">
                    · {unavailable.length} coming soon
                  </span>
                )}
              </p>
              {config.locationSlug && (
                <Link
                  href={`/locations/${config.locationSlug}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Full {config.emirate} marketing guide →
                </Link>
              )}
            </div>
            <Button variant="accent" size="sm" href="/request-for-a-proposal">
              Get a Free Strategy Session
            </Button>
          </div>
        </div>
      </div>

      {/* ── Card grid ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {displayCards.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg font-medium mb-2">Neighbourhood pages coming soon</p>
            <p className="text-sm">
              In the meantime, explore our{" "}
              {config.locationSlug ? (
                <Link href={`/locations/${config.locationSlug}`} className="text-blue-600 hover:text-blue-800">
                  {config.emirate} marketing guide
                </Link>
              ) : (
                <Link href="/services" className="text-blue-600 hover:text-blue-800">services</Link>
              )}.
            </p>
          </div>
        ) : (
          <>
            {/* Available neighbourhood cards */}
            {available.length > 0 && (
              <>
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] ems-gradient-text mb-1">
                    All Neighbourhoods
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {config.emirate} Marketing by Area
                  </h2>
                  <p className="text-slate-500 mt-1.5 text-sm max-w-2xl">
                    Each area page covers local SEO, Google Ads, and social media strategies 
                    built for {config.emirate}&apos;s neighbourhood-level search behaviour and business density.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                  {available.map((card) => (
                    <CityCard key={card.name} card={card} emirate={config.emirate} />
                  ))}
                </div>
              </>
            )}

            {/* Unavailable / coming-soon cards */}
            {unavailable.length > 0 && (
              <>
                <div className="mb-5 pt-6 border-t border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1">
                    Coming Soon
                  </p>
                  <h3 className="text-base font-semibold text-slate-700">
                    More {config.emirate} Area Pages
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {unavailable.map((card) => (
                    <div
                      key={card.name}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 opacity-60"
                    >
                      <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                      <span className="text-xs font-medium text-slate-500 leading-tight">{card.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Why neighbourhood marketing ─────────────────────────────────── */}
      <div className="bg-blue-950 py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
                Why it matters
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                Neighbourhood-Level Marketing Outperforms Generic Campaigns
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Consumers in {config.emirate} search with local intent. When someone in{" "}
                {config.emirate} searches for a service, they often include the neighbourhood 
                name. Businesses that rank for these terms and run geo-targeted ads capture 
                buyers at the highest point of intent — at a fraction of the cost of national 
                campaigns.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "3.5x", label: "Higher conversion rate vs generic UAE campaigns" },
                { stat: "60%", label: "Lower cost-per-lead with neighbourhood geo-targeting" },
                { stat: "85%", label: "Of consumers prefer local businesses in search results" },
                { stat: "Top 3", label: "Google ranks local businesses for area-specific searches" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-2xl font-bold ems-gradient-text mb-1">{item.stat}</p>
                  <p className="text-xs text-slate-400 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Individual card ───────────────────────────────────────────────────────────

function CityCard({ card, emirate }: { card: CityHubCard; emirate: string }) {
  const inner = (
    <>
      {/* Thumbnail */}
      <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-slate-100 shrink-0">
        {card.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center">
            <span className="text-3xl font-bold text-white/20 select-none">
              {card.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1 text-sm leading-snug">
          {card.name}
        </h3>
        <p className="text-xs text-slate-400 mb-3">Digital Marketing · {emirate}</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
          View services
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </>
  );

  return (
    <Link
      href={`/${card.localSlug}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
    >
      {inner}
    </Link>
  );
}
