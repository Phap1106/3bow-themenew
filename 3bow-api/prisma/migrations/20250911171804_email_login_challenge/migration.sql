-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "lastLoginAttemptAt" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "loginAttemptCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."EmailLoginChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "sentCount" INTEGER NOT NULL DEFAULT 1,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,
    "nextPath" TEXT,

    CONSTRAINT "EmailLoginChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailLoginChallenge_token_key" ON "public"."EmailLoginChallenge"("token");

-- CreateIndex
CREATE INDEX "EmailLoginChallenge_userId_expiresAt_idx" ON "public"."EmailLoginChallenge"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "public"."EmailLoginChallenge" ADD CONSTRAINT "EmailLoginChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
