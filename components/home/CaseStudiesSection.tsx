import Link from "next/link";
import Button from "@/components/ui/Button";

interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  clientName: string | null;
  industry: string | null;
  serviceType: string | null;
  trafficIncreasePercent: number | null;
  leadIncreasePercent: number | null;
  conversionIncreasePercent: number | null;
  revenueGenerated: string | null;
}

interface Props {
  caseStudies: CaseStudy[];
}

const COLORS = [
  { gradient: "from-blue-600 to-blue-800", metric: "text-teal-300" },
  { gradient: "from-slate-700 to-slate-900", metric: "text-blue-400" },
  { gradient: "from-teal-600 to-blue-800", metric: "text-white" },
];

function EmptyState() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Case Studies
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Client Results — Coming Soon
          </h2>
          <p className="text-base text-slate-600 leading-relaxed mb-8">
            We are preparing detailed case studies with verified results from
            our client campaigns. In the meantime, contact us to discuss your
            specific goals and we will share relevant examples from our
            experience.
          </p>
          <Button variant="primary" size="md" href="/request-for-a-proposal">
            Discuss Your Goals
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function CaseStudiesSection({ caseStudies }: Props) {
  if (caseStudies.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
              Success Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Proven Results for Real Businesses
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              No vanity metrics. No inflated numbers. Just real campaigns,
              measurable outcomes, and happy clients.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 shrink-0 transition-colors"
          >
            All case studies
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.slice(0, 3).map((cs, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.slug}`}
                className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
              >
                <div
                  className={`h-40 bg-gradient-to-br ${color.gradient} relative p-5 flex flex-col justify-between`}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {cs.industry && (
                      <span className="text-xs font-medium text-white/80 bg-black/20 px-2.5 py-1 rounded-full">
                        {cs.industry}
                      </span>
                    )}
                    {cs.serviceType && (
                      <span className="text-xs font-medium text-white/80 bg-black/20 px-2.5 py-1 rounded-full">
                        {cs.serviceType}
                      </span>
                    )}
                  </div>
                  <div>
                    {cs.trafficIncreasePercent && (
                      <p className={`text-3xl font-bold ${color.metric}`}>
                        +{cs.trafficIncreasePercent}%
                        <span className="text-sm font-normal text-white/70 ml-1">
                          traffic
                        </span>
                      </p>
                    )}
                    {!cs.trafficIncreasePercent && cs.revenueGenerated && (
                      <p className={`text-2xl font-bold ${color.metric}`}>
                        {cs.revenueGenerated}
                        <span className="text-sm font-normal text-white/70 ml-1">
                          revenue
                        </span>
                      </p>
                    )}
                    {!cs.trafficIncreasePercent &&
                      !cs.revenueGenerated &&
                      cs.leadIncreasePercent && (
                        <p className={`text-3xl font-bold ${color.metric}`}>
                          +{cs.leadIncreasePercent}%
                          <span className="text-sm font-normal text-white/70 ml-1">
                            leads
                          </span>
                        </p>
                      )}
                  </div>
                </div>

                {(cs.leadIncreasePercent ||
                  cs.conversionIncreasePercent ||
                  cs.revenueGenerated) && (
                  <div className="flex divide-x divide-slate-100 border-b border-slate-100 bg-slate-50">
                    {cs.leadIncreasePercent && cs.trafficIncreasePercent && (
                      <div className="flex-1 py-2 text-center">
                        <p className="text-xs font-bold text-blue-600">
                          +{cs.leadIncreasePercent}%
                        </p>
                        <p className="text-[10px] text-slate-500">Leads</p>
                      </div>
                    )}
                    {cs.conversionIncreasePercent && (
                      <div className="flex-1 py-2 text-center">
                        <p className="text-xs font-bold text-emerald-600">
                          +{cs.conversionIncreasePercent}%
                        </p>
                        <p className="text-[10px] text-slate-500">Conversion</p>
                      </div>
                    )}
                    {cs.revenueGenerated && cs.trafficIncreasePercent && (
                      <div className="flex-1 py-2 text-center">
                        <p className="text-xs font-bold text-violet-600 truncate px-1">
                          {cs.revenueGenerated}
                        </p>
                        <p className="text-[10px] text-slate-500">Revenue</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1 bg-white">
                  {cs.clientName && (
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                      {cs.clientName}
                    </p>
                  )}
                  <h3 className="text-base font-semibold text-slate-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {cs.title}
                  </h3>
                  <div className="mt-auto flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 gap-1">
                    Read case study
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
