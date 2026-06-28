import Link from "next/link";


interface Props {
  services: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    category: { name: string; slug: string } | null;
  }[];
}

const SERVICE_META: Record<
  string,
  {
    icon: React.ReactNode;
    description: string;
    slug: string;
    label: string;
  }
> = {
  seo: {
    label: "SEO",
    slug: "seo",
    description:
      "Dominate search rankings with technical SEO, content strategy, and authoritative link building.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  "google-ads": {
    label: "Google Ads",
    slug: "google-ads",
    description:
      "Precision paid search campaigns that convert — maximise every dirham of ad spend.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
  },
  "social-media": {
    label: "Social Media",
    slug: "social-media",
    description:
      "Build community, drive engagement, and turn followers into loyal customers.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
  },
  "web-design": {
    label: "Website Development",
    slug: "web-design",
    description:
      "High-performance websites and landing pages engineered for conversions and speed.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  "content-marketing": {
    label: "Content Marketing",
    slug: "content-marketing",
    description:
      "Strategic content that builds authority, drives organic traffic, and converts visitors into leads.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  analytics: {
    label: "Analytics & Reporting",
    slug: "analytics",
    description:
      "Real-time dashboards and in-depth reporting that prove the ROI of every campaign.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
};

const STATIC_SERVICES = Object.entries(SERVICE_META).slice(0, 6);

export default function ServicesGrid({ services }: Props) {
  const hasDbServices = services.length > 0;

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Full-Service Digital Marketing
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            From strategy to execution — every channel, every market, every
            growth stage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hasDbServices
            ? services.map((svc) => {
                const catSlug = svc.category?.slug ?? "";
                const meta = SERVICE_META[catSlug];
                return (
                  <ServiceItem
                    key={svc.id}
                    icon={meta?.icon}
                    title={svc.title}
                    description={svc.excerpt ?? meta?.description ?? ""}
                    href={`/services/${catSlug}/${svc.slug}`}
                  />
                );
              })
            : STATIC_SERVICES.map(([key, meta]) => (
                <ServiceItem
                  key={key}
                  icon={meta.icon}
                  title={meta.label}
                  description={meta.description}
                  href={`/services/${key}`}
                />
              ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all services
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function ServiceItem({
  icon,
  title,
  description,
  href,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1 transform transition-all duration-200 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-200 shrink-0">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">
        {description}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 gap-1">
        Learn more
        <svg
          className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
