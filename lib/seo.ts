import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://eddietechsolns.com";
export const SITE_NAME = "Eddie Marketing Solutions FZE";
export const DEFAULT_DESCRIPTION =
  "Full-service digital marketing agency specializing in SEO, Google Ads, social media, and web design.";

interface BuildMetadataOptions {
  title?: string | null;
  description?: string | null;
  path: string;
  ogImage?: string | null;
  ogType?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  ogType = "website",
  publishedTime,
  authors,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const pageTitle = title ?? SITE_NAME;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const resolvedDesc = description ?? DEFAULT_DESCRIPTION;
  const ogImageUrl =
    ogImage ??
    `/og?title=${encodeURIComponent(pageTitle)}&desc=${encodeURIComponent(resolvedDesc)}`;

  return {
    title: pageTitle,
    description: resolvedDesc,
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: resolvedDesc,
      url: path,
      siteName: SITE_NAME,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: fullTitle }],
      type: ogType,
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
      ...(authors?.length ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDesc,
      images: [ogImageUrl],
    },
  };
}
