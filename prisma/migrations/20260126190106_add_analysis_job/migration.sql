-- CreateEnum
CREATE TYPE "AnalysisJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "analysis_job" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "socialAccountId" UUID NOT NULL,
    "status" "AnalysisJobStatus" NOT NULL DEFAULT 'PENDING',
    "stellaCost" INTEGER NOT NULL,
    "externalJobId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "analysis_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analysis_job_userId_idx" ON "analysis_job"("userId");

-- CreateIndex
CREATE INDEX "analysis_job_userId_status_idx" ON "analysis_job"("userId", "status");

-- AddForeignKey
ALTER TABLE "analysis_job" ADD CONSTRAINT "analysis_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
