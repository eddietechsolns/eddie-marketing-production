-- Baseline migration: creates all tables that existed before the User Management module.
-- Safe to run on any database state — all statements use IF NOT EXISTS.

CREATE SCHEMA IF NOT EXISTS "public";

-- ─── User (base columns only — role/isActive/lastLoginAt added in next migration) ──
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- ─── Page ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Page" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "legacyWpId" INTEGER,
    "legacyUrl" TEXT,
    "importStatus" TEXT NOT NULL DEFAULT 'none',
    "migrationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Page_slug_key" ON "Page"("slug");
CREATE INDEX IF NOT EXISTS "Page_legacyWpId_idx" ON "Page"("legacyWpId");
CREATE INDEX IF NOT EXISTS "Page_importStatus_idx" ON "Page"("importStatus");

-- ─── ServiceCategory ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ServiceCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ServiceCategory_name_key" ON "ServiceCategory"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- ─── Service ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Service" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER,
    "excerpt" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "legacyWpId" INTEGER,
    "legacyUrl" TEXT,
    "importStatus" TEXT NOT NULL DEFAULT 'none',
    "migrationNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "Service"("slug");
CREATE INDEX IF NOT EXISTS "Service_categoryId_idx" ON "Service"("categoryId");
CREATE INDEX IF NOT EXISTS "Service_legacyWpId_idx" ON "Service"("legacyWpId");
CREATE INDEX IF NOT EXISTS "Service_importStatus_idx" ON "Service"("importStatus");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Service_categoryId_fkey') THEN
    ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── PortfolioCategory ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "PortfolioCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortfolioCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PortfolioCategory_name_key" ON "PortfolioCategory"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "PortfolioCategory_slug_key" ON "PortfolioCategory"("slug");

-- ─── PortfolioProject ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "PortfolioProject" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "client" TEXT,
    "excerpt" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "categoryId" INTEGER,
    "services" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "legacyWpId" INTEGER,
    "legacyUrl" TEXT,
    "importStatus" TEXT NOT NULL DEFAULT 'none',
    "migrationNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PortfolioProject_slug_key" ON "PortfolioProject"("slug");
CREATE INDEX IF NOT EXISTS "PortfolioProject_categoryId_idx" ON "PortfolioProject"("categoryId");
CREATE INDEX IF NOT EXISTS "PortfolioProject_legacyWpId_idx" ON "PortfolioProject"("legacyWpId");
CREATE INDEX IF NOT EXISTS "PortfolioProject_importStatus_idx" ON "PortfolioProject"("importStatus");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PortfolioProject_categoryId_fkey') THEN
    ALTER TABLE "PortfolioProject" ADD CONSTRAINT "PortfolioProject_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "PortfolioCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── Category (blog) ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

-- ─── BlogPost ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "author" TEXT,
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "legacyWpId" INTEGER,
    "legacyUrl" TEXT,
    "importStatus" TEXT NOT NULL DEFAULT 'none',
    "migrationNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");
CREATE INDEX IF NOT EXISTS "BlogPost_status_idx" ON "BlogPost"("status");
CREATE INDEX IF NOT EXISTS "BlogPost_legacyWpId_idx" ON "BlogPost"("legacyWpId");
CREATE INDEX IF NOT EXISTS "BlogPost_importStatus_idx" ON "BlogPost"("importStatus");

-- ─── Industry ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Industry" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "legacyWpId" INTEGER,
    "legacyUrl" TEXT,
    "importStatus" TEXT NOT NULL DEFAULT 'none',
    "migrationNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Industry_slug_key" ON "Industry"("slug");
CREATE INDEX IF NOT EXISTS "Industry_legacyWpId_idx" ON "Industry"("legacyWpId");
CREATE INDEX IF NOT EXISTS "Industry_importStatus_idx" ON "Industry"("importStatus");

-- ─── Location ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Location" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "excerpt" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "legacyWpId" INTEGER,
    "legacyUrl" TEXT,
    "importStatus" TEXT NOT NULL DEFAULT 'none',
    "migrationNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Location_slug_key" ON "Location"("slug");
CREATE INDEX IF NOT EXISTS "Location_state_idx" ON "Location"("state");
CREATE INDEX IF NOT EXISTS "Location_legacyWpId_idx" ON "Location"("legacyWpId");
CREATE INDEX IF NOT EXISTS "Location_importStatus_idx" ON "Location"("importStatus");

