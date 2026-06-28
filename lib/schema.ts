import { SITE_URL, SITE_NAME } from "@/lib/seo";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "MarketingAgency"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/ems-logo.svg`,
    },
    sameAs: [
      "https://www.linkedin.com/company/eddie-marketing-solutions",
      "https://www.facebook.com/eddietechsolns",
      "https://www.instagram.com/eddietechsolns",
      "https://eddietechsolns.com",
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function localBusinessSchema(opts?: {
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    ...(opts?.phone ? { telephone: opts.phone } : {}),
    ...(opts?.city || opts?.state
      ? {
          address: {
            "@type": "PostalAddress",
            ...(opts?.city ? { addressLocality: opts.city } : {}),
            ...(opts?.state ? { addressRegion: opts.state } : {}),
            ...(opts?.zip ? { postalCode: opts.zip } : {}),
            addressCountry: "AE",
          },
          areaServed: opts?.city ?? opts?.state ?? "United Arab Emirates",
        }
      : {
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dubai",
            addressRegion: "Dubai",
            addressCountry: "AE",
          },
          areaServed: "Dubai, United Arab Emirates",
        }),
    priceRange: "$$",
  };
}

export function collectionPageSchema(data: {
  title: string;
  path: string;
  description?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}${data.path}#collectionpage`,
    name: data.title,
    ...(data.description ? { description: data.description } : {}),
    url: `${SITE_URL}${data.path}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function serviceSchema(data: {
  title: string;
  description?: string | null;
  path: string;
  category?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${data.path}#service`,
    name: data.title,
    ...(data.description ? { description: data.description } : {}),
    url: `${SITE_URL}${data.path}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    ...(data.category ? { serviceType: data.category } : {}),
  };
}

export function articleSchema(data: {
  title: string;
  description?: string | null;
  path: string;
  publishedAt?: Date | null;
  modifiedAt?: Date | null;
  author?: string | null;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}${data.path}#article`,
    headline: data.title,
    ...(data.description ? { description: data.description } : {}),
    url: `${SITE_URL}${data.path}`,
    ...(data.publishedAt
      ? { datePublished: data.publishedAt.toISOString() }
      : {}),
    ...(data.modifiedAt
      ? { dateModified: data.modifiedAt.toISOString() }
      : {}),
    ...(data.author
      ? { author: { "@type": "Person", name: data.author } }
      : { author: { "@id": `${SITE_URL}/#organization` } }),
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(data.image
      ? { image: { "@type": "ImageObject", url: data.image } }
      : {}),
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function blogPostingSchema(data: {
  title: string;
  description?: string | null;
  path: string;
  publishedAt?: Date | null;
  modifiedAt?: Date | null;
  author?: string | null;
  image?: string | null;
}) {
  const base = articleSchema(data);
  return {
    ...base,
    "@type": "BlogPosting",
    "@id": `${SITE_URL}${data.path}#blogposting`,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function caseStudySchema(data: {
  title: string;
  description?: string | null;
  path: string;
  publishedAt?: Date | null;
  modifiedAt?: Date | null;
  image?: string | null;
  client?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}${data.path}#casestudy`,
    headline: data.title,
    ...(data.description ? { description: data.description } : {}),
    url: `${SITE_URL}${data.path}`,
    ...(data.publishedAt
      ? { datePublished: data.publishedAt.toISOString() }
      : {}),
    ...(data.modifiedAt
      ? { dateModified: data.modifiedAt.toISOString() }
      : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(data.image
      ? { image: { "@type": "ImageObject", url: data.image } }
      : {}),
    ...(data.client
      ? { about: { "@type": "Organization", name: data.client } }
      : {}),
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function pageSchema(data: {
  title: string;
  description?: string | null;
  path: string;
  modifiedAt?: Date | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${data.path}#webpage`,
    name: data.title,
    ...(data.description ? { description: data.description } : {}),
    url: `${SITE_URL}${data.path}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(data.modifiedAt ? { dateModified: data.modifiedAt.toISOString() } : {}),
  };
}

export function jobPostingSchema(data: {
  title: string;
  description?: string | null;
  path: string;
  department?: string;
  employmentType?: string;
  validThrough?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${SITE_URL}${data.path}#jobposting`,
    title: data.title,
    ...(data.description ? { description: data.description } : {}),
    url: `${SITE_URL}${data.path}`,
    hiringOrganization: { "@id": `${SITE_URL}/#organization` },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
    },
    employmentType: data.employmentType ?? "INTERN",
    ...(data.department ? { occupationalCategory: data.department } : {}),
    validThrough: data.validThrough ?? new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    datePosted: new Date().toISOString().split("T")[0],
    applicantLocationRequirements: {
      "@type": "Country",
      name: "AE",
    },
    jobLocationType: "TELECOMMUTE",
    workHours: "Part time or full time depending on arrangement",
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${items[items.length - 1]?.path ?? "/"}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
