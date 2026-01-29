/*
  Warnings:

  - Added the required column `type` to the `payment_product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SUBSCRIPTION', 'ONE_TIME');

-- DropForeignKey
ALTER TABLE "payment_product" DROP CONSTRAINT "payment_product_planId_fkey";

-- AlterTable
ALTER TABLE "payment_product" ADD COLUMN     "bundleId" UUID,
ADD COLUMN     "type" "PaymentType" NOT NULL,
ALTER COLUMN "planId" DROP NOT NULL,
ALTER COLUMN "billingPeriod" DROP NOT NULL;

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'SUBSCRIPTION';

-- CreateTable
CREATE TABLE "stella_bundle" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "stellaAmount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stella_bundle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payment_product" ADD CONSTRAINT "payment_product_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_product" ADD CONSTRAINT "payment_product_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "stella_bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
