// ─── City Hub & Neighbourhood metadata ────────────────────────────────────────
// Hub pages aggregate neighbourhood pages for each emirate.
// Neighbourhood pages are individual district/area pages imported from WordPress.

export interface CityHubMeta {
  emirate: string;
  title: string;
  subtitle: string;
  locationSlug: string | null;
}

export const CITY_HUB_CONFIG: Record<string, CityHubMeta> = {
  "dubai-cities-marketing": {
    emirate: "Dubai",
    title: "Digital Marketing in Dubai Areas",
    subtitle:
      "Neighbourhood-specific digital marketing for businesses across Dubai's most dynamic districts and communities.",
    locationSlug: "dubai",
  },
  "abu-dhabi-cities-marketing": {
    emirate: "Abu Dhabi",
    title: "Digital Marketing in Abu Dhabi Areas",
    subtitle:
      "Location-targeted marketing for businesses across Abu Dhabi's growing residential and commercial neighbourhoods.",
    locationSlug: "abu-dhabi",
  },
  "sharjah-cities-marketing": {
    emirate: "Sharjah",
    title: "Digital Marketing in Sharjah Areas",
    subtitle:
      "Neighbourhood-focused digital marketing for Sharjah businesses competing in the UAE's third-largest emirate.",
    locationSlug: "sharjah",
  },
  "ajman-cities-marketing": {
    emirate: "Ajman",
    title: "Digital Marketing in Ajman Areas",
    subtitle:
      "Digital marketing for businesses across Ajman's neighbourhoods and business communities.",
    locationSlug: null,
  },
};

export const CITY_HUB_SLUGS = new Set(Object.keys(CITY_HUB_CONFIG));

// ─── Neighbourhood → Hub mapping ──────────────────────────────────────────────

const NEIGHBORHOOD_HUB_MAP: Record<string, string> = {
  // ── Dubai ──────────────────────────────────────────────────────────────────
  "deira-marketing": "dubai-cities-marketing",
  "dubai-design-district-marketing": "dubai-cities-marketing",
  "dubai-festival-city-marketing": "dubai-cities-marketing",
  "dubai-healthcare-city-marketing": "dubai-cities-marketing",
  "dubai-international-city-marketing": "dubai-cities-marketing",
  "dubai-investment-park-marketing": "dubai-cities-marketing",
  "dubai-investment-park-marketing-10536": "dubai-cities-marketing",
  "dubai-marina-marketing": "dubai-cities-marketing",
  "dubai-production-city-marketing": "dubai-cities-marketing",
  "dubai-silicon-oasis-marketing": "dubai-cities-marketing",
  "dubai-sports-city-marketing": "dubai-cities-marketing",
  "jumeirah-lake-towers-marketing": "dubai-cities-marketing",
  "jumeirah-marketing": "dubai-cities-marketing",
  "jumeirah-village-circle-marketing": "dubai-cities-marketing",
  "palm-jumeirah-marketing": "dubai-cities-marketing",
  "al-basha-marketing": "dubai-cities-marketing",
  "al-garhoud-marketing": "dubai-cities-marketing",
  "al-hazannah-marketing": "dubai-cities-marketing",
  "al-karama-marketing": "dubai-cities-marketing",
  "al-mankhool-marketing": "dubai-cities-marketing",
  "al-nahda-marketing": "dubai-cities-marketing",
  "al-nakheel-marketing": "dubai-cities-marketing",
  "al-quoz-marketing": "dubai-cities-marketing",
  "al-rigga-marketing": "dubai-cities-marketing",
  "al-safa-marketing": "dubai-cities-marketing",
  "al-satwa-marketing": "dubai-cities-marketing",
  // ── Abu Dhabi ──────────────────────────────────────────────────────────────
  "al-bateen-marketing": "abu-dhabi-cities-marketing",
  "al-danah-marketing": "abu-dhabi-cities-marketing",
  "al-falah-marketing": "abu-dhabi-cities-marketing",
  "al-khalidiyah-marketing": "abu-dhabi-cities-marketing",
  "al-maffraq-marketing": "abu-dhabi-cities-marketing",
  "al-manhal-marketing": "abu-dhabi-cities-marketing",
  "al-markaziyah-marketing": "abu-dhabi-cities-marketing",
  "al-maryah-island-marketing": "abu-dhabi-cities-marketing",
  "al-mina-marketing": "abu-dhabi-cities-marketing",
  "al-mina-port-marketing": "abu-dhabi-cities-marketing",
  "al-muneera-marketing": "abu-dhabi-cities-marketing",
  "al-muroor-marketing": "abu-dhabi-cities-marketing",
  "al-mushrif-marketing": "abu-dhabi-cities-marketing",
  "al-nahyan-marketing": "abu-dhabi-cities-marketing",
  "al-najda-marketing": "abu-dhabi-cities-marketing",
  "al-nakhil-marketing": "abu-dhabi-cities-marketing",
  "al-raha-beach-marketing": "abu-dhabi-cities-marketing",
  "al-reem-island-marketing": "abu-dhabi-cities-marketing",
  "al-shamkha-marketing": "abu-dhabi-cities-marketing",
  "al-zahiyah-marketing": "abu-dhabi-cities-marketing",
  "al-zahra-marketing": "abu-dhabi-cities-marketing",
  "saadiyat-island-marketing": "abu-dhabi-cities-marketing",
  "yas-island-marketing": "abu-dhabi-cities-marketing",
  // ── Sharjah ────────────────────────────────────────────────────────────────
  "al-azra-marketing": "sharjah-cities-marketing",
  "al-azra-marketing-2": "sharjah-cities-marketing",
  "al-buheira-marketing": "sharjah-cities-marketing",
  "al-fayha-marketing": "sharjah-cities-marketing",
  "al-ghafia-marketing": "sharjah-cities-marketing",
  "al-khan-marketing": "sharjah-cities-marketing",
  "al-layyeh-marketing": "sharjah-cities-marketing",
  "al-majaz-marketing": "sharjah-cities-marketing",
  "al-mirgab-marketing": "sharjah-cities-marketing",
  "al-nud-marketing": "sharjah-cities-marketing",
  "al-qasba-marketing": "sharjah-cities-marketing",
  "al-ramla-marketing": "sharjah-cities-marketing",
  "al-rolla-marketing": "sharjah-cities-marketing",
  "al-rowdah-marketing": "sharjah-cities-marketing",
  "al-shahba-marketing": "sharjah-cities-marketing",
  "al-sharq-marketing": "sharjah-cities-marketing",
  "al-suyoh-marketing": "sharjah-cities-marketing",
  "al-taawun-marketing": "sharjah-cities-marketing",
  // ── Ajman ─────────────────────────────────────────────────────────────────
  "ajman-corniche-marketing": "ajman-cities-marketing",
  "al-fisht-marketing": "ajman-cities-marketing",
  "al-hamidiya-marketing": "ajman-cities-marketing",
  "al-jazzat-marketing": "ajman-cities-marketing",
  "al-jerf-marketing": "ajman-cities-marketing",
  "al-jurf-marketing": "ajman-cities-marketing",
  "al-mowaihat-marketing": "ajman-cities-marketing",
  "al-nuaimiya-marketing": "ajman-cities-marketing",
  "al-owan-marketing": "ajman-cities-marketing",
  "al-qadisiya-marketing": "ajman-cities-marketing",
  "al-qusaidat-marketing": "ajman-cities-marketing",
  "al-raqaib-marketing": "ajman-cities-marketing",
  "al-rawda-marketing": "ajman-cities-marketing",
  "al-rawdah-marketing": "ajman-cities-marketing",
  "al-rifaa-marketing": "ajman-cities-marketing",
  "al-tallah-marketing": "ajman-cities-marketing",
  "al-yarmook-motor-marketing": "ajman-cities-marketing",
};

