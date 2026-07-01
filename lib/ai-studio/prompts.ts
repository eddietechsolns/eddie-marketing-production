// ─── AI Publishing Studio — Prompt builders ───────────────────────────────────

import type { ScoredRecommendation } from "@/lib/content-gap-engine";
import type { GeneratedArticle, RegeneratableSection } from "./types";

const BRAND_NAME = "Eddie Marketing Solutions FZE";
const SITE_URL = "https://eddiemarketing.ae";

// ─── Full article generation ──────────────────────────────────────────────────

export function buildSystemPrompt(): string {
  return `You are a senior SEO content strategist and writer for ${BRAND_NAME}, a performance-driven digital marketing agency based in Dubai, UAE.

You create helpful, expert content that ranks on Google and converts UAE business owners into marketing leads. Every article demonstrates E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) and follows Google's Helpful Content guidelines.

Style guide:
- UAE business market context (Dubai/Abu Dhabi/Sharjah, AED pricing, UAE Vision 2031)
- Conversational yet authoritative tone — no jargon, plain English
- Specific over generic: use UAE market data, real examples, named platforms
- Action-oriented: every section ends with a concrete insight or takeaway
- Never use filler phrases like "In today's digital landscape" or "In conclusion"

CRITICAL: Respond with a single valid JSON object only — no markdown fences, no code blocks, no preamble. The entire response must be parseable by JSON.parse().`;
}

export function buildFullArticlePrompt(rec: ScoredRecommendation): string {
  const todayISO = new Date().toISOString().slice(0, 10);

  return `Generate a complete SEO-optimized article for this content brief:

BRIEF:
  Title: ${rec.title}
  Slug: ${rec.slug}
  Content type: ${rec.contentType}
  Marketing cluster: ${rec.clusterName} (${rec.clusterType})
  Supporting page: ${rec.supportingPage}
  Strategic reason: ${rec.reason}
  Target audience: UAE business owners, marketing managers, decision-makers

REQUIREMENTS:
  - Total body word count: 1,800–2,400 words (introduction + all sections combined)
  - At least 5 H2 sections; at least 2 of those must have 1–2 H3 subsections
  - Include real UAE statistics, named examples, and market context
  - FAQ: exactly 5 questions (common related searches from UAE buyers)
  - Internal links: minimum 4, pointing to pages on ${SITE_URL}
  - External authority links: minimum 3, citing Google, HubSpot, SEMrush, Statista, or similar
  - JSON-LD: Article schema with full publisher fields
  - SEO score (0–100): score = keyword_in_title(10) + keyword_in_meta(10) + keyword_in_intro(10) + h2_count_gte5(20) + word_count_gte1500(20) + faq_present(10) + internal_links_gte4(10) + external_links_gte3(10)

Return ONLY this JSON object — no extra keys, no markdown:

{
  "seoTitle": "<50-60 chars, contains focus keyword>",
  "metaTitle": "<same as seoTitle or slight variation>",
  "metaDescription": "<145-155 chars, contains keyword, ends with soft CTA>",
  "urlSlug": "<same as brief slug or improved version>",
  "focusKeyword": "<primary keyword phrase>",
  "secondaryKeywords": ["<kw1>","<kw2>","<kw3>","<kw4>","<kw5>"],
  "outline": [
    { "level": "h2", "text": "<heading>" },
    { "level": "h3", "text": "<subheading>" }
  ],
  "introduction": "<180-220 words. Compelling hook. Contains focus keyword in first 100 words. Establishes E-E-A-T. No 'In today's digital landscape'.>",
  "sections": [
    {
      "heading": "<H2 heading>",
      "level": "h2",
      "content": "<200-350 words. Specific, actionable content. UAE context.>",
      "subsections": [
        { "heading": "<H3>", "level": "h3", "content": "<100-200 words>" }
      ]
    }
  ],
  "faq": [
    { "question": "<question UAE buyers search>", "answer": "<60-100 words, direct, helpful>" }
  ],
  "conclusion": "<150-200 words. Summarises key takeaways. Soft CTA. No 'In conclusion'.>",
  "callToAction": "<1-2 sentences. Strong CTA linking to ${rec.supportingPage}. Specific benefit.>",
  "internalLinks": [
    { "anchorText": "<anchor>", "url": "<path starting with />", "context": "<where in article to place>" }
  ],
  "externalLinks": [
    { "anchorText": "<anchor>", "url": "<full https:// URL>", "domain": "<domain name>", "purpose": "<why this cite>" }
  ],
  "imageAltTexts": ["<alt 1>","<alt 2>","<alt 3>"],
  "featuredImagePrompt": "<detailed AI image gen prompt — photorealistic, professional UAE business setting, no text overlays>",
  "ogTitle": "<60-70 chars, engaging, contains keyword>",
  "ogDescription": "<150-160 chars, compelling summary>",
  "twitterCard": {
    "title": "<under 70 chars>",
    "description": "<under 200 chars>",
    "type": "summary_large_image"
  },
  "jsonLdSchema": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "<article title>",
    "description": "<meta description>",
    "author": { "@type": "Organization", "name": "${BRAND_NAME}", "url": "${SITE_URL}" },
    "publisher": { "@type": "Organization", "name": "${BRAND_NAME}", "url": "${SITE_URL}" },
    "datePublished": "${todayISO}",
    "dateModified": "${todayISO}",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "${SITE_URL}/${rec.slug}" }
  },
  "readingTimeMinutes": 8,
  "seoScore": 90,
  "wordCount": 2000
}`;
}

