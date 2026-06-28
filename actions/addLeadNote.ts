"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AddLeadNoteState = { success?: boolean; error?: string } | null;

export async function addLeadNote(
  id: number,
  _prev: AddLeadNoteState,
  formData: FormData
): Promise<AddLeadNoteState> {
  const note = (formData.get("note") as string | null)?.trim();
  const createdBy = (formData.get("createdBy") as string | null)?.trim() || "Admin";

  if (!note || note.length < 2) {
    return { error: "Note cannot be empty." };
  }

  try {
    await prisma.leadNote.create({
      data: { leadId: id, note, createdBy },
    });

    await prisma.leadTimeline.create({
      data: {
        leadId: id,
        eventType: "Note Added",
        eventText: `Note: ${note.slice(0, 120)}${note.length > 120 ? "…" : ""}`,
      },
    });

    revalidatePath(`/admin/leads/${id}`);
    return { success: true };
  } catch {
    return { error: "Failed to save note. Please try again." };
  }
}
