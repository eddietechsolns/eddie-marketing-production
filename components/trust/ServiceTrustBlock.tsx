interface ServiceValues {
  heading: string;
  points: string[];
}

const SERVICE_VALUES: Record<string, ServiceValues> = {
  seo: {
    heading: "What SEO Clients Value Most",
    points: [
      "Long-term organic growth that compounds over time",
      "Better search visibility for high-intent queries",
      "Qualified traffic that converts into real leads",
    ],
  },
  "paid-search": {
    heading: "What Google Ads Clients Value Most",
    points: [
      "Faster lead generation from day one",
      "Measurable ROI with clear attribution",
      "Full campaign transparency and no hidden fees",
    ],
  },
  "web-design": {
    heading: "What Web Design Clients Value Most",
    points: [
      "Better conversion rates from existing traffic",
      "Faster, mobile-ready websites visitors trust",
      "Improved user experience that reduces bounce rate",
    ],
  },
  "web-development": {
    heading: "What Web Development Clients Value Most",
    points: [
      "Reliable, scalable builds that perform under load",
      "Clean code with fast, predictable delivery",
      "Ongoing support after launch",
    ],
  },
  "social-media": {
    heading: "What Social Media Clients Value Most",
    points: [
      "Consistent brand presence across platforms",
      "Engaged audiences that grow over time",
      "Content that builds trust and drives enquiries",
    ],
  },
  "email-marketing": {
    heading: "What Email Marketing Clients Value Most",
    points: [
      "Personalised campaigns that feel relevant",
      "High open and click-through rates",
      "Automation that saves time without losing quality",
    ],
  },
};

const DEFAULT_VALUES: ServiceValues = {
  heading: "What Our Clients Value Most",
  points: [
    "Clear communication at every stage",
    "Measurable results tied to business goals",
    "UAE market expertise built over years",
  ],
};

interface Props {
  serviceSlug: string;
}

export function ServiceTrustBlock({ serviceSlug }: Props) {
  const config = SERVICE_VALUES[serviceSlug] ?? DEFAULT_VALUES;

  return (
    <div className="mt-14 pt-10 border-t border-slate-200">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
        Client Perspective
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{config.heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {config.points.map((point) => (
          <div
            key={point}
            className="flex items-start gap-3 p-5 bg-teal-50 border border-teal-100 rounded-xl"
          >
            <svg
              className="w-5 h-5 text-teal-600 shrink-0 mt-0.5"
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
            <span className="text-sm font-medium text-slate-800 leading-relaxed">
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
