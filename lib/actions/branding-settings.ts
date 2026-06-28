"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const schema = z.object({
  headerLogoUrl: z.string().optional(),
  footerLogoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

export type BrandingSettingsState = {
  success?: boolean;
  error?: string;
} | null;

export async function saveBrandingSettings(
  _prev: BrandingSettingsState,
  formData: FormData
): Promise<BrandingSettingsState> {
  function opt(key: string) {
    const v = formData.get(key);
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t || undefined;
  }

  const result = schema.safeParse({
    headerLogoUrl: opt("headerLogoUrl"),
    footerLogoUrl: opt("footerLogoUrl"),
    faviconUrl: opt("faviconUrl"),
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
    revalidatePath("/admin/settings/branding");
    return { success: true };
  } catch {
    return { error: "Failed to save branding settings." };
  }
}
