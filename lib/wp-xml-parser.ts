/**
 * WordPress XML (WXR) parser.
 * Extracts posts, pages, portfolio items, and categories from a WordPress export file.
 * Does NOT process attachments, comments, or users.
 */

import { XMLParser } from "fast-xml-parser";

export interface WpItem {
  wpId: number;
  type: "post" | "page" | "portfolio";
  title: string;
  slug: string;
  slugSource: "wp:post_name" | "legacyUrl" | "title";
  legacyUrl: string;
  status: string;
  content: string | null;
  excerpt: string | null;
  author: string | null;
  publishedAt: string | null;
  categories: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  featuredImageUrl: string | null;
  /** All wp:meta_key values found — used for diagnostic reporting. */
  metaKeys: string[];
}

export interface WpCategory {
  wpId: number;
  name: string;
  slug: string;
}

export interface ParsedWpExport {
  items: WpItem[];
  categories: WpCategory[];
}

// ── String extraction ─────────────────────────────────────────────────────────

// Extracts string value from fast-xml-parser nodes (handles CDATA, text, and primitives)
function str(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    const v = val as Record<string, unknown>;
    if ("#cdata" in v) return String(v["#cdata"] ?? "");
    if ("#text" in v) return String(v["#text"] ?? "");
  }
  return String(val);
}

// ── Slug utilities ────────────────────────────────────────────────────────────

/**
 * Returns true if the value is a "real" WordPress slug — not a numeric/ID-based
 * auto-generated one. WordPress generates ID slugs like "16", "16-2", "123-45"
 * when the post name was never explicitly set or was reset during migration.
 *
 * Reject patterns:
 *   - empty string
 *   - purely numeric: "16", "2024"
 *   - ID-with-suffix: "16-2", "16-3" (digit block, hyphen, digit block, no alpha)
 */
function isValidWpSlug(raw: string): boolean {
  if (!raw || raw.trim() === "") return false;
  // Purely numeric
  if (/^\d+$/.test(raw)) return false;
  // Number-hyphen-number (e.g. "16-2", "123-45") with no alphabetic chars
  if (/^\d[\d-]*$/.test(raw)) return false;
  return true;
}

/**
 * Extracts the last meaningful path segment from a URL to use as a slug.
 * e.g. "https://example.com/services/digital-marketing/" → "digital-marketing"
 */
function slugFromUrl(url: string): string {
  if (!url) return "";
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    // Remove common file extensions (.html, .php, .asp, .htm)
    return last.replace(/\.(html?|php|asp)$/i, "");
  } catch {
    return "";
  }
}

/**
 * Generates a URL-safe slug from a title string.
 * Handles ASCII and basic Unicode by normalizing to NFC, stripping diacritics,
 * then lowercasing and replacing non-word characters.
 */
function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")   // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")          // remove non-word chars (except - and space)
    .replace(/[\s_]+/g, "-")           // spaces/underscores → hyphens
    .replace(/-{2,}/g, "-")            // collapse repeated hyphens
    .replace(/^-|-$/g, "");            // trim leading/trailing hyphens
}

/**
 * Resolves the best slug for a WP item using a three-tier priority:
 * 1. wp:post_name  — if present and not a numeric/ID-based value
 * 2. legacy URL    — last path segment of the <link> element
 * 3. title         — slugified post title
 *
 * Returns both the resolved slug and which source was used.
 */
function resolveSlug(
  wpPostName: string,
  legacyUrl: string,
  title: string,
  wpId: number
): { slug: string; slugSource: WpItem["slugSource"] } {
  // Priority 1: wp:post_name
  if (isValidWpSlug(wpPostName)) {
    return { slug: wpPostName, slugSource: "wp:post_name" };
  }

  // Priority 2: last URL path segment
  const fromUrl = slugFromUrl(legacyUrl);
  if (isValidWpSlug(fromUrl)) {
    return { slug: fromUrl, slugSource: "legacyUrl" };
  }

  // Priority 3: slugified title
  const fromTitle = slugify(title);
  if (fromTitle) {
    return { slug: fromTitle, slugSource: "title" };
  }

  // Last resort: wp-{id}
  return { slug: `wp-${wpId}`, slugSource: "title" };
}

// ── Post meta ─────────────────────────────────────────────────────────────────

function getPostMeta(metas: unknown[], key: string): string | null {
  if (!Array.isArray(metas)) return null;
  for (const meta of metas) {
    const m = meta as Record<string, unknown>;
    if (str(m["wp:meta_key"]) === key) {
      const v = str(m["wp:meta_value"]);
      return v || null;
    }
  }
  return null;
}

/**
 * Returns first non-null result from trying each key in order.
 * Used to implement plugin-priority fallback (Rank Math → Yoast → null).
 */