-- ─── SeoMetadata ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "SeoMetadata" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SeoMetadata_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SeoMetadata_entityType_entityId_key" ON "SeoMetadata"("entityType", "entityId");

-- ─── Redirect ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Redirect" (
    "id" SERIAL NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Redirect_sourceUrl_key" ON "Redirect"("sourceUrl");
CREATE INDEX IF NOT EXISTS "Redirect_sourceUrl_idx" ON "Redirect"("sourceUrl");

-- ─── PillarOverride ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "PillarOverride" (
    "id" SERIAL NOT NULL,
    "clusterId" TEXT NOT NULL,
    "contentKind" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PillarOverride_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PillarOverride_clusterId_key" ON "PillarOverride"("clusterId");

-- ─── Lead ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Lead" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "serviceInterest" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "landingPage" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "expectedValue" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "assignedTo" TEXT,
    "priority" TEXT DEFAULT 'Medium',
    "nextFollowUpAt" TIMESTAMP(3),
    "leadSource" TEXT,
    "linkedin" TEXT,
    "portfolio" TEXT,
    "university" TEXT,
    "currentPosition" TEXT,
    "graduationYear" TEXT,
    "roleApplied" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX IF NOT EXISTS "Lead_serviceInterest_idx" ON "Lead"("serviceInterest");
CREATE INDEX IF NOT EXISTS "Lead_priority_idx" ON "Lead"("priority");
CREATE INDEX IF NOT EXISTS "Lead_nextFollowUpAt_idx" ON "Lead"("nextFollowUpAt");
CREATE INDEX IF NOT EXISTS "Lead_utmSource_idx" ON "Lead"("utmSource");
CREATE INDEX IF NOT EXISTS "Lead_utmCampaign_idx" ON "Lead"("utmCampaign");
CREATE INDEX IF NOT EXISTS "Lead_leadSource_idx" ON "Lead"("leadSource");

-- ─── LeadNote ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "LeadNote" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LeadNote_leadId_idx" ON "LeadNote"("leadId");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadNote_leadId_fkey') THEN
    ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── LeadTimeline ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "LeadTimeline" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadTimeline_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LeadTimeline_leadId_idx" ON "LeadTimeline"("leadId");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadTimeline_leadId_fkey') THEN
    ALTER TABLE "LeadTimeline" ADD CONSTRAINT "LeadTimeline_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── CaseStudy ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CaseStudy" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "clientName" TEXT,
    "industry" TEXT,
    "country" TEXT,
    "serviceType" TEXT,
    "challenge" TEXT,
    "strategy" TEXT,
    "implementation" TEXT,
    "results" TEXT,
    "testimonial" TEXT,
    "trafficIncreasePercent" DOUBLE PRECISION,
    "leadIncreasePercent" DOUBLE PRECISION,
    "conversionIncreasePercent" DOUBLE PRECISION,
    "revenueGenerated" TEXT,
    "featuredImage" TEXT,
    "galleryImages" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CaseStudy_slug_key" ON "CaseStudy"("slug");
CREATE INDEX IF NOT EXISTS "CaseStudy_status_idx" ON "CaseStudy"("status");
CREATE INDEX IF NOT EXISTS "CaseStudy_industry_idx" ON "CaseStudy"("industry");
CREATE INDEX IF NOT EXISTS "CaseStudy_serviceType_idx" ON "CaseStudy"("serviceType");
CREATE INDEX IF NOT EXISTS "CaseStudy_publishedAt_idx" ON "CaseStudy"("publishedAt");

-- ─── ChatSession ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ChatSession" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "landingPage" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "leadId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ChatSession_visitorId_idx" ON "ChatSession"("visitorId");
CREATE INDEX IF NOT EXISTS "ChatSession_leadId_idx" ON "ChatSession"("leadId");
CREATE INDEX IF NOT EXISTS "ChatSession_createdAt_idx" ON "ChatSession"("createdAt");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatSession_leadId_fkey') THEN
    ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── ChatMessage ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatMessage_sessionId_fkey') THEN
    ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey"
      FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── Job ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "description" TEXT,
    "responsibilities" TEXT,
    "requirements" TEXT,
    "preferredSkills" TEXT,
    "salaryRange" TEXT,
    "careerGrowth" TEXT,
    "faqs" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Job_slug_key" ON "Job"("slug");
CREATE INDEX IF NOT EXISTS "Job_status_idx" ON "Job"("status");
CREATE INDEX IF NOT EXISTS "Job_department_idx" ON "Job"("department");

-- ─── Email ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Email" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "bodyText" TEXT,
    "fromName" TEXT,
    "fromEmail" TEXT NOT NULL DEFAULT '',
    "toEmail" TEXT NOT NULL DEFAULT '',
    "toName" TEXT,
    "cc" TEXT,
    "bcc" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "folder" TEXT NOT NULL DEFAULT 'drafts',
    "leadId" INTEGER,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "errorMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Email_leadId_idx" ON "Email"("leadId");
CREATE INDEX IF NOT EXISTS "Email_status_idx" ON "Email"("status");
CREATE INDEX IF NOT EXISTS "Email_folder_idx" ON "Email"("folder");
CREATE INDEX IF NOT EXISTS "Email_sentAt_idx" ON "Email"("sentAt");
CREATE INDEX IF NOT EXISTS "Email_createdAt_idx" ON "Email"("createdAt");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Email_leadId_fkey') THEN
    ALTER TABLE "Email" ADD CONSTRAINT "Email_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── EmailAttachment ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "EmailAttachment" (
    "id" SERIAL NOT NULL,
    "emailId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailAttachment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "EmailAttachment_emailId_idx" ON "EmailAttachment"("emailId");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EmailAttachment_emailId_fkey') THEN
    ALTER TABLE "EmailAttachment" ADD CONSTRAINT "EmailAttachment_emailId_fkey"
      FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── EmailTemplate ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "EmailTemplate_isActive_idx" ON "EmailTemplate"("isActive");
CREATE INDEX IF NOT EXISTS "EmailTemplate_category_idx" ON "EmailTemplate"("category");

-- ─── SiteSettings ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" SERIAL NOT NULL,
    "ga4MeasurementId" TEXT,
    "googleAdsConversionId" TEXT,
    "googleAdsConversionLabel" TEXT,
    "headerLogoUrl" TEXT,
    "footerLogoUrl" TEXT,
    "faviconUrl" TEXT,
    "clientsServed" TEXT,
    "retentionRate" TEXT,
    "revenueGenerated" TEXT,
    "yearsExperience" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- ─── M2M join tables ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "_BlogPostToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToCategory_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX IF NOT EXISTS "_BlogPostToCategory_B_index" ON "_BlogPostToCategory"("B");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_BlogPostToCategory_A_fkey') THEN
    ALTER TABLE "_BlogPostToCategory" ADD CONSTRAINT "_BlogPostToCategory_A_fkey"
      FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_BlogPostToCategory_B_fkey') THEN
    ALTER TABLE "_BlogPostToCategory" ADD CONSTRAINT "_BlogPostToCategory_B_fkey"
      FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "_IndustryToPortfolioProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_IndustryToPortfolioProject_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX IF NOT EXISTS "_IndustryToPortfolioProject_B_index" ON "_IndustryToPortfolioProject"("B");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_IndustryToPortfolioProject_A_fkey') THEN
    ALTER TABLE "_IndustryToPortfolioProject" ADD CONSTRAINT "_IndustryToPortfolioProject_A_fkey"
      FOREIGN KEY ("A") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_IndustryToPortfolioProject_B_fkey') THEN
    ALTER TABLE "_IndustryToPortfolioProject" ADD CONSTRAINT "_IndustryToPortfolioProject_B_fkey"
      FOREIGN KEY ("B") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "_LocationToPortfolioProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LocationToPortfolioProject_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX IF NOT EXISTS "_LocationToPortfolioProject_B_index" ON "_LocationToPortfolioProject"("B");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_LocationToPortfolioProject_A_fkey') THEN
    ALTER TABLE "_LocationToPortfolioProject" ADD CONSTRAINT "_LocationToPortfolioProject_A_fkey"
      FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_LocationToPortfolioProject_B_fkey') THEN
    ALTER TABLE "_LocationToPortfolioProject" ADD CONSTRAINT "_LocationToPortfolioProject_B_fkey"
      FOREIGN KEY ("B") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
