declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __eddieGads?: { conversionId: string; conversionLabel: string };
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

export interface LeadConversionParams {
  serviceInterest?: string;
  leadId?: number;
  landingPage?: string;
  utmCampaign?: string;
  utmSource?: string;
  expectedValue?: number;
}

export function trackLeadConversion(params: LeadConversionParams): void {
  if (typeof window === "undefined") return;

  trackEvent("lead_submission", {
    service_interest: params.serviceInterest,
    lead_id: params.leadId,
    landing_page: params.landingPage,
    campaign: params.utmCampaign,
    source: params.utmSource,
    value: params.expectedValue,
    currency: "AED",
  });

  const gads = window.__eddieGads;
  if (gads?.conversionId && gads?.conversionLabel && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `AW-${gads.conversionId}/${gads.conversionLabel}`,
      value: params.expectedValue ?? 0,
      currency: "AED",
      transaction_id: params.leadId,
    });
  }
}
