import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  extractKeywords,
  searchCmsContent,
  buildContextPackage,
  buildRecommendations,
  buildSystemPrompt,
  buildContextBlock,
  buildFallbackFromCms,
  detectHighIntent,
  extractConversationContext,
  buildVisitorProfile,
} from "@/lib/chat-knowledge";

const MAX_HISTORY = 10;

interface ChatRequestBody {
  sessionId?: string;
  visitorId: string;
  message: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const {
      visitorId, message, landingPage, referrer, utmSource, utmMedium, utmCampaign,
    } = body;
    let { sessionId } = body;

    if (!visitorId || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Get or create session ────────────────────────────────────────────────
    let session = sessionId
      ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
      : null;

    if (!session) {
      session = await prisma.chatSession.create({
        data: { visitorId, landingPage, referrer, utmSource, utmMedium, utmCampaign },
      });
      sessionId = session.id;
    }

    // ── Save user message ────────────────────────────────────────────────────
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "user", content: message.trim() },
    });

    // ── Load recent conversation history ─────────────────────────────────────
    const history = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: MAX_HISTORY,
    });

    // ── STEP 1: Extract keywords (message + recent context) ──────────────────
    const recentContext = history
      .slice(-4)
      .map((m) => m.content)
      .join(" ");
    const keywords = extractKeywords(message.trim() + " " + recentContext);

    // ── STEP 2: Search local CMS across all 12 content types ─────────────────
    //    Mandatory before any call to OpenAI.
    const cmsResults = await searchCmsContent(keywords);

    // ── STEP 3: Build context package + visitor profile + recommendations ────
    const contextPackage = buildContextPackage(cmsResults);
    const recommendations = buildRecommendations(cmsResults);

    // Extract structured conversation context from all history messages
    const conversationCtx = extractConversationContext(history);
    const visitorProfile = buildVisitorProfile(conversationCtx);

    // ── STEP 4: Generate response (OpenAI with CMS grounding, or fallback) ───
    let assistantContent: string;
    let trigger: "lead_capture" | "escalate" | undefined;

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        // Four-part message structure:
        // 1. Role + behaviour instructions (no CMS data here)
        // 2. Conversation history (all previous turns)
        // 3. CMS knowledge block — injected as a system message immediately before user turn
        //    so it is the last thing read before generation (hardest to ignore)
        // 4. The user's current message
        const rolePrompt = buildSystemPrompt();
        const contextBlock = buildContextBlock(contextPackage, visitorProfile || undefined);

        const conversationHistory = history
          .slice(0, -1) // exclude the current user message (already added separately)
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

        const openaiMessages: Array<{ role: string; content: string }> = [
          { role: "system", content: rolePrompt },
          ...conversationHistory,
          { role: "system", content: contextBlock },
          { role: "user", content: message.trim() },
        ];

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: openaiMessages,
            max_tokens: 500,
            temperature: 0.6,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 80)}`);
        }

        const data = (await res.json()) as {
          choices: Array<{ message: { content: string } }>;
        };
        const raw = data.choices[0]?.message?.content ?? "";

        if (raw.includes("[LEAD_CAPTURE]")) {
          trigger = "lead_capture";
          assistantContent = raw.replace("[LEAD_CAPTURE]", "").trim();
        } else if (raw.includes("[ESCALATE]")) {
          trigger = "escalate";
          assistantContent = raw.replace("[ESCALATE]", "").trim();
        } else {
          assistantContent = raw;
          // Fallback intent detection from keyword analysis
          if (detectHighIntent(message)) trigger = "lead_capture";
        }
      } catch (openaiErr) {
        console.error("[chat/route] OpenAI error, using CMS fallback:", openaiErr);
        const fb = buildFallbackFromCms(cmsResults, message);
        assistantContent = fb.content;
        trigger = fb.trigger;
      }
    } else {
      // No API key — CMS-powered rules-based fallback
      const fb = buildFallbackFromCms(cmsResults, message);
      assistantContent = fb.content;
      trigger = fb.trigger;
    }

    // ── Save assistant response ──────────────────────────────────────────────
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "assistant", content: assistantContent },
    });

    // ── Update session timestamp ─────────────────────────────────────────────
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      sessionId: session.id,
      message: assistantContent,
      trigger,
      recommendations,
    });
  } catch (err) {
    console.error("[chat/route] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
