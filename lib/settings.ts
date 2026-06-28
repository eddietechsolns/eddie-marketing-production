import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type PublicSettings = {
  ga4MeasurementId?: string | null;
  googleAdsConversionId?: string | null;
  googleAdsConversionLabel?: string | null;
  headerLogoUrl?: string | null;
  footerLogoUrl?: string | null;
  faviconUrl?: string | null;
  clientsServed?: string | null;
  retentionRate?: string | null;
  revenueGenerated?: string | null;
  yearsExperience?: string | null;
};

export const getSiteSettings = cache(
  async (): Promise<PublicSettings> => {
    const s = await prisma.siteSettings.findFirst().catch(() => null);
    return s ?? {};
  }
);
