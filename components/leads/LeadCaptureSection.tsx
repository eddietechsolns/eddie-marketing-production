import { LeadForm } from "./LeadForm";

const DEFAULT_BULLETS = [
  "Free initial consultation — no commitment",
  "Senior strategist assigned to your account",
  "Custom strategy tailored to the UAE market",
  "Clear KPIs and performance targets agreed upfront",
  "Multi-channel marketing planning included",
  "Transparent monthly reporting",
  "No long-term lock-in contracts",
  "Response within one business day",
];

interface Props {
  title: string;
  description?: string;
  defaultService?: string;
  submitLabel?: string;
  eyebrow?: string;
  bullets?: string[];
}

export function LeadCaptureSection({
  title,
  description,
  defaultService,
  submitLabel,
  eyebrow = "Start Your Growth",
  bullets = DEFAULT_BULLETS,
}: Props) {
  return (
    <section className="bg-white border-t border-slate-200 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
              {eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
            )}
            <ul className="space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <svg
                    className="w-4 h-4 text-teal-500 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
            <LeadForm defaultService={defaultService} submitLabel={submitLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
