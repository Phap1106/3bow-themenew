-- DropForeignKey
ALTER TABLE "public"."EmailLoginChallenge" DROP CONSTRAINT "EmailLoginChallenge_userId_fkey";

-- DropIndex
DROP INDEX "public"."EmailLoginChallenge_token_key";

-- DropIndex
DROP INDEX "public"."EmailLoginChallenge_userId_expiresAt_idx";

-- AlterTable
ALTER TABLE "public"."EmailLoginChallenge" ADD COLUMN     "codeHash" TEXT,
ADD COLUMN     "verifyCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "token" SET DEFAULT '',
ALTER COLUMN "sentCount" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "EmailLoginChallenge_userId_createdAt_idx" ON "public"."EmailLoginChallenge"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."EmailLoginChallenge" ADD CONSTRAINT "EmailLoginChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
