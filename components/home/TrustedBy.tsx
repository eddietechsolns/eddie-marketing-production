const TRUST_ITEMS = [
  {
    title: "UAE-Based Team",
    description:
      "Our team operates within the UAE market, with direct knowledge of local business culture, search behaviour, and consumer trends.",
    accent: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Transparent Reporting",
    description:
      "Every campaign comes with clear, jargon-free reporting. You always know what we are doing, why we are doing it, and what results it is producing.",
    accent: "orange",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Performance-Focused",
    description:
      "We optimise for business outcomes — qualified leads, revenue, and ROI — not vanity metrics like impressions and follower counts.",
    accent: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "SEO & PPC Specialists",
    description:
      "Deep expertise in organic search and paid media — from technical SEO and content strategy to Google Ads and Meta advertising.",
    accent: "orange",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: "Multi-Industry Experience",
    description:
      "We have worked across real estate, healthcare, technology, hospitality, e-commerce, and professional services in the UAE and GCC.",
    accent: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Dedicated Support",
    description:
      "A senior strategist assigned to your account — not a junior account manager — who knows your business and is reachable when you need answers.",
    accent: "orange",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function TrustedBy() {
  return (
    <section className="bg-white border-b border-slate-100 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            Our Difference
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            What Sets Us Apart
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            We work with ambitious businesses across UAE, GCC, and Europe who
            want measurable results from their digital marketing investment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="group flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-100 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                  item.accent === "orange"
                    ? "bg-teal-50 text-teal-600 group-hover:bg-teal-100"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                }`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
