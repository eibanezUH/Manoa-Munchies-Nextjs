/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `foodType` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_userId_fkey";

-- DropIndex
DROP INDEX "Vendor_name_key";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "foodType",
DROP COLUMN "updatedAt",
ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "Stuff" ALTER COLUMN "condition" SET DEFAULT 'good';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "foodAversions" TEXT[],
ADD COLUMN     "foodPreferences" TEXT[];

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "createdAt",
DROP COLUMN "location",
DROP COLUMN "updatedAt",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT;

-- DropTable
DROP TABLE "Preference";

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_email_key" ON "Vendor"("email");
