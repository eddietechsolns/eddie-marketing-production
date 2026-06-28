import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Full-service digital marketing agency specializing in SEO, Google Ads, social media, and web design.",
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: `/og?title=${encodeURIComponent(SITE_NAME)}`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findFirst().catch(() => null);

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {settings?.faviconUrl && (
          <link rel="icon" href={settings.faviconUrl} />
        )}
      </head>
      <body className="font-sans" suppressHydrationWarning>
        {children}
        <GoogleAnalytics
          ga4Id={settings?.ga4MeasurementId}
          gadsConversionId={settings?.googleAdsConversionId}
          gadsConversionLabel={settings?.googleAdsConversionLabel}
        />
      </body>
    </html>
  );
}
