"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const schema = z.object({
  ga4MeasurementId:         z.string().optional(),
  googleAdsConversionId:    z.string().optional(),
  googleAdsConversionLabel: z.string().optional(),
});

export type TrackingSettingsState = {
  success?: boolean;
  error?: string;
} | null;

export async function saveTrackingSettings(
  _prev: TrackingSettingsState,
  formData: FormData
): Promise<TrackingSettingsState> {
  function opt(key: string) {
    const v = formData.get(key);
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t || undefined;
  }

  const result = schema.safeParse({
    ga4MeasurementId:         opt("ga4MeasurementId"),
    googleAdsConversionId:    opt("googleAdsConversionId"),
    googleAdsConversionLabel: opt("googleAdsConversionLabel"),
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
    revalidatePath("/admin/seo/tracking");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to save settings." };
  }
}
