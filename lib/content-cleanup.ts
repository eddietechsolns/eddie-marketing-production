/**
 * Server-side HTML cleanup for WordPress-imported page content.
 *
 * Rules:
 * - Never modifies the database.
 * - Never rewrites copy or uses AI.
 * - Only normalises markup at render time.
 */

// Old domain — any absolute link pointing here is rewritten to a relative path.
const OLD_DOMAIN_RE = /https?:\/\/(?:www\.)?eddietechsolns\.com/gi;

/**
 * Strip HTML-encoded orphan closing tags that WordPress emitted as text.
 * e.g. &lt;/h1 &gt; → ""
 */
function stripEncodedOrphanTags(html: string): string {
  return html.replace(/&lt;\s*\/\s*\w+\s*&gt;/gi, "");
}

/**
 * Remove the first <h1>…</h1> block from the content.
 * The page title is already rendered in the hero section, so the first H1
 * inside the body is always a duplicate.
 */
function removeFirstH1(html: string): string {
  return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");
}

/**
 * Remove WordPress block comments.
 */
function removeWpComments(html: string): string {
  return html.replace(/<!--\s*\/?wp:[^>]*-->/gi, "");
}

/**
 * Remove inline style attributes (WordPress adds these everywhere).
 */
function stripInlineStyles(html: string): string {
  return html.replace(/\s*style="[^"]*"/gi, "");
}

/**
 * Rewrite old-domain absolute links to relative paths.
 */
function rewriteOldDomainLinks(html: string): string {
  return html.replace(OLD_DOMAIN_RE, "");
}

/**
 * Remove WordPress anchor-only CTAs like <a href="#contact">…</a>.
 */
