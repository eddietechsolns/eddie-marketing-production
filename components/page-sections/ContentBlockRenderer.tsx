import { parseContentSections, extractFaqAnswer } from "@/lib/content-parser";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { getSectionImage } from "@/lib/page-images";

// ─── Shared prose classes ──────────────────────────────────────────────────────
const PROSE =
  "prose prose-slate max-w-none " +
  "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 " +
  "prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 " +
  "prose-h4:text-base prose-h4:mt-4 prose-h4:mb-1 " +
  "prose-p:text-slate-600 prose-p:leading-[1.85] prose-p:mb-4 prose-p:text-[15px] " +
  "prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline " +
  "prose-strong:text-slate-900 prose-strong:font-semibold " +
  "prose-ul:my-4 prose-li:my-1 prose-li:text-slate-600 prose-li:text-[15px] " +
  "prose-ol:my-4 " +
  "prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:pl-5 prose-blockquote:my-6 prose-blockquote:text-slate-600 prose-blockquote:not-italic " +
  "prose-img:hidden"; // hide any residual wp-content images in prose

// ─── Curated section image ─────────────────────────────────────────────────────
function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-64 lg:h-72 object-cover object-center"
        loading="lazy"
      />
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-slate-900/20 pointer-events-none rounded-2xl" />
    </div>
  );
}

// ─── Alternating image + text section ─────────────────────────────────────────
function ImageSection({
  heading,
  body,
  imageUrl,
  imageAlt,
  reverse,
}: {
  heading: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  reverse: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-8 lg:gap-14 items-center py-10 border-b border-slate-100 last:border-0`}
    >
      {/* Image side — 40% width on desktop */}
      <div className="w-full lg:w-2/5 shrink-0">
        <SectionImage src={imageUrl} alt={imageAlt} />
      </div>

      {/* Text side */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 leading-snug">
          {heading}
        </h2>
        {body && (
          <div
            className={PROSE}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Text-only section (no image slot) ────────────────────────────────────────
function TextSection({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <div className="py-8 border-b border-slate-100 last:border-0">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 leading-snug">
        {heading}
      </h2>
      {body && (
        <div
          className={PROSE}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
interface ContentBlockRendererProps {
  html: string;
  excerpt?: string | null;
  showFaq?: boolean;
  /** Page slug — used to look up the curated image pool */
  slug: string;
}

export function ContentBlockRenderer({
  html,
  excerpt,
  showFaq = true,
  slug,
}: ContentBlockRendererProps) {
  if (!html?.trim()) {
    if (excerpt) {
      return (
        <p className="text-base text-slate-600 font-medium leading-relaxed border-l-4 border-teal-500 pl-5">
          {excerpt}
        </p>
      );
    }
    return <p className="text-slate-500 italic">Content coming soon.</p>;
  }

  const { intro, contentSections, faqSections } = parseContentSections(html);

  const faqItems: FaqItem[] = faqSections.map((s) => ({
    question: s.heading,
    answer: extractFaqAnswer(s.body),
  }));

  return (
    <div>
      {/* ── Intro prose (before first h2) ──────────────────────────── */}
      {intro && intro.trim() && (
        <div
          className={`${PROSE} mb-8 pb-8 border-b border-slate-100`}
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      )}

      {/* ── Alternating image + text blocks ────────────────────────── */}
      {contentSections.length > 0 && (
        <div>
          {contentSections.map((section, idx) => {
            // Every section gets a curated image — WordPress images ignored
            const { src, alt } = getSectionImage(slug, idx, section.heading);
            const isReverse = idx % 2 === 1;

            // Only render text-only if there's genuinely no heading either
            if (!section.heading) {
              return (
                <TextSection
                  key={section.id}
                  heading={section.heading}
                  body={section.body}
                />
              );
            }

            return (
              <ImageSection
                key={section.id}
                heading={section.heading}
                body={section.body}
                imageUrl={src}
                imageAlt={alt}
                reverse={isReverse}
              />
            );
          })}
        </div>
      )}

      {/* ── FAQ accordion ──────────────────────────────────────────── */}
      {showFaq && faqItems.length > 0 && (
        <div className="-mx-6 sm:-mx-8 lg:-mx-14 mt-8">
          <FaqAccordion
            items={faqItems}
            eyebrow="FAQ"
            title="Frequently Asked Questions"
          />
        </div>
      )}
    </div>
  );
}
