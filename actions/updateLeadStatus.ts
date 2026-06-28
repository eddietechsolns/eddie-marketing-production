"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = ["new", "contacted", "qualified", "proposal-sent", "won", "lost"];

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  "proposal-sent": "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export async function updateLeadStatus(id: number, formData: FormData) {
  const status = formData.get("status");
  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) return;

  const old = await prisma.lead.findUnique({ where: { id }, select: { status: true } });
  if (!old || old.status === status) return;

  await prisma.lead.update({ where: { id }, data: { status } });

  await prisma.leadTimeline.create({
    data: {
      leadId: id,
      eventType: "Status Changed",
      eventText: `Status changed from ${STATUS_LABELS[old.status] ?? old.status} → ${STATUS_LABELS[status] ?? status}`,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}
