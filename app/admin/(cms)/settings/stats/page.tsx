import { prisma } from "@/lib/prisma";
import { StatsSettingsForm } from "@/components/admin/StatsSettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Homepage Stats | Admin" };

export default async function StatsSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Homepage Statistics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Edit the key stats displayed in the hero and the &ldquo;Numbers Don&apos;t Lie&rdquo; section. Leave any field blank to keep the built-in default value.
        </p>
      </div>
      <StatsSettingsForm
        initialValues={{
          clientsServed: settings?.clientsServed,
          retentionRate: settings?.retentionRate,
          revenueGenerated: settings?.revenueGenerated,
          yearsExperience: settings?.yearsExperience,
        }}
      />
    </div>
  );
}
