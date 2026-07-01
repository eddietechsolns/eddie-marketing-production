import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDefaultProvider } from "@/lib/ai-studio/provider";
import {
  buildSystemPrompt,
  buildFullArticlePrompt,
  buildSectionRegeneratePrompt,
} from "@/lib/ai-studio/prompts";
import type { GeneratedArticle, RegeneratableSection } from "@/lib/ai-studio/types";
import type { ScoredRecommendation } from "@/lib/content-gap-engine";

interface GenerateRequest {
  recommendation: ScoredRecommendation;
  existingArticle?: GeneratedArticle;
  section?: RegeneratableSection;
  instruction?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as GenerateRequest;
    const { recommendation, existingArticle, section, instruction } = body;

    if (!recommendation?.title) {
      return NextResponse.json(
        { error: "Missing recommendation" },
        { status: 400 }
      );
    }

    const provider = getDefaultProvider();
    const systemPrompt = buildSystemPrompt();

    // ── Section regeneration ─────────────────────────────────────────────────
    if (section && existingArticle) {
      const userPrompt = buildSectionRegeneratePrompt(
        recommendation,
        section,
        existingArticle,
        instruction
      );

      const raw = await provider.complete(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        { jsonMode: true, temperature: 0.8, maxTokens: 1500 }
      );

      const data = JSON.parse(raw) as Record<string, unknown>;
      return NextResponse.json({ section, data });
    }

    // ── Full article generation ───────────────────────────────────────────────
    const userPrompt = buildFullArticlePrompt(recommendation);

    const raw = await provider.complete(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { jsonMode: true, temperature: 0.75, maxTokens: 6000 }
    );

    const article = JSON.parse(raw) as GeneratedArticle;

    // Basic shape validation
    if (!article.seoTitle || !article.sections || !Array.isArray(article.sections)) {
      return NextResponse.json(
        { error: "LLM returned malformed article structure. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ article });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
