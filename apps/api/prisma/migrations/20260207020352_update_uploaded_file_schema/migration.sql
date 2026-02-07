/*
  Warnings:

  - You are about to drop the column `url` on the `UploadedFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[src]` on the table `UploadedFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `src` to the `UploadedFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UploadedFile_url_key";

-- AlterTable
ALTER TABLE "UploadedFile" DROP COLUMN "url",
ADD COLUMN     "src" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFile_src_key" ON "UploadedFile"("src");
