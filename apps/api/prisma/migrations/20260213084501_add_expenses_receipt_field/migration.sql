-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "receiptId" INTEGER;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "UploadedFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
