import { prisma } from "@/lib/prisma";

export async function ClientResultsStrip() {
  const [caseStudyCount, industryCount, serviceCount] = await Promise.all([
    prisma.caseStudy.count({ where: { status: "published" } }),
    prisma.industry.count({ where: { status: "published" } }),
    prisma.serviceCategory.count({ where: { status: "published" } }),
  ]);

  const metrics = [
    { value: caseStudyCount.toString(), label: "Case Studies Published" },
    { value: industryCount.toString(), label: "Industries Served" },
    { value: serviceCount.toString(), label: "Services Delivered" },
  ];

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {metrics.map((m) => (
            <div key={m.label} className="text-center px-4 first:pl-0 last:pr-0">
              <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {m.value}
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
