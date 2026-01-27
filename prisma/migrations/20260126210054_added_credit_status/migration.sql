-- CreateEnum
CREATE TYPE "StellaTransactionStatus" AS ENUM ('HELD', 'SETTLED', 'RELEASED');

-- AlterTable
ALTER TABLE "analysis_job" ADD COLUMN     "billingFinalized" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "stella_transaction" ADD COLUMN     "status" "StellaTransactionStatus" NOT NULL DEFAULT 'SETTLED';
