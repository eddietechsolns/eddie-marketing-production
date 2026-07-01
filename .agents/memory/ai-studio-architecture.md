---
name: AI Publishing Studio architecture
description: Architecture decisions for the AI Publishing Studio extension of the Publishing Centre.
---

## Files

- `lib/ai-studio/types.ts` — GeneratedArticle, ArticleSection, FAQItem, RegeneratableSection, etc.
- `lib/ai-studio/provider.ts` — LLMProvider interface + createOpenAICompatibleProvider factory + getDefaultProvider()
- `lib/ai-studio/prompts.ts` — buildSystemPrompt, buildFullArticlePrompt, buildSectionRegeneratePrompt
- `app/api/admin/ai-studio/generate/route.ts` — POST: full article OR single section; JSON mode; auth guarded
- `app/api/admin/ai-studio/save-draft/route.ts` — POST: assembles HTML from structured article, creates BlogPost (status=draft), returns {id, slug}
- `components/admin/AIPublishingStudio.tsx` — full-screen modal; phases: idle → generating → complete/error; tabs: Content/SEO/Social/Technical; per-section regenerate; footer "Open in Rich Text Editor" button
- `components/admin/PublishingCentreWidget.tsx` — "use client" wrapper; blog/academy types → opens studio; other types → original Link href

## Key decisions

**Why server→client split via PublishingCentreWidget:**
Admin dashboard page.tsx is a Server Component. `topRecs: ScoredRecommendation[]` is plain serialisable data, so it can be passed as a prop to a "use client" child without issues.

**Why save-draft + redirect instead of embedding RichTextEditor in modal:**
RichTextEditor (TipTap) is complex to control programmatically in a portal. The save-draft → redirect pattern reuses the existing `/admin/posts/[id]` edit page which already has the full editor experience.

**Never auto-publishes:**
Draft is always `status: "draft"`. User must manually change status to "published" in the editor.

**LLM provider selection:**
Prefers AI_INTEGRATIONS_OPENAI_BASE_URL proxy (Replit-provisioned, no user API key cost). Falls back to direct OPENAI_API_KEY. Model: gpt-4o through either path. To add Anthropic/Gemini, implement LLMProvider interface in provider.ts and wire in getDefaultProvider().

**Section regeneration:**
Same `/api/admin/ai-studio/generate` endpoint; body includes `{ recommendation, existingArticle, section }`. Returns `{ section, data }` where data shape depends on section type. Client merges only the changed section into article state.

**Slug collision guard:**
save-draft route checks for existing slug before creating; appends `-draft-<timestamp36>` if conflict.
