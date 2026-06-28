import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@eddiemarketingsolutions.com" },
    update: {},
    create: {
      email: "admin@eddiemarketingsolutions.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("✓ Admin user: admin@eddiemarketingsolutions.com / admin123");

  // Categories
  const seoCategory = await prisma.category.upsert({
    where: { slug: "seo" },
    update: {},
    create: { name: "SEO", slug: "seo" },
  });
  const strategyCategory = await prisma.category.upsert({
    where: { slug: "strategy" },
    update: {},
    create: { name: "Strategy", slug: "strategy" },
  });
  const localSeoCategory = await prisma.category.upsert({
    where: { slug: "local-seo" },
    update: {},
    create: { name: "Local SEO", slug: "local-seo" },
  });

  // Services
  await prisma.service.createMany({
    data: [
      {
        title: "Technical SEO",
        slug: "technical-seo",
        excerpt:
          "Optimize your website's technical foundation for maximum search engine visibility.",
        seoTitle: "Technical SEO Services | Eddie Marketing Solutions",
        seoDescription:
          "Expert technical SEO services including site audits, schema markup, page speed optimization, and crawlability improvements.",
        status: "published",
      },
      {
        title: "Local SEO",
        slug: "local-seo",
        excerpt:
          "Dominate local search results and drive more customers to your business.",
        seoTitle: "Local SEO Services | Eddie Marketing Solutions",
        seoDescription:
          "Local SEO services to help your business rank in local search results, Google Maps, and near-me searches.",
        status: "published",
      },
      {
        title: "Google Ads Management",
        slug: "google-ads-management",
        excerpt:
          "Data-driven Google Ads campaigns that maximize ROI and drive qualified leads.",
        seoTitle: "Google Ads Management | Eddie Marketing Solutions",
        seoDescription:
          "Professional Google Ads management services. We handle strategy, setup, optimization, and reporting for your PPC campaigns.",
        status: "published",
      },
      {
        title: "Social Media Marketing",
        slug: "social-media-marketing",
        excerpt:
          "Build brand awareness and engage your audience across all major social platforms.",
        seoTitle: "Social Media Marketing | Eddie Marketing Solutions",
        seoDescription:
          "Comprehensive social media marketing services for Facebook, Instagram, LinkedIn, and more.",
        status: "published",
      },
    ],
    skipDuplicates: true,
  });

  // Industries
  await prisma.industry.createMany({
    data: [
      {
        title: "Healthcare",
        slug: "healthcare",
        excerpt:
          "Digital marketing strategies tailored for healthcare providers, clinics, and medical practices.",
        status: "published",
      },
      {
        title: "Legal Services",
        slug: "legal",
        excerpt:
          "SEO and PPC campaigns designed for law firms to attract high-intent clients.",
        status: "published",
      },
      {
        title: "Real Estate",
        slug: "real-estate",
        excerpt:
          "Generate qualified buyer and seller leads with targeted digital marketing.",
        status: "published",
      },
      {
        title: "Home Services",
        slug: "home-services",
        excerpt:
          "Local SEO and paid search strategies for HVAC, plumbing, roofing, and more.",
        status: "published",
      },
      {
        title: "E-Commerce",
        slug: "ecommerce",
        excerpt:
          "Drive online sales with shopping ads, SEO, and conversion optimization.",
        status: "published",
      },
    ],
    skipDuplicates: true,
  });

  // Locations
  await prisma.location.createMany({
    data: [
      {
        title: "Digital Marketing Agency in New York",
        slug: "new-york",
        city: "New York",
        state: "NY",
        excerpt:
          "Top-rated digital marketing services for businesses in New York City and the tri-state area.",
        status: "published",
      },
      {
        title: "Digital Marketing Agency in Los Angeles",
        slug: "los-angeles",
        city: "Los Angeles",
        state: "CA",
        excerpt:
          "Expert digital marketing for LA businesses looking to grow their online presence.",
        status: "published",
      },
      {
        title: "Digital Marketing Agency in Chicago",
        slug: "chicago",
        city: "Chicago",
        state: "IL",
        excerpt:
          "Full-service digital marketing agency serving the Chicago metro area.",
        status: "published",
      },
    ],
    skipDuplicates: true,
  });

  // Blog posts (use individual upsert to support M2M categories connect)
  await prisma.blogPost.upsert({
    where: { slug: "technical-seo-fixes-2025" },
    update: {},
    create: {
      title: "10 Technical SEO Fixes That Will Boost Your Rankings in 2025",
      slug: "technical-seo-fixes-2025",
      excerpt:
        "Discover the most impactful technical SEO improvements you can make right now to improve your search rankings.",
      author: "Eddie Marketing Team",
      categories: { connect: [{ id: seoCategory.id }] },
      status: "published",
      publishedAt: new Date("2025-01-15"),
    },
  });
  await prisma.blogPost.upsert({
    where: { slug: "google-ads-vs-seo" },
    update: {},
    create: {
      title: "Google Ads vs SEO: Which Should You Invest In?",
      slug: "google-ads-vs-seo",
      excerpt:
        "A data-driven comparison of Google Ads and SEO to help you decide where to put your marketing budget.",
      author: "Eddie Marketing Team",
      categories: { connect: [{ id: strategyCategory.id }] },
      status: "published",
      publishedAt: new Date("2025-02-10"),
    },
  });
  await prisma.blogPost.upsert({
    where: { slug: "local-seo-guide-small-business" },
    update: {},
    create: {
      title: "The Complete Local SEO Guide for Small Businesses",
      slug: "local-seo-guide-small-business",
      excerpt:
        "Everything small business owners need to know about local SEO, from Google Business Profile to citation building.",
      author: "Eddie Marketing Team",
      categories: { connect: [{ id: localSeoCategory.id }] },
      status: "published",
      publishedAt: new Date("2025-03-05"),
    },
  });

  // Portfolio
  await prisma.portfolioProject.createMany({
    data: [
      {
        title: "Regional Law Firm SEO Campaign",
        slug: "law-firm-seo-campaign",
        client: "Regional Law Group",
        excerpt:
          "Grew organic traffic by 340% and increased qualified consultations by 85% in 12 months.",
        services: ["SEO", "Local SEO", "Content Marketing"],
        status: "published",
      },
      {
        title: "E-Commerce Google Ads Scale-Up",
        slug: "ecommerce-google-ads",
        client: "Online Retailer",
        excerpt:
          "Scaled Google Ads from $10K to $100K monthly spend while maintaining a 4.2x ROAS.",
        services: ["Google Ads"],
        status: "published",
      },
      {
        title: "HVAC Company Local Domination",
        slug: "hvac-local-seo",
        client: "Metro HVAC Services",
        excerpt:
          "Achieved #1 Google Maps rankings for 47 target keywords across 12 service areas.",
        services: ["Local SEO", "Google Ads"],
        status: "published",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
