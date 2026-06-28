// ─── Content Parser ────────────────────────────────────────────────────────────
//
// Splits WordPress-imported HTML into structured sections and applies a
// content quality filter that removes legacy sales/FAQ/CTA blocks before
// anything reaches the renderer.
//
// Pipeline:
//  1. Split at every <h2> boundary
//  2. Pull the first <img> out of each section body (becomes the section image)
//  3. Apply the content quality filter (remove spam headings, sales FAQ items)
//  4. Detect remaining FAQ-like sections by heading text pattern
//  5. Return intro + filtered section arrays

export interface ContentSection {
  id: string;
  heading: string;
  body: string;       // HTML body with section image removed
  imageUrl: string | null;
  imageAlt: string;
  isFaq: boolean;
}

export interface ParsedContent {
  intro: string;           // HTML before the first <h2>
  sections: ContentSection[];
  faqSections: ContentSection[];
  contentSections: ContentSection[];
}

// ─── Content Quality Filter ────────────────────────────────────────────────────
//
// Any section whose heading matches one of these patterns is removed entirely
// from the rendered output. This covers:
//   • Legacy WP pricing / payment / NDA / deposit content
//   • All-caps CTA blocks (GET IN TOUCH, FILL UP THE FORM, etc.)
//   • Company history / generic sales pitch sections
//   • Support / promotional / irrelevant geography content

