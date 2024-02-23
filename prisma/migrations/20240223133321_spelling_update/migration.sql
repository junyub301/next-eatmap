/*
  Warnings:

  - You are about to drop the column `stroeType` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "stroeType",
ADD COLUMN     "storeType" TEXT;