// ─── Section regeneration ─────────────────────────────────────────────────────

export function buildSectionRegeneratePrompt(
  rec: ScoredRecommendation,
  section: RegeneratableSection,
  existing: GeneratedArticle,
  instruction?: string
): string {
  const sectionSchema = getSectionSchema(section, existing);

  return `You are rewriting a specific section of this article:
  Title: "${existing.seoTitle}"
  Focus keyword: "${existing.focusKeyword}"
  Section to rewrite: ${section}
  ${instruction ? `Special instruction: ${instruction}` : "Make it more specific, concrete, and actionable."}

  Article context (do not repeat these — they are adjacent content):
  ${existing.outline.map((o) => `${o.level.toUpperCase()}: ${o.text}`).join("\n  ")}

  Return ONLY a JSON object for the requested section:
  ${sectionSchema}`;
}

function getSectionSchema(
  section: RegeneratableSection,
  article: GeneratedArticle
): string {
  if (section === "introduction") {
    return `{ "introduction": "<180-220 words, compelling, contains focus keyword>" }`;
  }
  if (section === "faq") {
    return `{ "faq": [{ "question": "<string>", "answer": "<60-100 words>" }] }  (exactly 5 items)`;
  }
  if (section === "conclusion") {
    return `{ "conclusion": "<150-200 words, no 'In conclusion'>" }`;
  }
  if (section === "callToAction") {
    return `{ "callToAction": "<1-2 sentences, specific benefit, strong CTA>" }`;
  }
  if (section === "seoMeta") {
    return `{ "seoTitle": "<50-60 chars>", "metaTitle": "<string>", "metaDescription": "<145-155 chars>", "focusKeyword": "<string>", "secondaryKeywords": ["<kw>"] }`;
  }
  if (section === "ogMeta") {
    return `{ "ogTitle": "<60-70 chars>", "ogDescription": "<150-160 chars>", "twitterCard": { "title": "<string>", "description": "<under 200 chars>", "type": "summary_large_image" } }`;
  }
  if (section.startsWith("section-")) {
    const idx = parseInt(section.replace("section-", ""), 10);
    const existing = article.sections[idx];
    return `{ "section": { "heading": "${existing?.heading ?? "Section Heading"}", "level": "h2", "content": "<200-350 words, specific, actionable>", "subsections": [] } }`;
  }
  return `{ "content": "<regenerated content>" }`;
}
