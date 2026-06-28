import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
  projects: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    client: string | null;
    industries: { title: string }[];
    services: string[];
  }[];
}

const GRADIENT_PALETTES = [
  "from-blue-600 to-blue-800",
  "from-slate-700 to-slate-900",
  "from-teal-600 to-blue-800",
];

export default function PortfolioGrid({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
                Portfolio
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                Our Work
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Client projects and campaigns across UAE, GCC, and Europe.
              </p>
            </div>
          </div>
          <div className="text-center py-14 bg-white rounded-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Portfolio Coming Soon
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              We are finalising portfolio pages for our client work. In the
              meantime, get in touch to discuss your project.
            </p>
            <Button variant="ghost" size="sm" href="/request-for-a-proposal" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              Start a conversation
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Our Work
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Client campaigns across UAE, GCC, and Europe.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 shrink-0 transition-colors"
          >
            View all projects
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project, i) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
            >
              <div
                className={`h-44 bg-gradient-to-br ${GRADIENT_PALETTES[i % GRADIENT_PALETTES.length]} relative overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg
                    className="w-32 h-32 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                {project.industries[0] && (
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-medium text-white/80 bg-black/20 px-2.5 py-1 rounded-full">
                      {project.industries[0].title}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                  {project.title}
                </h3>
                {project.excerpt && (
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-3">
                    {project.excerpt}
                  </p>
                )}
                {project.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.services.slice(0, 3).map((svc) => (
                      <Badge key={svc} variant="blue" size="sm">
                        {svc}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 gap-1">
                  View project
                  <svg
                    className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform"
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
          ))}
        </div>
      </div>
    </section>
  );
}
