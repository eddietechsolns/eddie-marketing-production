import Link from "next/link";

interface ServiceCategoryLink {
  slug: string;
  name: string;
}

interface Props {
  serviceCategories: ServiceCategoryLink[];
  /** Slug of the current service category to exclude from cross-silo links */
  excludeCategorySlug?: string;
  heading?: string;
}

export function CrossSiloLinksBlock({
  serviceCategories,
  excludeCategorySlug,
  heading = "Related Services",
}: Props) {
  const filtered = serviceCategories.filter(
    (c) => c.slug !== excludeCategorySlug,
  );
  if (filtered.length === 0) return null;

  return (
    <div>
      {heading && (
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          {heading}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {filtered.map((cat) => (
          <Link
            key={cat.slug}
            href={`/services/${cat.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 border border-transparent hover:border-blue-200 text-xs font-medium text-slate-600 hover:text-blue-700 transition-all"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