export const CITY_NEIGHBORHOOD_SLUGS = new Set(Object.keys(NEIGHBORHOOD_HUB_MAP));

export function getHubForNeighborhood(slug: string): string | null {
  return NEIGHBORHOOD_HUB_MAP[slug] ?? null;
}

/** Return all neighbourhood slugs that belong to a given hub. */
export function getNeighbourhoodsForHub(hubSlug: string): string[] {
  return Object.entries(NEIGHBORHOOD_HUB_MAP)
    .filter(([, hub]) => hub === hubSlug)
    .map(([slug]) => slug);
}

// ─── Hub page content parser ───────────────────────────────────────────────────

export interface CityHubCard {
  name: string;
  image: string | null;
  wpSlug: string | null;
  localSlug: string | null;
}

/**
 * Parse WordPress hub page HTML to extract neighbourhood cards.
 * Each card corresponds to a `<figure>...<img...></figure><h5>NAME</h5><a href="...areas-of-service/SLUG/">` group.
 * `knownSlugs` is the set of slugs that exist in the DB — used to resolve local links.
 */
export function parseCityHubCards(
  html: string | null,
  knownSlugs: Set<string>
): CityHubCard[] {
  if (!html) return [];

  const cards: CityHubCard[] = [];

  // Split on <figure to isolate each neighbourhood block
  const parts = html.split(/<figure/i);

  for (const part of parts.slice(1)) {
    const imgMatch = part.match(/src="([^"]+)"/);
    const nameMatch = part.match(/<h5[^>]*>([^<]+)<\/h5>/i);
    const slugMatch = part.match(/areas-of-service\/([^/"]+)\//);

    if (!nameMatch) continue;

    const name = nameMatch[1].trim();
    const image = imgMatch ? imgMatch[1] : null;
    const wpSlug = slugMatch ? slugMatch[1] : null;

    // Find a matching local slug: try exact wpSlug first, then title-derived slug
    let localSlug: string | null = null;
    if (wpSlug && knownSlugs.has(wpSlug)) {
      localSlug = wpSlug;
    } else if (wpSlug) {
      // Some WP slugs have minor differences — try a few variations
      const candidates = [
        wpSlug,
        wpSlug.replace(/-marketing$/, "") + "-marketing",
        name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-marketing",
      ];
      for (const candidate of candidates) {
        if (knownSlugs.has(candidate)) {
          localSlug = candidate;
          break;
        }
      }
    }

    cards.push({ name, image, wpSlug, localSlug });
  }

  return cards;
}
