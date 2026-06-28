import Link from "next/link";
import { contentUrl, type ClusterLinks } from "@/lib/internal-links";

interface Props {
  supporting: ClusterLinks["supporting"];
}

export function SupportingPagesBlock({ supporting }: Props) {
  if (supporting.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Supporting Pages
      </p>
      <ul className="space-y-1.5">
        {supporting.map((page) => (
          <li key={page.slug}>
            <Link
              href={contentUrl(page)}
              className="group flex items-center gap-2 py-1 text-sm text-slate-600 hover:text-blue-700 transition-colors"
            >
              <svg
                className="w-3 h-3 text-slate-300 group-hover:text-blue-400 shrink-0 transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="line-clamp-1">{page.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
