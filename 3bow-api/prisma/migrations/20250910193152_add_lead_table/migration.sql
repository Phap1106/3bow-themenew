-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('SEO', 'GOOGLE_ADS', 'FACEBOOK_INSTAGRAM_ADS', 'TIKTOK_ADS', 'LANDING_TRACKING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BudgetRange" AS ENUM ('LT_50M', 'B_50_150M', 'B_150_300M', 'GT_300M', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST', 'SPAM', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."LeadChannel" AS ENUM ('WEBSITE', 'LANDINGPAGE', 'PHONE', 'EMAIL', 'CHAT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "url" TEXT,
    "service" "public"."ServiceType",
    "serviceText" TEXT,
    "budget" "public"."BudgetRange",
    "note" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'NEW',
    "channel" "public"."LeadChannel" NOT NULL DEFAULT 'WEBSITE',
    "assignedToId" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "referrer" TEXT,
    "pagePath" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_phone_idx" ON "public"."Lead"("phone");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "public"."Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "public"."Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "public"."Lead"("createdAt");
