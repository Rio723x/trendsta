-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "niche" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "subNiche" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC+00:00';

-- CreateTable
CREATE TABLE "webhook_event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "webhookId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "providerPaymentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL,
    "subscriptionId" TEXT,
    "invoiceUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhook_event_webhookId_key" ON "webhook_event"("webhookId");

-- CreateIndex
CREATE INDEX "webhook_event_webhookId_idx" ON "webhook_event"("webhookId");

-- CreateIndex
CREATE INDEX "webhook_event_eventType_idx" ON "webhook_event"("eventType");

-- CreateIndex
CREATE UNIQUE INDEX "payment_providerPaymentId_key" ON "payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "payment"("userId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
