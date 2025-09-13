/*
  Warnings:

  - Made the column `codeHash` on table `EmailLoginChallenge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."EmailLoginChallenge" ALTER COLUMN "codeHash" SET NOT NULL;