const SPAM_HEADING_PATTERNS: RegExp[] = [
  // ── All-caps CTA slogans are caught by isAllCapsSlogan() below ──────────

  // ── Explicit CTA / contact / form prompts ─────────────────────────────
  /^get\s+in\s+touch/i,
  /fill\s+(?:up\s+)?(?:the\s+)?form/i,
  /^contact\s+us/i,
  /^call\s+(?:us\s+)?(?:now|today)/i,
  /^reach\s+(?:us\s+)?(?:out|now|today)/i,
  /^talk\s+to\s+(?:us|an?\s+expert|our\s+team)/i,
  /^speak\s+(?:to|with)\s+(?:us|an?\s+expert)/i,
  /^request\s+a\s+(?:free\s+)?(?:quote|proposal|demo|call|consultation\s+now)/i,
  /^schedule\s+(?:a\s+)?(?:free\s+)?(?:call|demo|consult)/i,
  /^get\s+your\s+free\s+/i,
  /^get\s+your\s+(?:free\s+)?(?:quote|proposal|demo|consultation\s+now|ad\s+on)/i,
  /^start\s+(?:your\s+)?(?:free\s+)?(?:trial|consultation)/i,
  /^let[''\u2019`]?s\s+(?:talk|chat|connect|discuss)/i,

  // ── Pricing / payment / financial terms ───────────────────────────────
  /hourly\s+rate/i,
  /\bper\s+hour\b/i,
  /\$\s*\d+/,
  /(?:\d+\s*%\s*deposit|\bdeposit\s+required\b)/i,
  /(?:payment|billing|invoice)\s+terms?/i,
  /money[- ]back\s+guarantee/i,
  /\brefund\s+policy\b/i,
  /\bour\s+(?:pricing|rates?|fees?|packages?|charges?)\b/i,
  /\bservice\s+(?:pricing|packages?|plans?)\b/i,
  /\bads?\s+pricing\b/i,
  /\bpricing\s+(?:plans?|packages?|tiers?|guide)\b/i,

  // ── NDA / contracts / legal terms ────────────────────────────────────
  /\bnda\b/i,
  /non[- ]disclosure/i,
  /will\s+you\s+sign/i,
  /\bconfidentiality\s+agreement\b/i,

  // ── Company history / generic sales pitch ────────────────────────────
  /\bsince\s+(?:19|20)\d{2}\b/i,
  /(?:founded|established)\s+in\s+\d{4}/i,
  /\d{2,}\+?\s+years?\s+(?:of\s+)?(?:experience|in\s+(?:the\s+)?(?:business|industry|sector|market))/i,
  /\bout\s+(?:hourly\s+)?experience\b/i,

  // ── Support / helpdesk pitch ──────────────────────────────────────────
  /\b24\s*[\/x]\s*7\b.*support/i,
  /\b24\s*x\s*7\s*customer\b/i,
  /\bhelpdesk\b/i,

  // ── Promotional offers / discounts ────────────────────────────────────
  /\bpromotional\s+program/i,
  /\bspecial\s+offer\b/i,
  /\bexclusive\s+(?:offer|deal|discount)\b/i,
  /\bget\s+\d+%\s+off\b/i,
  /\bdiscount\s+on\s+/i,

  // ── Irrelevant company-specific geography ────────────────────────────
  /united\s+african\s+state/i,
  /\bafrican\s+(?:market|state|region)\b/i,

  // ── WP boilerplate / shortcode leftovers ────────────────────────────
  /^\[.*\]$/,   // leftover shortcodes like [contact-form]
];

/**
 * All-caps section headings (≥ 2 all-uppercase words) are WP CTA blocks.
 * Examples: "GET IN TOUCH", "MARKETING STRATEGIES", "GET YOUR AD ON GOOGLE TODAY"
 */
function isAllCapsSlogan(heading: string): boolean {
  const letters = heading.replace(/[^a-zA-Z\s]/g, "").trim();
  if (!letters) return false;
  const words = letters.split(/\s+/).filter((w) => w.length > 1);
  return words.length >= 2 && words.every((w) => w === w.toUpperCase());
}

/**
 * Sales-question h2 openers: long headings that are rhetorical sales questions,
 * not educational section headings.
 * Examples: "Have you been looking for an agency…", "Are you searching for…"
 */
function isSalesQuestion(heading: string): boolean {
  if (heading.length < 40) return false;
  return /^(?:have\s+you|are\s+you\s+(?:looking|searching|ready|trying)|do\s+you\s+(?:want|need|wish)|would\s+you|is\s+your\s+(?:business|company)|does\s+your|looking\s+for\s+an?\s+agency)/i.test(
    heading
  );
}

/**
 * Long h2 headings that are sales/marketing sentences masquerading as section
 * headings. Real section headings are short and topic-focused; these are
 * imported WP copy that happens to be wrapped in <h2> tags.
 *
 * Examples:
 *  "The world's largest social media platform is ready to help you connect…"
 *  "Facebook boasts over 2.9 billion active users, making it the ultimate…"
 */
function isSalesIntroSentence(heading: string): boolean {
  if (heading.length < 70) return false; // short topic headings are fine

  // 1. Platform/brand boast sentences
  if (
    /^(?:the\s+world[''\u2019]?s\s+(?:largest|biggest|most|best)|facebook\s+boasts|instagram\s+offers|twitter\s+has|linkedin\s+is|google\s+is)\b/i.test(heading) ||
    /\b(?:ready\s+to\s+help\s+you|connect\s+with\s+new\s+(?:customers|patients|clients)|making\s+it\s+the\s+ultimate|is\s+the\s+(?:best|most\s+powerful)\s+platform)\b/i.test(heading)
  ) return true;

  // 2. "[Service] is a/an [noun]…" — definition sentence used as h2
  if (/^[\w\s]+ is (?:a|an) [\w]/i.test(heading)) return true;

  // 3. Company self-promotion: starts with company names
  if (/^(?:eddie\s+(?:tech\s+solutions|marketing)|our\s+team\s+(?:at|of))\b/i.test(heading)) return true;

  // 4. Run-on comma lists (≥ 3 commas) — service bullet lists used as h2
  if ((heading.match(/,/g) ?? []).length >= 3) return true;

  return false;
}

function isSpamHeading(heading: string): boolean {
  if (!heading || !heading.trim()) return true;
  if (isAllCapsSlogan(heading)) return true;
  if (isSalesQuestion(heading)) return true;
  if (isSalesIntroSentence(heading)) return true;
  return SPAM_HEADING_PATTERNS.some((p) => p.test(heading));
}

// ─── FAQ-specific spam filter ──────────────────────────────────────────────────
// Applied independently to FAQ section questions and answers.
// Educational questions like "How long does SEO take?" are preserved;
// pricing/NDA/sales FAQs are removed.

const SPAM_FAQ_QUESTION_PATTERNS: RegExp[] = [
  /\bnda\b|non[- ]disclosure/i,
  /\bhourly\b|\bper\s+hour\b|\$\s*\d+/i,
  /\bdeposit\b|\bpayment\s+terms?\b/i,
  /\bpromotional\b|\bdiscount\b|\bspecial\s+offer\b/i,
  /24\s*[\/x]\s*7\s+(?:customer\s+)?support/i,
  /will\s+you\s+sign/i,
  /\bsince\s+(?:19|20)\d{2}\b/i,
  /united\s+african/i,
  /\brefund\b|\bmoney.back\b/i,
  /\bfounding\b|\boutstanding\s+service\b/i,
];

const SPAM_FAQ_ANSWER_PATTERNS: RegExp[] = [
  /hourly\s+rate|per\s+hour|\$\s*\d+\s*(?:per|an?\s)?\s*hour/i,
  /\d+\s*%\s*(?:deposit|upfront)|upfront\s+(?:payment|deposit)/i,
  /\bnda\b|non[- ]disclosure/i,
  /promotional\s+program|special\s+discount/i,
  /united\s+african/i,
  /since\s+200\d|since\s+199\d/i,
];

function isSpamFaqItem(question: string, answer: string): boolean {
  return (
    SPAM_FAQ_QUESTION_PATTERNS.some((p) => p.test(question)) ||
    SPAM_FAQ_ANSWER_PATTERNS.some((p) => p.test(answer))
  );
}

// ─── Heading patterns that indicate a FAQ-style section ───────────────────────
const FAQ_HEADING_PATTERN =
  /^(what|how|why|when|can|is|are|do|does|should|will|which|who|where|have|has|faq|frequently asked|common question)/i;

// ─── Utilities ─────────────────────────────────────────────────────────────────

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function extractFirstImage(html: string): { src: string; alt: string } | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (!m) return null;
  const altM = m[0].match(/alt=["']([^"']*)["']/i);
  return { src: m[1], alt: altM?.[1] ?? "" };
}

function removeFirstImage(html: string): string {
  const fig = html.replace(/<figure[^>]*>[\s\S]*?<\/figure>/i, "");
  if (fig !== html) return fig.trim();
  const pImg = html.replace(/<p[^>]*>\s*<img[^>]+>\s*<\/p>/i, "");
  if (pImg !== html) return pImg.trim();
  return html.replace(/<img[^>]+>/i, "").trim();
}

function hasMeaningfulText(html: string): boolean {
  return stripTags(html).trim().length > 20;
}

// ─── Main parser ───────────────────────────────────────────────────────────────

export function parseContentSections(html: string): ParsedContent {
  if (!html?.trim()) {
    return { intro: "", sections: [], faqSections: [], contentSections: [] };
  }

  const chunks = html.split(/(?=<h2[\s>])/i);

  let intro = "";
  const rawSections: ContentSection[] = [];

  chunks.forEach((chunk, idx) => {
    if (!chunk.trim()) return;

    const h2Match = chunk.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);

    if (!h2Match) {
      intro += chunk;
      return;
    }

    const heading = stripTags(h2Match[1]) || `Section ${idx}`;
    const rawBody = chunk.slice(h2Match.index! + h2Match[0].length).trim();

    const img = extractFirstImage(rawBody);
    const body = img ? removeFirstImage(rawBody) : rawBody;

    const isFaq = FAQ_HEADING_PATTERN.test(heading);

    rawSections.push({
      id: `s-${idx}`,
      heading,
      body,
      imageUrl: img?.src ?? null,
      imageAlt: img?.alt || heading,
      isFaq,
    });
  });

  // ── Apply content quality filter ─────────────────────────────────────────
  // Pass 1: drop spam content sections (CTA blocks, pricing, NDA, etc.)
  const filteredSections = rawSections.filter(
    (s) => !isSpamHeading(s.heading)
  );

  // Pass 2: split into FAQ vs content
  const contentSections = filteredSections.filter((s) => !s.isFaq);

  // Pass 3: filter FAQ items — remove sales/pricing/NDA questions
  const faqSections = filteredSections
    .filter((s) => s.isFaq && hasMeaningfulText(s.body))
    .filter((s) => !isSpamFaqItem(s.heading, extractFaqAnswer(s.body)));

  return {
    intro,
    sections: filteredSections,
    faqSections,
    contentSections,
  };
}

// ─── Extract plain-text answer for FAQ accordion ──────────────────────────────
export function extractFaqAnswer(bodyHtml: string): string {
  return stripTags(bodyHtml).replace(/\s+/g, " ").trim().slice(0, 600);
}
