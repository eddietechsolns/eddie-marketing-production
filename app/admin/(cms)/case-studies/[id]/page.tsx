import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CaseStudyForm from "@/components/admin/forms/CaseStudyForm";
import { deleteCaseStudy } from "@/lib/actions/case-studies";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCaseStudyPage({ params }: Props) {
  const { id } = await params;
  const caseStudy = await prisma.caseStudy.findUnique({
    where: { id: parseInt(id) },
  });

  if (!caseStudy) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Case Study</h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate max-w-md">
            {caseStudy.title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {caseStudy.status === "published" && (
            <Link
              href={`/case-studies/${caseStudy.slug}`}
              target="_blank"
              className="text-sm text-gray-500 hover:text-green-600 transition-colors"
            >
              View live ↗
            </Link>
          )}
          <form
            action={async () => {
              "use server";
              await deleteCaseStudy(caseStudy.id);
            }}
          >
            <button
              type="submit"
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Metrics summary */}
      {(caseStudy.trafficIncreasePercent ||
        caseStudy.leadIncreasePercent ||
        caseStudy.conversionIncreasePercent ||
        caseStudy.revenueGenerated) && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {caseStudy.trafficIncreasePercent && (
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-700">
                +{caseStudy.trafficIncreasePercent}%
              </p>
              <p className="text-xs text-green-600">Traffic</p>
            </div>
          )}
          {caseStudy.leadIncreasePercent && (
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-700">
                +{caseStudy.leadIncreasePercent}%
              </p>
              <p className="text-xs text-blue-600">Leads</p>
            </div>
          )}
          {caseStudy.conversionIncreasePercent && (
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-orange-700">
                +{caseStudy.conversionIncreasePercent}%
              </p>
              <p className="text-xs text-orange-600">Conversion</p>
            </div>
          )}
          {caseStudy.revenueGenerated && (
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-base font-bold text-purple-700 truncate">
                {caseStudy.revenueGenerated}
              </p>
              <p className="text-xs text-purple-600">Revenue</p>
            </div>
          )}
        </div>
      )}

      <CaseStudyForm caseStudy={caseStudy} />
    </div>
  );
}
