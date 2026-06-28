import { prisma } from "@/lib/prisma";
import {
  getClusterLinksById,
  getClusterLinksForCategory,
  getClusterLinksForSlug,
} from "@/lib/internal-links";
import type { ClusterId } from "@/lib/cluster-analysis";
import { PillarLinksBlock } from "./PillarLinksBlock";
import { SupportingPagesBlock } from "./SupportingPagesBlock";
import { RelatedBlogPostsBlock } from "./RelatedBlogPostsBlock";
import { CrossSiloLinksBlock } from "./CrossSiloLinksBlock";

// ─── Shared service category fetch ────────────────────────────────────────────

async function getServiceCategories() {
  return prisma.serviceCategory.findMany({
    where: { status: "published" },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });
}

// ─── Variants ─────────────────────────────────────────────────────────────────

/** Service category hub page: detect cluster from category name/slug */
interface CategoryProps {
  variant: "category";
  categorySlug: string;
  categoryName: string;
  categoryDescription: string | null;
  excludeSlug?: string;
}

/** Service detail or generic page: detect cluster from slug + kind */
interface SlugProps {
  variant: "slug";
  slug: string;
  kind: "page" | "post";
}

/** Explicit cluster ID (when you already know it) */
interface ClusterIdProps {
  variant: "cluster-id";
  clusterId: ClusterId;
  excludeSlug?: string;
  excludeKind?: "page" | "post";
}

/** Cross-silo only: just show service category links (no cluster content) */
interface CrossSiloProps {
  variant: "cross-silo";
  excludeCategorySlug?: string;
}

type Props =
  | CategoryProps
  | SlugProps
  | ClusterIdProps
  | CrossSiloProps;

// ─── Component ────────────────────────────────────────────────────────────────

export async function ClusterLinksSection(props: Props) {
  if (props.variant === "cross-silo") {
    const serviceCategories = await getServiceCategories();
    if (serviceCategories.length === 0) return null;
    return (
      <Section clusterName="Other Services">
        <CrossSiloLinksBlock
          serviceCategories={serviceCategories}
          excludeCategorySlug={props.excludeCategorySlug}
          heading=""
        />
      </Section>
    );
  }

  // Fetch cluster links + service categories in parallel
  const [links, serviceCategories] = await Promise.all([
    props.variant === "category"
      ? getClusterLinksForCategory(
          props.categorySlug,
          props.categoryName,
          props.categoryDescription,
          props.excludeSlug,
        )
      : props.variant === "slug"
      ? getClusterLinksForSlug(props.slug, props.kind)
      : getClusterLinksById(
          props.clusterId,
          props.excludeSlug,
          props.excludeKind,
        ),
    getServiceCategories(),
  ]);

  const excludeCategorySlug =
    props.variant === "category" ? props.categorySlug : undefined;

  // Only render the section if there is at least one link to show
  const hasContent =
    links &&
    (links.pillar !== null ||
      links.supporting.length > 0 ||
      links.blogPosts.length > 0);

  if (!hasContent && serviceCategories.length === 0) return null;

  const hasPillar = !!links?.pillar;
  const hasSupporting = links && links.supporting.length > 0;
  const hasBlogPosts = links && links.blogPosts.length > 0;
  const hasCrossSilo = serviceCategories.length > 0;

  return (
    <Section clusterName={links?.clusterName}>
      {/* Row 1: Pillar — full-width feature card when present */}
      {hasPillar && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] ems-gradient-text mb-3">
            Pillar Resource
          </p>
          <PillarLinksBlock
            pillar={links!.pillar!}
            clusterName={links!.clusterName}
          />
        </div>
      )}

      {/* Row 2: Supporting pages + blog posts side-by-side */}
      {(hasSupporting || hasBlogPosts) && (
        <div className={`grid gap-6 mb-6 ${hasSupporting && hasBlogPosts ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {hasSupporting && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400 mb-3">
                Supporting Pages
              </p>
              <SupportingPagesBlock supporting={links!.supporting} />
            </div>
          )}
          {hasBlogPosts && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-3">
                Related Articles
              </p>
              <RelatedBlogPostsBlock blogPosts={links!.blogPosts} />
            </div>
          )}
        </div>
      )}

      {/* Row 3: Other services — compact pills row */}
      {hasCrossSilo && (
        <div className="pt-5 border-t border-slate-200">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-3">
            Other Services
          </p>
          <CrossSiloLinksBlock
            serviceCategories={serviceCategories}
            excludeCategorySlug={excludeCategorySlug}
            heading=""
          />
        </div>
      )}
    </Section>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  clusterName,
  children,
}: {
  clusterName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border-t border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-1">
              Keep Exploring
            </p>
            <h2 className="text-xl font-bold text-slate-900">
              {clusterName ? `Explore Related Resources` : "Explore Related Resources"}
            </h2>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
