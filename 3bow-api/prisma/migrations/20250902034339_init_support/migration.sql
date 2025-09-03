/*
  Warnings:

  - The values [AGENT] on the enum `SupportRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `kickedAt` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Support` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SupportRole_new" AS ENUM ('ADMIN', 'STAFF', 'VIEWER');
ALTER TABLE "Support" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Support" ALTER COLUMN "role" TYPE "SupportRole_new" USING ("role"::text::"SupportRole_new");
ALTER TYPE "SupportRole" RENAME TO "SupportRole_old";
ALTER TYPE "SupportRole_new" RENAME TO "SupportRole";
DROP TYPE "SupportRole_old";
ALTER TABLE "Support" ALTER COLUMN "role" SET DEFAULT 'STAFF';
COMMIT;

-- DropIndex
DROP INDEX "Support_email_key";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "excerpt" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "author" DROP NOT NULL,
ALTER COLUMN "publishedAt" DROP NOT NULL,
ALTER COLUMN "publishedAt" DROP DEFAULT,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Support" DROP COLUMN "kickedAt",
DROP COLUMN "phone",
ADD COLUMN     "phone2" TEXT,
ALTER COLUMN "role" SET DEFAULT 'STAFF';
