import Link from "next/link";

// ─── Static site sections ──────────────────────────────────────────────────────

const SITE_SECTIONS = [
  {
    icon: "⚙️",
    title: "Our Services",
    desc: "SEO, Google Ads, social media, web design, content marketing & more.",
    href: "/services",
    color: "blue",
  },
  {
    icon: "🏭",
    title: "Industry Expertise",
    desc: "Specialist strategies for healthcare, legal, real estate, e-commerce & more.",
    href: "/industries",
    color: "indigo",
  },
  {
    icon: "📍",
    title: "UAE Locations",
    desc: "Serving Dubai, Abu Dhabi, Sharjah and businesses across the UAE & GCC.",
    href: "/locations",
    color: "teal",
  },
  {
    icon: "📰",
    title: "Marketing Blog",
    desc: "Insights, guides, and trends in digital marketing for UAE businesses.",
    href: "/blog",
    color: "orange",
  },
  {
    icon: "📊",
    title: "Case Studies",
    desc: "Real results with real numbers — see how we grow UAE businesses.",
    href: "/case-studies",
    color: "green",
  },
  {
    icon: "🖼️",
    title: "Portfolio",
    desc: "Browse our design, development, and campaign work for UAE clients.",
    href: "/portfolio",
    color: "purple",
  },
  {
    icon: "🛠️",
    title: "Free Tools",
    desc: "12 free marketing calculators and generators — no sign-up required.",
    href: "/tools",
    color: "pink",
  },
  {
    icon: "🎓",
    title: "Marketing Academy",
    desc: "In-depth guides on SEO, Google Ads, analytics, and more — all free.",
    href: "/academy",
    color: "amber",
  },
] as const;

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-600",   border: "border-teal-200" },
  orange: { bg: "bg-teal-50",   text: "text-teal-600",   border: "border-teal-200"   },
  green:  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-600",   border: "border-pink-200" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200" },
};

interface ExploreMoreSectionProps {
  eyebrow?: string;
  title?: string;
  exclude?: string[];
}

export function ExploreMoreSection({
  eyebrow = "Keep Exploring",
  title = "Everything You Need to Grow Your Business",
  exclude = [],
}: ExploreMoreSectionProps) {
  const sections = SITE_SECTIONS.filter((s) => !exclude.includes(s.href));

  return (
    <section className="py-14 md:py-18 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
            {eyebrow}
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {sections.map((section) => {
            const colors = COLOR_MAP[section.color];
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`group flex flex-col gap-3 p-4 rounded-xl border bg-white ${colors.border} hover:shadow-md hover:border-opacity-70 transition-all duration-200`}
              >
                <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                  {section.icon}
                </div>
                <div>
                  <p className={`text-sm font-bold text-slate-800 group-hover:${colors.text} transition-colors mb-1 leading-snug`}>
                    {section.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {section.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
