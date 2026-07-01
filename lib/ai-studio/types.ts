// ─── AI Publishing Studio — Types ─────────────────────────────────────────────

export interface ArticleOutlineItem {
  level: "h2" | "h3";
  text: string;
}

export interface ArticleSubsection {
  heading: string;
  level: "h3";
  content: string;
}

export interface ArticleSection {
  heading: string;
  level: "h2";
  content: string;
  subsections: ArticleSubsection[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LinkSuggestion {
  anchorText: string;
  url: string;
  context: string;
  domain?: string;
  purpose?: string;
}

export interface TwitterCard {
  title: string;
  description: string;
  type: "summary_large_image";
}

export interface GeneratedArticle {
  seoTitle: string;
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  outline: ArticleOutlineItem[];
  introduction: string;
  sections: ArticleSection[];
  faq: FAQItem[];
  conclusion: string;
  callToAction: string;
  internalLinks: LinkSuggestion[];
  externalLinks: LinkSuggestion[];
  imageAltTexts: string[];
  featuredImagePrompt: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: TwitterCard;
  jsonLdSchema: Record<string, unknown>;
  readingTimeMinutes: number;
  seoScore: number;
  wordCount: number;
}

export type RegeneratableSection =
  | "introduction"
  | `section-${number}`
  | "faq"
  | "conclusion"
  | "callToAction"
  | "seoMeta"
  | "ogMeta";
