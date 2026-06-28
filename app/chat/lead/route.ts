import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractConversationContext, buildLeadSummary } from "@/lib/chat-knowledge";

interface ChatLeadBody {
  sessionId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatLeadBody;
    const { sessionId, name, email, phone, company, serviceInterest, message } = body;

    if (!sessionId || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Extract conversation context to enrich the lead record
    const ctx = extractConversationContext(session.messages);

    // Build a structured sales summary for the CRM
    const leadSummary = buildLeadSummary(ctx, session.messages, sessionId);

    // Resolve service interest: form value takes priority, then extracted services
    const resolvedService =
      serviceInterest?.trim() ||
      ctx.services[0] ||
      undefined;

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || undefined,
        // Prefer form company field; fall back to extracted business name
        company: company?.trim() || ctx.businessName || undefined,
        serviceInterest: resolvedService,
        // User's free-text note from the form (keep it; the full summary goes in LeadNote)
        message: message?.trim() || undefined,
        status: "new",
        utmSource: "AI Chat Assistant",
        landingPage: session.landingPage || undefined,
        referrer: session.referrer || undefined,
        utmMedium: session.utmMedium || undefined,
        utmCampaign: session.utmCampaign || undefined,
        priority: "High",
      },
    });

    // Create timeline event
    await prisma.leadTimeline.create({
      data: {
        leadId: lead.id,
        eventType: "Lead Created",
        eventText: [
          `Lead created from AI Chat Assistant`,
          session.landingPage ? `on ${session.landingPage}` : "",
          resolvedService ? `— interested in ${resolvedService}` : "",
          ctx.industry ? `| Industry: ${ctx.industry}` : "",
          ctx.location ? `| Location: ${ctx.location}` : "",
        ]
          .filter(Boolean)
          .join(" "),
      },
    });

    // Create a LeadNote with the full structured conversation summary
    await prisma.leadNote.create({
      data: {
        leadId: lead.id,
        note: leadSummary,
        createdBy: "Eddie AI Assistant",
      },
    });

    // Link session to lead
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { leadId: lead.id },
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (err) {
    console.error("[chat/lead] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
