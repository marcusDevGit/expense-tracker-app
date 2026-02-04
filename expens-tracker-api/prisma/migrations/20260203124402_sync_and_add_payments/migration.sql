/*
  Warnings:

  - You are about to drop the column `recurrencetType` on the `Expense` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH', 'BANK_TRANSFER', 'OTHER');

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "recurrencetType",
ADD COLUMN     "currentInstallment" INTEGER DEFAULT 1,
ADD COLUMN     "installments" INTEGER DEFAULT 1,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "recurrenceType" "RecurrenceType";
