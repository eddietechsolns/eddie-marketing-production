/**
 * Redirect catch-all — legacy WordPress URL support.
 *
 * This route only fires for paths that do NOT match any existing Next.js page
 * (Next.js always resolves specific routes first; catch-alls are lowest priority).
 *
 * Purpose: serve 301/302 redirects stored in the `Redirect` table so that
 * legacy WordPress URLs (e.g. /2024/05/some-post, /?p=42) preserve SEO value
 * when they are imported and re-published under new URLs.
 *
 * Do NOT use this route for internal routing — create a real page file instead.
 */

import { notFound, permanentRedirect, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string[] }>;
}

/**
 * Normalise a request path for redirect lookup:
 * - Lowercase (WordPress slugs are case-insensitive)
 * - Strip trailing slash (except root "/")
 * - Preserve leading slash
 */
function normalizePath(raw: string): string {
  return raw.toLowerCase().replace(/\/+$/, "") || "/";
}

/**
 * Look up a redirect by path, trying the normalised form first,
 * then falling back to the raw form if different.
 */
async function findRedirectByPath(rawPath: string) {
  const normalized = normalizePath(rawPath);
  const match = await prisma.redirect.findUnique({ where: { sourceUrl: normalized } });
  if (match) return match;
  if (normalized !== rawPath) {
    return prisma.redirect.findUnique({ where: { sourceUrl: rawPath } });
  }
  return null;
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/" + slug.join("/");

  const match = await findRedirectByPath(pathname);

  if (match) {
    if (match.statusCode === 301) {
      permanentRedirect(match.targetUrl);
    } else {
      redirect(match.targetUrl);
    }
  }

  notFound();
}
