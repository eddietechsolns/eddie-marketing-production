"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const VALID_CURRENCIES = ["USD", "AED", "EUR", "GBP", "SAR", "QAR", "KWD", "BHD", "OMR"];

export async function updateLead(id: number, formData: FormData) {
  const priorityRaw = formData.get("priority") as string | null;
  const expectedValueRaw = formData.get("expectedValue") as string | null;
  const currencyRaw = formData.get("currency") as string | null;
  const assignedToRaw = formData.get("assignedTo") as string | null;
  const nextFollowUpRaw = formData.get("nextFollowUpAt") as string | null;

  const priority = priorityRaw && VALID_PRIORITIES.includes(priorityRaw) ? priorityRaw : null;
  const expectedValue = expectedValueRaw ? parseFloat(expectedValueRaw) || null : null;
  const currency = currencyRaw && VALID_CURRENCIES.includes(currencyRaw) ? currencyRaw : "USD";
  const assignedTo = assignedToRaw?.trim() || null;
  const nextFollowUpAt = nextFollowUpRaw ? new Date(nextFollowUpRaw) : null;

  const old = await prisma.lead.findUnique({
    where: { id },
    select: { priority: true, assignedTo: true, nextFollowUpAt: true },
  });
  if (!old) return;

  await prisma.lead.update({
    where: { id },
    data: { priority, expectedValue, currency, assignedTo, nextFollowUpAt },
  });

  const events: { leadId: number; eventType: string; eventText: string }[] = [];

  if (old.priority !== priority && priority) {
    events.push({
      leadId: id,
      eventType: "Priority Changed",
      eventText: `Priority set to ${priority}`,
    });
  }
  if (old.assignedTo !== assignedTo && assignedTo) {
    events.push({
      leadId: id,
      eventType: "Lead Assigned",
      eventText: `Assigned to ${assignedTo}`,
    });
  }
  if (nextFollowUpAt) {
    const formatted = nextFollowUpAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    events.push({
      leadId: id,
      eventType: "Follow-up Scheduled",
      eventText: `Next follow-up scheduled for ${formatted}`,
    });
  }

  if (events.length > 0) {
    await prisma.leadTimeline.createMany({ data: events });
  }

  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
}
