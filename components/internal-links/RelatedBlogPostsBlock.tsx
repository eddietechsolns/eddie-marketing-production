import Link from "next/link";
import { contentUrl, type ClusterLinks } from "@/lib/internal-links";

interface Props {
  blogPosts: ClusterLinks["blogPosts"];
}

export function RelatedBlogPostsBlock({ blogPosts }: Props) {
  if (blogPosts.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Related Articles
      </p>
      <ul className="space-y-1.5">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={contentUrl(post)}
              className="group flex items-start gap-2 py-1 text-sm text-slate-600 hover:text-blue-700 transition-colors"
            >
              <svg
                className="w-3 h-3 mt-0.5 text-slate-300 group-hover:text-blue-400 shrink-0 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="line-clamp-2 leading-snug">{post.title}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/blog"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 block"
          >
            View all articles &rarr;
          </Link>
        </li>
      </ul>
    </div>
  );
}
