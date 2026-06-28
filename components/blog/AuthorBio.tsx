import type { Author } from "@/lib/authors";

interface Props {
  author: Author;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  readingMins?: number;
  category?: string;
}

const AVATAR_GRADIENT: Record<string, string> = {
  "Eddie — Marketing Director": "from-blue-600 to-blue-700",
  "Sarah Rahman": "from-purple-600 to-purple-700",
  "Marcus Webb": "from-emerald-600 to-emerald-700",
};

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AuthorBio({ author, publishedAt, updatedAt, readingMins, category }: Props) {
  const gradient = AVATAR_GRADIENT[author.name] ?? "from-slate-600 to-slate-700";
  const showUpdated =
    updatedAt && publishedAt && updatedAt.getTime() - publishedAt.getTime() > 86_400_000;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-5">
        About the Author
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        {/* Author row */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 text-2xl font-bold text-white select-none shadow-md`}
          >
            {author.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-base font-bold text-slate-900">{author.name}</span>
              <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full font-medium">
                {author.role}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">{author.bio}</p>

            {author.credentials.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {author.credentials.map((c) => (
                  <span
                    key={c}
                    className="text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {author.linkedInUrl && (
              <a
                href={author.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn Profile
              </a>
            )}
          </div>
        </div>

        {/* Article meta footer */}
        {(category || readingMins || publishedAt || showUpdated) && (
          <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            {category && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                {category}
              </span>
            )}
            {readingMins && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readingMins} min read
              </span>
            )}
            {publishedAt && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Published {fmt(publishedAt)}
              </span>
            )}
            {showUpdated && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Updated {fmt(updatedAt)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
