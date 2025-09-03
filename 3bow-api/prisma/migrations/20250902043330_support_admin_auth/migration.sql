/*
  Warnings:

  - You are about to drop the column `numberPhone` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Support` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPPORT_ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "numberPhone",
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'SUPPORT_ADMIN';

-- DropTable
DROP TABLE "Support";

-- DropEnum
DROP TYPE "SupportRole";

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
