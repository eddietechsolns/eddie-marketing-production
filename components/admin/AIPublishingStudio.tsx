"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ScoredRecommendation } from "@/lib/content-gap-engine";
import type {
  GeneratedArticle,
  RegeneratableSection,
  ArticleSection,
} from "@/lib/ai-studio/types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  recommendation: ScoredRecommendation;
  onClose: () => void;
}

// ─── Internal types ───────────────────────────────────────────────────────────

type Phase = "idle" | "generating" | "complete" | "error";
type Tab = "content" | "seo" | "social" | "technical";

// ─── Small helpers ────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : score >= 60
      ? "bg-blue-100 text-blue-700"
      : score >= 40
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      SEO {score}/100
    </span>
  );
}

function RegenerateBtn({
  onClick,
  loading,
  label = "Regenerate",
}: {
  onClick: () => void;
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 disabled:opacity-50 px-2 py-1 rounded-md transition-colors shrink-0"
    >
      {loading ? (
        <span className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>↺</span>
      )}
      {label}
    </button>
  );
}

function SectionCard({
  heading,
  children,
  regenerating,
  onRegenerate,
}: {
  heading: string;
  children: React.ReactNode;
  regenerating: boolean;
  onRegenerate: () => void;
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
          {heading}
        </span>
        <RegenerateBtn onClick={onRegenerate} loading={regenerating} />
      </div>
      <div className="px-4 py-3 text-sm text-slate-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function MetaRow({ label, value, chars }: { label: string; value: string; chars?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        {chars && (
          <span className={`text-[10px] ${value.length > 160 ? "text-red-500" : "text-slate-400"}`}>
            {value.length} chars
          </span>
        )}
      </div>
      <p className="text-sm text-slate-800 leading-relaxed">{value}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AIPublishingStudio({ recommendation, onClose }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Generate full article ─────────────────────────────────────────────────
  const generate = useCallback(async () => {
    setPhase("generating");
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendation }),
      });
      const data = (await res.json()) as { article?: GeneratedArticle; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Generation failed");
      setArticle(data.article!);
      setPhase("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPhase("error");
    }
  }, [recommendation]);

  // ── Regenerate a single section ───────────────────────────────────────────
  const regenerateSection = useCallback(
    async (section: RegeneratableSection) => {
      if (!article) return;
      setRegenerating(section);
      try {
        const res = await fetch("/api/admin/ai-studio/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recommendation, existingArticle: article, section }),
        });
        const result = (await res.json()) as { data?: Record<string, unknown>; error?: string };
        if (!res.ok || result.error) throw new Error(result.error ?? "Regeneration failed");

        const d = result.data ?? {};
        setArticle((prev) => {
          if (!prev) return prev;
          if (section === "introduction") return { ...prev, introduction: d.introduction as string };
          if (section === "faq") return { ...prev, faq: d.faq as GeneratedArticle["faq"] };
          if (section === "conclusion") return { ...prev, conclusion: d.conclusion as string };
          if (section === "callToAction") return { ...prev, callToAction: d.callToAction as string };
          if (section === "seoMeta") return { ...prev, ...(d as Partial<GeneratedArticle>) };
          if (section === "ogMeta") return { ...prev, ...(d as Partial<GeneratedArticle>) };
          if (section.startsWith("section-")) {
            const idx = parseInt(section.replace("section-", ""), 10);
            const newSections = [...prev.sections];
            newSections[idx] = d.section as ArticleSection;
            return { ...prev, sections: newSections };
          }
          return prev;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Regeneration failed");
        setTimeout(() => setError(null), 5000);
      } finally {
        setRegenerating(null);
      }
    },
    [article, recommendation]
  );

  // ── Save draft and navigate to editor ────────────────────────────────────
  const saveAsDraft = useCallback(async () => {
    if (!article) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-studio/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article, recommendation }),
      });
      const data = (await res.json()) as { id?: number; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Save failed");
      onClose();
      router.push(`/admin/posts/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [article, recommendation, onClose, router]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const typeColors: Record<string, string> = {
    blog: "bg-orange-100 text-orange-700",
    "case-study": "bg-violet-100 text-violet-700",
    portfolio: "bg-teal-100 text-teal-700",
    tool: "bg-blue-100 text-blue-700",
    academy: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 m-3 md:m-6 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-48px)]">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-4 px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                ✦ AI Publishing Studio
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeColors[recommendation.contentType] ?? "bg-slate-100 text-slate-600"}`}>
                {recommendation.contentType}
              </span>
              <span className="text-[10px] opacity-70">{recommendation.clusterName}</span>
            </div>
            <h2 className="text-base font-bold leading-tight truncate">{recommendation.title}</h2>
            <p className="text-xs opacity-75 mt-0.5 truncate">{recommendation.reason}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {article && (
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{Math.round(recommendation.priorityScore)}<span className="opacity-60 font-normal">/100 priority</span></p>
                <p className="text-[10px] opacity-60">{recommendation.clusterType}</p>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              aria-label="Close studio"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto">

          {/* IDLE — launch screen */}
          {phase === "idle" && (
            <div className="flex flex-col items-center justify-center gap-6 p-10 min-h-[400px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-3xl">
                ✦
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Generate full article</h3>
                <p className="text-sm text-slate-500 max-w-md">
                  The AI will write a <strong>1,800–2,400 word</strong> SEO-optimised article with
                  all metadata, schema, FAQ, internal links, and social tags — ready for your review
                  before publishing.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-slate-500 max-w-sm w-full">
                {[
                  ["📝", "1,800–2,400 words"],
                  ["🔍", "Full SEO metadata"],
                  ["🔗", "Internal + external links"],
                  ["❓", "5-question FAQ"],
                  ["📱", "OG + Twitter cards"],
                  ["🏷️", "Article JSON-LD"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl px-3 py-2">
                    <span className="text-lg">{icon}</span>
                    <span className="leading-tight text-center">{label}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={generate}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-violet-200"
              >
                ✦ Generate Article
              </button>
            </div>
          )}

          {/* GENERATING */}
          {phase === "generating" && (
            <div className="flex flex-col items-center justify-center gap-6 p-10 min-h-[400px] text-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-xl">✦</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Writing your article…</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Generating 2,000+ words of SEO-optimised content, metadata, links, FAQ, and schema.
                  This usually takes 15–30 seconds.
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                {["Researching keywords", "Writing sections", "Building schema"].map((step, i) => (
                  <span
                    key={step}
                    className="text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-700 font-medium"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ERROR */}
          {phase === "error" && (
            <div className="flex flex-col items-center justify-center gap-4 p-10 min-h-[300px] text-center">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">⚠</div>
              <div>
                <h3 className="font-bold text-red-700 mb-1">Generation failed</h3>
                <p className="text-sm text-slate-500 max-w-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={generate}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* COMPLETE — tabbed review */}
          {phase === "complete" && article && (
            <div className="flex flex-col">

              {/* Tab bar */}
              <div className="flex gap-0 border-b border-slate-200 px-5 bg-white shrink-0">
                {(
                  [
                    { id: "content" as Tab, label: "Content", icon: "📝" },
                    { id: "seo" as Tab, label: "SEO", icon: "🔍" },
                    { id: "social" as Tab, label: "Social", icon: "📱" },
                    { id: "technical" as Tab, label: "Technical", icon: "⚙️" },
                  ] as { id: Tab; label: string; icon: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === tab.id
                        ? "border-violet-600 text-violet-700"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
                <div className="ml-auto flex items-center">
                  <ScoreBadge score={article.seoScore ?? 0} />
                </div>
              </div>

              {/* Inline error toast */}
              {error && (
                <div className="mx-5 mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                  <span>⚠</span> {error}
                  <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </div>
              )}

              {/* ── Content tab ──────────────────────────────────────── */}
              {activeTab === "content" && (
                <div className="p-5 space-y-4">
                  {/* Introduction */}
                  <SectionCard
                    heading="Introduction"
                    regenerating={regenerating === "introduction"}
                    onRegenerate={() => regenerateSection("introduction")}
                  >
                    <p className="whitespace-pre-wrap">{article.introduction}</p>
                  </SectionCard>

                  {/* Body sections */}
                  {article.sections.map((section, idx) => (
                    <SectionCard
                      key={idx}
                      heading={`H2: ${section.heading}`}
                      regenerating={regenerating === `section-${idx}`}
                      onRegenerate={() => regenerateSection(`section-${idx}` as RegeneratableSection)}
                    >
                      <p className="whitespace-pre-wrap">{section.content}</p>
                      {section.subsections?.map((sub, si) => (
                        <div key={si} className="mt-3 pl-3 border-l-2 border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 mb-1">H3: {sub.heading}</p>
                          <p className="whitespace-pre-wrap text-sm">{sub.content}</p>
                        </div>
                      ))}
                    </SectionCard>
                  ))}

                  {/* FAQ */}
                  <SectionCard
                    heading="FAQ (5 Questions)"
                    regenerating={regenerating === "faq"}
                    onRegenerate={() => regenerateSection("faq")}
                  >
                    <div className="space-y-3">
                      {article.faq?.map((item, i) => (
                        <div key={i}>
                          <p className="font-semibold text-slate-800">Q: {item.question}</p>
                          <p className="text-slate-600 mt-0.5">A: {item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  {/* Conclusion */}
                  <SectionCard
                    heading="Conclusion"
                    regenerating={regenerating === "conclusion"}
                    onRegenerate={() => regenerateSection("conclusion")}
                  >
                    <p className="whitespace-pre-wrap">{article.conclusion}</p>
                  </SectionCard>

                  {/* CTA */}
                  <SectionCard
                    heading="Call to Action"
                    regenerating={regenerating === "callToAction"}
                    onRegenerate={() => regenerateSection("callToAction")}
                  >
                    <p className="font-medium">{article.callToAction}</p>
                  </SectionCard>
                </div>
              )}

              {/* ── SEO tab ──────────────────────────────────────────── */}
              {activeTab === "seo" && (
                <div className="p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">SEO Metadata</h3>
                    <RegenerateBtn
                      onClick={() => regenerateSection("seoMeta")}
                      loading={regenerating === "seoMeta"}
                      label="Regenerate all SEO"
                    />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {[
                      { label: "SEO Title", value: article.seoTitle, chars: true },
                      { label: "Meta Description", value: article.metaDescription, chars: true },
                      { label: "Focus Keyword", value: article.focusKeyword },
                      { label: "URL Slug", value: article.urlSlug },
                    ].map((row) => (
                      <div key={row.label} className="px-4 py-3">
                        <MetaRow label={row.label} value={row.value ?? ""} chars={row.chars} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Secondary Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {article.secondaryKeywords?.map((kw, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Internal Links</h4>
                      <div className="space-y-2">
                        {article.internalLinks?.map((link, i) => (
                          <div key={i} className="bg-slate-50 rounded-lg px-3 py-2">
                            <p className="text-xs font-medium text-slate-700">→ {link.anchorText}</p>
                            <p className="text-[11px] text-violet-600">{link.url}</p>
                            <p className="text-[11px] text-slate-400">{link.context}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">External Authority Links</h4>
                      <div className="space-y-2">
                        {article.externalLinks?.map((link, i) => (
                          <div key={i} className="bg-slate-50 rounded-lg px-3 py-2">
                            <p className="text-xs font-medium text-slate-700">→ {link.anchorText}</p>
                            <p className="text-[11px] text-blue-600 truncate">{link.domain}</p>
                            <p className="text-[11px] text-slate-400">{link.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Article Outline</h4>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-1">
                      {article.outline?.map((item, i) => (
                        <p key={i} className={`text-xs ${item.level === "h2" ? "font-semibold text-slate-700" : "text-slate-500 pl-4"}`}>
                          {item.level === "h2" ? "▸" : "◦"} {item.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Social tab ───────────────────────────────────────── */}
              {activeTab === "social" && (
                <div className="p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Social & OG Tags</h3>
                    <RegenerateBtn
                      onClick={() => regenerateSection("ogMeta")}
                      loading={regenerating === "ogMeta"}
                      label="Regenerate all social"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Open Graph</h4>
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                      <div className="px-4 py-3">
                        <MetaRow label="OG Title" value={article.ogTitle ?? ""} chars />
                      </div>
                      <div className="px-4 py-3">
                        <MetaRow label="OG Description" value={article.ogDescription ?? ""} chars />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Twitter Card</h4>
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                      <div className="px-4 py-3">
                        <MetaRow label="Title" value={article.twitterCard?.title ?? ""} />
                      </div>
                      <div className="px-4 py-3">
                        <MetaRow label="Description" value={article.twitterCard?.description ?? ""} chars />
                      </div>
                      <div className="px-4 py-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Card Type</span>
                        <p className="text-sm text-slate-700 mt-1 font-mono">
                          {article.twitterCard?.type ?? "summary_large_image"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Technical tab ─────────────────────────────────────── */}
              {activeTab === "technical" && (
                <div className="p-5 space-y-5">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Word Count", value: article.wordCount?.toLocaleString() ?? "—", icon: "📝" },
                      { label: "Reading Time", value: `${article.readingTimeMinutes ?? "—"} min`, icon: "⏱" },
                      { label: "SEO Score", value: `${article.seoScore ?? "—"}/100`, icon: "🔍" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50 rounded-xl px-4 py-3 text-center">
                        <div className="text-xl mb-1">{stat.icon}</div>
                        <div className="text-lg font-bold text-slate-800">{stat.value}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Image hints */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Image ALT Texts</h4>
                    <div className="space-y-1.5">
                      {article.imageAltTexts?.map((alt, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700">
                          {i + 1}. {alt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Featured Image Prompt</h4>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600 leading-relaxed italic">
                      {article.featuredImagePrompt}
                    </div>
                  </div>

                  {/* JSON-LD */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Article JSON-LD Schema</h4>
                    <div className="bg-slate-900 rounded-xl px-4 py-3 overflow-auto max-h-64">
                      <pre className="text-xs text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap">
                        {JSON.stringify(article.jsonLdSchema, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            {phase === "complete" && article && (
              <>
                <span className="text-xs text-slate-400">
                  ~{article.wordCount?.toLocaleString()} words · {article.readingTimeMinutes} min read
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {phase === "complete" && (
              <button
                type="button"
                onClick={generate}
                disabled={!!regenerating || saving}
                className="text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                ↺ Regenerate all
              </button>
            )}

            {phase === "complete" && (
              <button
                type="button"
                onClick={saveAsDraft}
                disabled={saving || !!regenerating}
                className="inline-flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-violet-200"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>→</span>
                )}
                {saving ? "Saving…" : "Open in Rich Text Editor"}
              </button>
            )}

            {(phase === "idle" || phase === "error") && (
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-slate-600 hover:text-slate-800 px-4 py-2 bg-white border border-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
