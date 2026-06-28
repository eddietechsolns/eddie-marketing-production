import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  localBusinessSchema,
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
} from "@/lib/schema";
import CtaBanner from "@/components/sections/CtaBanner";
import HeroSection from "@/components/home/HeroSection";
import TrustedBy from "@/components/home/TrustedBy";
import ServicesGrid from "@/components/home/ServicesGrid";
import IndustriesGrid from "@/components/home/IndustriesGrid";
import PortfolioGrid from "@/components/home/PortfolioGrid";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import CaseStudiesSection from "@/components/home/CaseStudiesSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute:
      "Digital Marketing Agency for UAE, GCC & Europe | Eddie Marketing Solutions",
  },
  description:
    "Eddie Marketing Solutions — full-service digital marketing agency helping businesses grow in UAE, GCC & Europe through SEO, Google Ads, social media, and web design.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Digital Marketing Agency for UAE, GCC & Europe | Eddie Marketing Solutions",
    description:
      "Data-driven SEO, Google Ads, social media, and web design for ambitious businesses across UAE, GCC & Europe.",
    type: "website",
    url: SITE_URL,
  },
};

export default async function HomePage() {
  const [services, industries, portfolio, posts, caseStudies] = await Promise.all([
    prisma.service.findMany({
      where: { status: "published" },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: "asc" },
    }),
    prisma.industry.findMany({
      where: { status: "published" },
      take: 10,
      orderBy: { title: "asc" },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "published" },
      include: { industries: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { status: "published" },
      include: { categories: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.caseStudy.findMany({
      where: { status: "published" },
      select: {
        id: true,
        slug: true,
        title: true,
        clientName: true,
        industry: true,
        serviceType: true,
        trafficIncreasePercent: true,
        leadIncreasePercent: true,
        conversionIncreasePercent: true,
        revenueGenerated: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          webSiteSchema(),
          localBusinessSchema(),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
        ]}
      />

      <HeroSection />
      <TrustedBy />
      <ServicesGrid services={services} />
      <IndustriesGrid industries={industries} />
      <PortfolioGrid projects={portfolio} />
      <CaseStudiesSection caseStudies={caseStudies} />
      <StatsSection />
      <TestimonialsSection />
      <BlogSection posts={posts} />

      <CtaBanner
        eyebrow="Let's Talk"
        title="Ready to Grow Your Business?"
        description="Join 50+ UAE businesses growing with data-driven SEO, Google Ads, and social media. Book a free 30-minute strategy session — no sales pitch, just a plan."
        primaryCta={{ label: "Get a Free Strategy Session", href: "/request-for-a-proposal" }}
        secondaryCta={{ label: "View Our Services", href: "/services" }}
        variant="navy"
      />
    </>
  );
}
