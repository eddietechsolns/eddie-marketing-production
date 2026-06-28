import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  categories: { name: string }[];
}

interface Props {
  posts: BlogPost[];
}

const STATIC_POSTS = [
  {
    id: -1,
    slug: "seo-for-uae-businesses",
    title: "SEO in 2025: What UAE Businesses Need to Know",
    excerpt:
      "The UAE search landscape is evolving fast. Here's a practical guide to ranking on Google in Dubai and Abu Dhabi in 2025.",
    publishedAt: new Date("2025-03-15"),
    categories: [{ name: "SEO" }],
  },
  {
    id: -2,
    slug: "google-ads-healthcare",
    title: "Google Ads for Healthcare: A Compliance-First Guide",
    excerpt:
      "Running Google Ads in healthcare requires navigating UAE regulations, restricted terms, and patient privacy. This guide covers everything.",
    publishedAt: new Date("2025-02-28"),
    categories: [{ name: "Google Ads" }],
  },
  {
    id: -3,
    slug: "social-media-roi-2025",
    title: "How to Measure Social Media ROI (The Right Way)",
    excerpt:
      "Vanity metrics are killing marketing budgets. Learn which social media metrics actually matter and how to report them to stakeholders.",
    publishedAt: new Date("2025-02-10"),
    categories: [{ name: "Social Media" }],
  },
];

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function estimateReadTime(excerpt: string | null): string {
  if (!excerpt) return "5 min read";
  const words = excerpt.split(" ").length;
  const minutes = Math.max(3, Math.ceil((words * 8) / 200));
  return `${minutes} min read`;
}

export default function BlogSection({ posts }: Props) {
  const items = posts.length > 0 ? posts : STATIC_POSTS;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">
              Latest Resources
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Marketing Insights
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Practical guides and strategies from our team — no fluff.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 shrink-0 transition-colors"
          >
            All articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transform transition-all duration-200"
            >
              <div className="h-1.5 ems-gradient-bg" />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {post.categories[0] && (
                    <Badge variant="blue" size="sm">
                      {post.categories[0].name}
                    </Badge>
                  )}
                  <span className="text-xs text-slate-400">
                    {estimateReadTime(post.excerpt)}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {formatDate(post.publishedAt)}
                  </span>
                  <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 gap-1">
                    Read
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
