/*
  Warnings:

  - You are about to drop the column `address` on the `Vendor` table. All the data in the column will be lost.
  - Added the required column `cuisine` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "cuisine" TEXT NOT NULL,
ADD COLUMN     "ingredients" TEXT[];

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "address",
ADD COLUMN     "cuisine" TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "operatingHours" JSONB;
