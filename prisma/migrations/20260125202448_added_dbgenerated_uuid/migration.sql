/*
  Warnings:

  - The primary key for the `competitor_research` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `competitor_research` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `niche_research` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `niche_research` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `overall_strategy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `overall_strategy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `research` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `research` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `script_suggestions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `script_suggestions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `social_account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `social_account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `twitter_research` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `twitter_research` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_research` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_research` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `researchId` on the `competitor_research` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `researchId` on the `niche_research` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `researchId` on the `overall_strategy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `socialAccountId` on the `research` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `researchId` on the `script_suggestions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `social_account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `researchId` on the `twitter_research` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `researchId` on the `user_research` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "competitor_research" DROP CONSTRAINT "competitor_research_researchId_fkey";

-- DropForeignKey
ALTER TABLE "niche_research" DROP CONSTRAINT "niche_research_researchId_fkey";

-- DropForeignKey
ALTER TABLE "overall_strategy" DROP CONSTRAINT "overall_strategy_researchId_fkey";

-- DropForeignKey
ALTER TABLE "research" DROP CONSTRAINT "research_socialAccountId_fkey";

-- DropForeignKey
ALTER TABLE "script_suggestions" DROP CONSTRAINT "script_suggestions_researchId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "social_account" DROP CONSTRAINT "social_account_userId_fkey";

-- DropForeignKey
ALTER TABLE "twitter_research" DROP CONSTRAINT "twitter_research_researchId_fkey";

-- DropForeignKey
ALTER TABLE "user_research" DROP CONSTRAINT "user_research_researchId_fkey";

-- AlterTable
ALTER TABLE "account" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "competitor_research" DROP CONSTRAINT "competitor_research_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "researchId",
ADD COLUMN     "researchId" UUID NOT NULL,
ADD CONSTRAINT "competitor_research_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "niche_research" DROP CONSTRAINT "niche_research_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "researchId",
ADD COLUMN     "researchId" UUID NOT NULL,
ADD CONSTRAINT "niche_research_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "overall_strategy" DROP CONSTRAINT "overall_strategy_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "researchId",
ADD COLUMN     "researchId" UUID NOT NULL,
ADD CONSTRAINT "overall_strategy_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "research" DROP CONSTRAINT "research_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "socialAccountId",
ADD COLUMN     "socialAccountId" UUID NOT NULL,
ADD CONSTRAINT "research_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "script_suggestions" DROP CONSTRAINT "script_suggestions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "researchId",
ADD COLUMN     "researchId" UUID NOT NULL,
ADD CONSTRAINT "script_suggestions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "session" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "social_account" DROP CONSTRAINT "social_account_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "social_account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "twitter_research" DROP CONSTRAINT "twitter_research_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "researchId",
ADD COLUMN     "researchId" UUID NOT NULL,
ADD CONSTRAINT "twitter_research_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_research" DROP CONSTRAINT "user_research_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "researchId",
ADD COLUMN     "researchId" UUID NOT NULL,
ADD CONSTRAINT "user_research_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_research_researchId_key" ON "competitor_research"("researchId");

-- CreateIndex
CREATE UNIQUE INDEX "niche_research_researchId_key" ON "niche_research"("researchId");

-- CreateIndex
CREATE UNIQUE INDEX "overall_strategy_researchId_key" ON "overall_strategy"("researchId");

-- CreateIndex
CREATE UNIQUE INDEX "script_suggestions_researchId_key" ON "script_suggestions"("researchId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "twitter_research_researchId_key" ON "twitter_research"("researchId");

-- CreateIndex
CREATE UNIQUE INDEX "user_research_researchId_key" ON "user_research"("researchId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_account" ADD CONSTRAINT "social_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research" ADD CONSTRAINT "research_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "social_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_suggestions" ADD CONSTRAINT "script_suggestions_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overall_strategy" ADD CONSTRAINT "overall_strategy_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_research" ADD CONSTRAINT "user_research_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_research" ADD CONSTRAINT "competitor_research_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "niche_research" ADD CONSTRAINT "niche_research_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twitter_research" ADD CONSTRAINT "twitter_research_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;
