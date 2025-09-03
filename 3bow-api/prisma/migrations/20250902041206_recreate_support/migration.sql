/*
  Warnings:

  - You are about to drop the column `phone2` on the `Support` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Support" DROP COLUMN "phone2",
ADD COLUMN     "kickedAt" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT;
