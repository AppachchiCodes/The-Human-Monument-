-- CreateEnum
CREATE TYPE "ContributionType" AS ENUM ('TEXT', 'DRAWING', 'IMAGE', 'AUDIO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'FLAGGED', 'REJECTED');

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "type" "ContributionType" NOT NULL,
    "content" TEXT,
    "imagePath" TEXT,
    "drawingPath" TEXT,
    "audioPath" TEXT,
    "status" "Status" NOT NULL DEFAULT 'APPROVED',
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contributions_shortId_key" ON "contributions"("shortId");

-- CreateIndex
CREATE INDEX "contributions_x_y_idx" ON "contributions"("x", "y");

-- CreateIndex
CREATE INDEX "contributions_shortId_idx" ON "contributions"("shortId");

-- CreateIndex
CREATE INDEX "contributions_createdAt_idx" ON "contributions"("createdAt");
