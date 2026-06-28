interface Reason {
  title: string;
  description: string;
}

const REASONS: Reason[] = [
  {
    title: "Local Market Knowledge",
    description:
      "We understand the UAE competitive landscape, seasonal patterns, and buyer behaviour unique to each emirate.",
  },
  {
    title: "Arabic & English Campaigns",
    description:
      "Bilingual strategy that reaches both Arabic-speaking and English-speaking audiences across all channels.",
  },
  {
    title: "UAE Regulatory Compliance",
    description:
      "Campaigns built to comply with UAE advertising regulations and platform policies from day one.",
  },
  {
    title: "Proven Local Results",
    description:
      "Consistent performance across clients in Dubai, Abu Dhabi, Sharjah, Ajman, and the wider UAE.",
  },
];

interface Props {
  city: string;
}

export function LocationTrustBlock({ city }: Props) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] ems-gradient-text mb-2">
        Why Choose Us
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Why Businesses in {city} Work With Us
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REASONS.map((reason) => (
          <div
            key={reason.title}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                {reason.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-10">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
