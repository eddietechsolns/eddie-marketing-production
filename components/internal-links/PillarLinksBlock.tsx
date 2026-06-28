import Link from "next/link";
import { contentUrl, type ClusterLinks } from "@/lib/internal-links";

interface Props {
  pillar: ClusterLinks["pillar"];
  clusterName: string;
}

export function PillarLinksBlock({ pillar, clusterName }: Props) {
  if (!pillar) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {clusterName} Pillar
      </p>
      <Link
        href={contentUrl(pillar)}
        className="group flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/60 border border-blue-200 hover:bg-blue-100/60 hover:border-teal-300 transition-all"
      >
        <span className="mt-0.5 shrink-0 w-2 h-2 rounded-full ems-gradient-bg" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            {pillar.title}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {pillar.kind === "post" ? "Blog post" : "Pillar page"}
          </p>
        </div>
      </Link>
    </div>
  );
}
