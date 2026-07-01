import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { GeneratedArticle } from "@/lib/ai-studio/types";
import type { ScoredRecommendation } from "@/lib/content-gap-engine";

interface SaveDraftRequest {
  article: GeneratedArticle;
  recommendation: ScoredRecommendation;
}

// ─── HTML assembler ───────────────────────────────────────────────────────────
// Converts the structured article JSON into clean TipTap-compatible HTML.

function paragraphise(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, " ").trim()}</p>`)
    .join("\n");
}

function assembleHtml(article: GeneratedArticle): string {
  const parts: string[] = [];

  if (article.introduction) {
    parts.push(paragraphise(article.introduction));
  }

  for (const section of article.sections ?? []) {
    parts.push(`<h2>${section.heading}</h2>`);
    if (section.content) parts.push(paragraphise(section.content));

    for (const sub of section.subsections ?? []) {
      parts.push(`<h3>${sub.heading}</h3>`);
      if (sub.content) parts.push(paragraphise(sub.content));
    }
  }

  if (article.faq?.length) {
    parts.push(`<h2>Frequently Asked Questions</h2>`);
    for (const item of article.faq) {
      parts.push(`<h3>${item.question}</h3>`);
      parts.push(`<p>${item.answer}</p>`);
    }
  }

  if (article.conclusion) {
    parts.push(`<h2>Conclusion</h2>`);
    parts.push(paragraphise(article.conclusion));
  }

  if (article.callToAction) {
    parts.push(`<p><strong>${article.callToAction}</strong></p>`);
  }

  return parts.join("\n");
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as SaveDraftRequest;
    const { article, recommendation } = body;

    if (!article || !recommendation) {
      return NextResponse.json(
        { error: "Missing article or recommendation" },
        { status: 400 }
      );
    }

    const htmlContent = assembleHtml(article);

    // Ensure slug is unique
    let slug = article.urlSlug?.trim() || recommendation.slug;
    const conflict = await prisma.blogPost.findUnique({ where: { slug } });
    if (conflict) {
      slug = `${slug}-draft-${Date.now().toString(36)}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title: article.seoTitle || recommendation.title,
        slug,
        excerpt: article.metaDescription || null,
        content: htmlContent,
        status: "draft",
        seoTitle: article.seoTitle || null,
        seoDescription: article.metaDescription || null,
        ogTitle: article.ogTitle || null,
        ogDescription: article.ogDescription || null,
      },
      select: { id: true, slug: true },
    });

    return NextResponse.json({ id: post.id, slug: post.slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save draft";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
