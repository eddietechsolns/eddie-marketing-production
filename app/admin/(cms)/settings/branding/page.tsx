import { prisma } from "@/lib/prisma";
import { BrandingSettingsForm } from "@/components/admin/BrandingSettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Branding Settings | Admin" };

export default async function BrandingSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Branding Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure logo URLs and favicon. Enter a public path (e.g. <code className="font-mono text-xs bg-slate-100 px-1 rounded">/brand/ems-logo.svg</code>) or a full HTTPS URL.
        </p>
      </div>
      <BrandingSettingsForm
        initialValues={{
          headerLogoUrl: settings?.headerLogoUrl,
          footerLogoUrl: settings?.footerLogoUrl,
          faviconUrl: settings?.faviconUrl,
        }}
      />
    </div>
  );
}
