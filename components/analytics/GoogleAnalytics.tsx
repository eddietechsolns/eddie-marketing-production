"use client";

import Script from "next/script";

interface Props {
  ga4Id?: string | null;
  gadsConversionId?: string | null;
  gadsConversionLabel?: string | null;
}

export function GoogleAnalytics({ ga4Id, gadsConversionId, gadsConversionLabel }: Props) {
  if (!ga4Id) return null;

  const initScript = [
    `window.dataLayer = window.dataLayer || [];`,
    `function gtag(){dataLayer.push(arguments);}`,
    `gtag('js', new Date());`,
    `gtag('config', '${ga4Id}', { send_page_view: true });`,
    gadsConversionId ? `gtag('config', 'AW-${gadsConversionId}');` : "",
    `window.__eddieGads = { conversionId: '${gadsConversionId ?? ""}', conversionLabel: '${gadsConversionLabel ?? ""}' };`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {initScript}
      </Script>
    </>
  );
}