function getPostMetaFirst(metas: unknown[], ...keys: string[]): string | null {
  for (const key of keys) {
    const v = getPostMeta(metas, key);
    if (v) return v;
  }
  return null;
}

/**
 * Returns every wp:meta_key present in a post's postmeta array.
 * Used for diagnostic reporting — identifies which SEO plugin was used.
 */
function getAllMetaKeys(metas: unknown[]): string[] {
  if (!Array.isArray(metas)) return [];
  return metas
    .map((m) => str((m as Record<string, unknown>)["wp:meta_key"]))
    .filter(Boolean);
}

// ── Type mapping ──────────────────────────────────────────────────────────────

function mapType(raw: string): WpItem["type"] | null {
  switch (raw) {
    case "post": return "post";
    case "page": return "page";
    case "portfolio":
    case "jetpack-portfolio":
    case "portfolio_page":
    case "work":
      return "portfolio";
    default: return null;
  }
}

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseWpXml(xmlString: string): ParsedWpExport {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "#cdata",
    isArray: (name) =>
      ["item", "wp:postmeta", "category", "wp:category", "wp:term"].includes(name),
    parseTagValue: false,
    trimValues: true,
  });

  const root = parser.parse(xmlString) as Record<string, unknown>;
  const channel = (
    (root?.rss as Record<string, unknown>)?.channel
  ) as Record<string, unknown> | undefined;

  if (!channel) {
    throw new Error("Invalid WordPress XML: <channel> element not found.");
  }

  // ── Categories ──────────────────────────────────────────────────────────────
  const rawCats = ((channel["wp:category"] ?? []) as Record<string, unknown>[]);
  const categories: WpCategory[] = rawCats
    .map((c) => ({
      wpId: Number(str(c["wp:term_id"])) || 0,
      name: str(c["wp:cat_name"]),
      slug: str(c["wp:category_nicename"]),
    }))
    .filter((c) => c.name && c.slug);

  // ── Items ────────────────────────────────────────────────────────────────────
  const rawItems = (channel.item ?? []) as Record<string, unknown>[];

  const items: WpItem[] = rawItems
    .map((item): WpItem | null => {
      const rawType = str(item["wp:post_type"]);
      const type = mapType(rawType);
      if (!type) return null;

      const wpStatus = str(item["wp:status"]);
      if (wpStatus === "auto-draft" || wpStatus === "inherit") return null;

      const wpId = Number(str(item["wp:post_id"])) || 0;
      const title = str(item.title) || "Untitled";
      const wpPostName = str(item["wp:post_name"]);
      const legacyUrl = str(item.link);

      const { slug, slugSource } = resolveSlug(wpPostName, legacyUrl, title, wpId);

      const postmeta = (item["wp:postmeta"] ?? []) as unknown[];
      const rawCategories = (item.category ?? []) as Record<string, unknown>[];

      // ── SEO metadata — Rank Math takes priority over Yoast ──────────────────
      const seoTitle = getPostMetaFirst(
        postmeta,
        "rank_math_title",          // Rank Math
        "_yoast_wpseo_title",       // Yoast
      );
      const seoDescription = getPostMetaFirst(
        postmeta,
        "rank_math_description",    // Rank Math
        "_yoast_wpseo_metadesc",    // Yoast
      );
      const canonicalUrl = getPostMetaFirst(
        postmeta,
        "rank_math_canonical_url",  // Rank Math
        "_yoast_wpseo_canonical",   // Yoast
      ) || legacyUrl || null;       // fallback: legacy URL
      const ogTitle = getPostMetaFirst(
        postmeta,
        "rank_math_facebook_title", // Rank Math FB
        "rank_math_twitter_title",  // Rank Math Twitter
        "_yoast_wpseo_opengraph-title",
        "_yoast_wpseo_twitter-title",
      );
      const ogDescription = getPostMetaFirst(
        postmeta,
        "rank_math_facebook_description", // Rank Math FB
        "rank_math_twitter_description",  // Rank Math Twitter
        "_yoast_wpseo_opengraph-description",
        "_yoast_wpseo_twitter-description",
      );

      return {
        wpId,
        type,
        title,
        slug,
        slugSource,
        legacyUrl,
        status: wpStatus,
        content: str(item["content:encoded"]) || null,
        excerpt: str(item["excerpt:encoded"]) || null,
        author: str(item["dc:creator"]) || null,
        publishedAt: str(item["wp:post_date"]) || null,
        categories: rawCategories
          .filter((c) => str(c["@_domain"]) === "category")
          .map((c) => str(c["#cdata"]))
          .filter(Boolean),
        seoTitle,
        seoDescription,
        canonicalUrl,
        ogTitle,
        ogDescription,
        featuredImageUrl: null,
        metaKeys: getAllMetaKeys(postmeta),
      };
    })
    .filter((i): i is WpItem => i !== null);

  return { items, categories };
}
