-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "StellaBucket" AS ENUM ('MONTHLY', 'TOPUP');

-- CreateEnum
CREATE TYPE "StellaReason" AS ENUM ('MONTHLY_GRANT', 'TOPUP_PURCHASE', 'FEATURE_USAGE', 'REFUND', 'ADMIN_ADJUSTMENT', 'EXPIRY');

-- CreateEnum
CREATE TYPE "Feature" AS ENUM ('AI_CONSULTANT', 'COMPETITOR_ANALYSIS', 'AUTO_ANALYSIS');

-- CreateTable
CREATE TABLE "plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "monthlyStellasGrant" INTEGER NOT NULL,
    "competitorAnalysisAccess" BOOLEAN NOT NULL DEFAULT false,
    "aiConsultantAccess" BOOLEAN NOT NULL DEFAULT false,
    "dailyAutoAnalysisEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planId" UUID NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerProductId" TEXT NOT NULL,
    "billingPeriod" "BillingPeriod" NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerSubscriptionId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "monthlyBalance" INTEGER NOT NULL DEFAULT 0,
    "topupBalance" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stella_transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "bucket" "StellaBucket" NOT NULL,
    "reason" "StellaReason" NOT NULL,
    "metadata" JSONB,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stella_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_allowance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "feature" "Feature" NOT NULL,
    "totalAllowed" INTEGER NOT NULL,
    "consumedUses" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_allowance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_name_key" ON "plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_product_providerProductId_key" ON "payment_product"("providerProductId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_providerSubscriptionId_key" ON "subscription"("providerSubscriptionId");

-- CreateIndex
CREATE INDEX "subscription_userId_idx" ON "subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_userId_key" ON "wallet"("userId");

-- CreateIndex
CREATE INDEX "stella_transaction_userId_idx" ON "stella_transaction"("userId");

-- CreateIndex
CREATE INDEX "stella_transaction_userId_bucket_idx" ON "stella_transaction"("userId", "bucket");

-- CreateIndex
CREATE INDEX "feature_allowance_userId_idx" ON "feature_allowance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "feature_allowance_userId_feature_key" ON "feature_allowance"("userId", "feature");

-- AddForeignKey
ALTER TABLE "payment_product" ADD CONSTRAINT "payment_product_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stella_transaction" ADD CONSTRAINT "stella_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_allowance" ADD CONSTRAINT "feature_allowance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
