"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const schema = z.object({
  clientsServed: z.string().optional(),
  retentionRate: z.string().optional(),
  revenueGenerated: z.string().optional(),
  yearsExperience: z.string().optional(),
});

export type StatsSettingsState = {
  success?: boolean;
  error?: string;
} | null;

export async function saveStatsSettings(
  _prev: StatsSettingsState,
  formData: FormData
): Promise<StatsSettingsState> {
  function opt(key: string) {
    const v = formData.get(key);
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t || undefined;
  }

  const result = schema.safeParse({
    clientsServed: opt("clientsServed"),
    retentionRate: opt("retentionRate"),
    revenueGenerated: opt("revenueGenerated"),
    yearsExperience: opt("yearsExperience"),
  });

  if (!result.success) {
    return { error: "Invalid input." };
  }

  try {
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: result.data,
      });
    } else {
      await prisma.siteSettings.create({ data: result.data });
    }
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings/stats");
    return { success: true };
  } catch {
    return { error: "Failed to save stats settings." };
  }
}
