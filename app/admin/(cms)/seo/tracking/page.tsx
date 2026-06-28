import { prisma } from "@/lib/prisma";
import { TrackingSettingsForm } from "@/components/admin/TrackingSettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tracking Settings | Admin" };

export default async function TrackingSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tracking Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure GA4 and Google Ads conversion tracking. Changes apply globally to all public pages on next request.
        </p>
      </div>
      <TrackingSettingsForm
        initialValues={{
          ga4MeasurementId:         settings?.ga4MeasurementId,
          googleAdsConversionId:    settings?.googleAdsConversionId,
          googleAdsConversionLabel: settings?.googleAdsConversionLabel,
        }}
      />
    </div>
  );
}