function removeAnchorOnlyCtas(html: string): string {
  return html.replace(/<a\s+href=["']#[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "");
}

const WP_JUNK_PATH_RE = new RegExp(
  [
    "/multiple-addresses/",
    "/wp-admin/",
    "/cart/",
    "/checkout/",
    "/my-account/",
    "/shop/",
    "/wishlist/",
    "/maintenance/",
    "_wp_link_placeholder",
    "your-contact-link-here",
  ]
    .map((p) => p.replace(/\//g, "\\/").replace(/\?/g, "\\?"))
    .join("|"),
  "i"
);

/**
 * Remove <a> elements whose href points to a known WP junk/utility path.
 */
function removeWpJunkLinks(html: string): string {
  return html.replace(/<a\s[^>]*href=["']([^"']*)["'][^>]*>[\s\S]*?<\/a>/gi, (match, href) => {
    if (WP_JUNK_PATH_RE.test(href)) return "";
    return match;
  });
}

/**
 * Remove empty or whitespace-only paragraphs.
 */
function removeEmptyParagraphs(html: string): string {
  return html
    .replace(/<p[^>]*>\s*(&nbsp;)?\s*<\/p>/gi, "")
    .replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, "");
}

/**
 * Strip leading &nbsp; and whitespace before real content starts.
 */
function stripLeadingNbsp(html: string): string {
  return html.replace(/^(\s*&nbsp;\s*)+/i, "");
}

/**
 * Collapse runs of more than two <br> tags into a paragraph break.
 */
function collapseExcessiveBreaks(html: string): string {
  return html.replace(/(<br\s*\/?>\s*){3,}/gi, "</p><p>");
}

/**
 * Remove WordPress shortcodes [like_this] that were not converted.
 */
function removeShortcodes(html: string): string {
  return html.replace(/\[[^\]]+\]/g, "");
}

/**
 * Main entry point. Returns cleaned HTML safe to pass to dangerouslySetInnerHTML.
 */
export function cleanImportedContent(raw: string | null | undefined): string {
  if (!raw) return "";

  let html = raw;
  html = stripLeadingNbsp(html);
  html = removeWpComments(html);
  html = stripInlineStyles(html);
  html = stripEncodedOrphanTags(html);
  html = removeFirstH1(html);
  html = removeAnchorOnlyCtas(html);
  html = rewriteOldDomainLinks(html);
  html = removeWpJunkLinks(html);
  html = removeShortcodes(html);
  html = collapseExcessiveBreaks(html);
  html = removeEmptyParagraphs(html);

  return html.trim();
}

// ─── Blog-specific cleaners ────────────────────────────────────────────────────
// These strippers target WordPress icon blocks, social share widgets,
// Font Awesome elements, and plugin-generated markup that appears in
// blog articles but not in service/industry pages.

/**
 * Strip Font Awesome icon elements: <i class="fa ..."> and <span class="fa ...">
 */
function stripFontAwesomeIcons(html: string): string {
  return html
    .replace(/<i\s[^>]*class="[^"]*\bfa[- ][^"]*"[^>]*>[\s\S]*?<\/i>/gi, "")
    .replace(/<i\s[^>]*class="[^"]*\bfa[- ][^"]*"[^>]*\/?>/gi, "")
    .replace(/<span\s[^>]*class="[^"]*\bfa[- ][^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<i\s[^>]*class="[^"]*(?:dashicon|genericon|material-icon)[^"]*"[^>]*>[\s\S]*?<\/i>/gi, "");
}

/**
 * Strip decorative SVG elements (icon-sized, aria-hidden, or class-flagged as icons).
 * Preserves SVGs with a <title> element that are clearly large content graphics.
 */
function stripDecorativeSvgs(html: string): string {
  return html.replace(/<svg[\s\S]*?<\/svg>/gi, (match) => {
    if (/<title>[^<]{3,}<\/title>/i.test(match)) return match;
    // aria-hidden SVGs are always decorative icons — strip unconditionally
    if (/aria-hidden=["']true["']/i.test(match)) return "";
    const w = parseInt(match.match(/\bwidth=["']?(\d+)/i)?.[1] ?? "999");
    const h = parseInt(match.match(/\bheight=["']?(\d+)/i)?.[1] ?? "999");
    // Strip if explicitly small
    if (w <= 64 || h <= 64) return "";
    // Strip if no explicit dimensions (likely an inline icon without width/height attrs)
    if (w === 999 && h === 999 && !/<image/i.test(match)) return "";
    // Strip by class
    if (/class="[^"]*(?:icon|social|share|btn|wp-svg)[^"]*"/i.test(match)) return "";
    return match;
  });
}

/**
 * Strip social sharing button sections.
 * Matches share-widget wrappers, individual share links, and "Share This:" text remnants.
 */
function stripSocialShareBlocks(html: string): string {
  return html
    .replace(/<(?:div|section)[^>]*class="[^"]*(?:share|social-share|addthis|sharedaddy|jetpack-social)[^"]*"[^>]*>[\s\S]*?<\/(?:div|section)>/gi, "")
    .replace(/<a[^>]*href="https?:\/\/(?:twitter|facebook|linkedin|pinterest|t\.co)\.com\/(?:share|sharer|intent)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<[^>]+>\s*(?:Share this|Share on|Share:|Tweet this|Pin this)[^<]*<\/[^>]+>/gi, "")
    // "Share This :" orphan text (after social links are stripped, label may remain)
    .replace(/(?<=>)\s*Share\s+This\s*:?\s*(?=<)/gi, "");
}

/**
 * Remove the first H2 when it appears before any paragraph content.
 * WordPress articles often duplicate the post title as the first <h2>.
 * A real section heading would be preceded by at least one <p>.
 */
function removeLeadingDuplicateH2(html: string): string {
  // Only remove if no <p> appears before the first <h2>
  const firstH2Index = html.search(/<h2[\s>]/i);
  const firstPIndex = html.search(/<p[\s>]/i);
  if (firstH2Index === -1) return html;
  if (firstPIndex !== -1 && firstPIndex < firstH2Index) return html;
  // The first <h2> appears before any paragraph — it's a title duplicate
  return html.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, "");
}

/**
 * Strip empty list elements left behind after social share icons are removed.
 */
function stripEmptyLists(html: string): string {
  return html
    .replace(/<ul[^>]*>(?:\s*<li[^>]*>\s*<\/li>)+\s*<\/ul>/gi, "")
    .replace(/<ol[^>]*>(?:\s*<li[^>]*>\s*<\/li>)+\s*<\/ol>/gi, "");
}

/**
 * Strip WordPress block image <figure> elements used as decorative icons.
 * Removes small (≤150px) icon figures and thumbnail-class align blocks without captions.
 */
function stripWpIconFigures(html: string): string {
  return html.replace(/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, (match) => {
    const w = parseInt(match.match(/\bwidth=["']?(\d+)/i)?.[1] ?? "999");
    const h = parseInt(match.match(/\bheight=["']?(\d+)/i)?.[1] ?? "999");
    if (w <= 150 || h <= 150) return "";
    if (/size-(?:thumbnail|medium|icon)/i.test(match) && !/<figcaption/i.test(match)) return "";
    if (/(?:alignleft|alignright)/i.test(match) && !/<figcaption/i.test(match) && w <= 200) return "";
    return match;
  });
}

/**
 * Strip WP plugin artifacts: dashicons, post-meta taxonomy lines, WP block separators,
 * orphan date/category paragraphs left after SVG icon stripping, and broken WP media images.
 */
function stripWpPluginArtifacts(html: string): string {
  return html
    // Dashicons, genericons, WP form icons
    .replace(/<span[^>]*class="[^"]*(?:dashicons|genericon|wpforms-icon)[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
    // Taxonomy meta lines with explicit classes
    .replace(/<p[^>]*class="[^"]*(?:post-categories|post-tags|entry-meta|post-meta)[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "")
    // WP block separators
    .replace(/<hr\s+class="[^"]*wp-block-separator[^"]*"\s*\/?>/gi, "<hr/>")
    .replace(/<div[^>]*class="[^"]*wp-block-(?:spacer|separator)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    // Orphan date paragraphs left after calendar-icon SVG is stripped
    // e.g. <p>November 12, 2024</p> or <p>April 3, 2025</p>
    .replace(/<p[^>]*>\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\s*<\/p>/gi, "")
    // Orphan WP category/tag comma-lists left after folder-icon SVG is stripped
    // These appear as bare text nodes (not in <p>) between HTML tags
    // e.g. >All,Business,Email Marketing,Google ADs,Social Media,Website<
    // Handles both single-word and multi-word category names (up to 3 words each)
    .replace(/<p[^>]*>\s*(?:[A-Za-z][A-Za-z]*(?:[ ][A-Za-z][A-Za-z]*){0,2},\s*){2,}[A-Za-z][A-Za-z]*(?:[ ][A-Za-z][A-Za-z]*){0,2}\s*<\/p>/g, "")
    .replace(/(?<=>)[ \t]*(?:[A-Za-z][A-Za-z]*(?:[ ][A-Za-z][A-Za-z]*){0,2},[ \t]*){2,}[A-Za-z][A-Za-z]*(?:[ ][A-Za-z][A-Za-z]*){0,2}[ \t]*(?=<)/g, "")
    // Broken /wp-content/ images — these are from the old WP install and always 404
    .replace(/<img[^>]+src="\/wp-content\/[^"]*"[^>]*>/gi, "")
    .replace(/<figure[^>]*>\s*<img[^>]+src="\/wp-content\/[^"]*"[^>]*>\s*(?:<figcaption[^>]*>[\s\S]*?<\/figcaption>)?\s*<\/figure>/gi, "");
}

/**
 * Strip all externally-hosted WordPress images (any absolute URL containing wp-content).
 * These come from the old WP install (eddietechsolns.com, rankjetdigital.ae, etc.)
 * and always result in 404s or externally-served images that we don't control.
 */
function stripExternalWpImages(html: string): string {
  return html
    // Strip standalone <img> with absolute wp-content src
    .replace(/<img[^>]+src="https?:\/\/[^"]*wp-content[^"]*"[^>]*\/?>/gi, "")
    // Strip <figure> blocks wrapping those images (with optional <figcaption>)
    .replace(
      /<figure[^>]*>(?:\s*<a[^>]*>)?\s*<img[^>]+src="https?:\/\/[^"]*wp-content[^"]*"[^>]*\/?>\s*(?:<\/a>)?\s*(?:<figcaption[^>]*>[\s\S]*?<\/figcaption>)?\s*<\/figure>/gi,
      ""
    );
}

/**
 * Strip calendar, folder, and social media icon images.
 * These are typically small WP-generated decorative <img> elements
 * embedded inline for dates, categories, and share buttons.
 */
function stripDecorativeIconImages(html: string): string {
  return html.replace(/<img[^>]+>/gi, (match) => {
    const src = match.match(/src=["']([^"']+)["']/i)?.[1] ?? "";
    const w = parseInt(match.match(/\bwidth=["']?(\d+)/i)?.[1] ?? "999");
    const h = parseInt(match.match(/\bheight=["']?(\d+)/i)?.[1] ?? "999");
    const alt = (match.match(/alt=["']([^"']*)["']/i)?.[1] ?? "").toLowerCase();
    if (w <= 32 || h <= 32) return "";
    if (/(?:calendar|folder|facebook|twitter|instagram|linkedin|social|share|icon|arrow|bullet|star|check)/i.test(src)) return "";
    if (/(?:calendar|folder|social|share|icon)/i.test(alt)) return "";
    return match;
  });
}

/**
 * Remove WP block class attributes, leaving only the element.
 * Strips class="wp-block-*" from div wrappers (keeps the inner content).
 */
function cleanWpBlockClasses(html: string): string {
  return html
    .replace(/\s*class="[^"]*wp-block-(?:group|columns|column|cover|buttons|button|embed)[^"]*"/gi, "")
    .replace(/<div[^>]*class="\s*"[^>]*>/gi, "<div>");
}

/**
 * Blog-specific content cleanup.
 * Extends cleanImportedContent with additional strippers targeting
 * WordPress icon blocks, social share widgets, Font Awesome, and plugin artifacts.
 */
export function cleanBlogContent(raw: string | null | undefined): string {
  if (!raw) return "";
  let html = cleanImportedContent(raw);
  html = stripFontAwesomeIcons(html);
  html = stripDecorativeSvgs(html);
  html = stripSocialShareBlocks(html);
  html = stripWpIconFigures(html);
  html = stripWpPluginArtifacts(html);
  html = stripExternalWpImages(html);
  html = stripDecorativeIconImages(html);
  html = cleanWpBlockClasses(html);
  html = removeLeadingDuplicateH2(html);
  html = stripEmptyLists(html);
  html = removeEmptyParagraphs(html);
  return html.trim();
}
