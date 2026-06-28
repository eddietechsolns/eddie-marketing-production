import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const SYSTEM_SLUGS = [
  "cart",
  "checkout",
  "my-account",
  "slider",
  "lost-and-found",
];

const LAST_UPDATED = new Date("2026-06-01");

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/services`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/industries`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/locations`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/request-for-a-proposal`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/portfolio`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/blog`,
    lastModified: LAST_UPDATED,
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/about`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/ppc-glossary-for-2024`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/academy`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/tools`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/terms`,
    lastModified: LAST_UPDATED,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/privacy`,
    lastModified: LAST_UPDATED,
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    serviceCategories,
    services,
    industries,
    locations,
    posts,
    portfolio,
    pages,
    caseStudies,
  ] = await Promise.all([
    prisma.serviceCategory.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        category: { select: { slug: true } },
        updatedAt: true,
      },
    }),
    prisma.industry.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.location.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.page.findMany({
      where: {
        status: "published",
        importStatus: { not: "failed" },
        slug: { notIn: SYSTEM_SLUGS },
      },
      select: { slug: true, updatedAt: true },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    ...STATIC_PAGES,

    ...serviceCategories.map((cat) => ({
      url: `${SITE_URL}/services/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...services
      .filter((s) => s.category?.slug)
      .map((s) => ({
        url: `${SITE_URL}/services/${s.category!.slug}/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),

    ...industries.map((i) => ({
      url: `${SITE_URL}/industries/${i.slug}`,
      lastModified: i.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...locations.map((l) => ({
      url: `${SITE_URL}/locations/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),

    ...portfolio.map((p) => ({
      url: `${SITE_URL}/portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    ...pages.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),

    {
      url: `${SITE_URL}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },

    ...caseStudies.map((c) => ({
      url: `${SITE_URL}/case-studies/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
