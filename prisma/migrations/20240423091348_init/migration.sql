/*
  Warnings:

  - You are about to drop the column `productId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unique` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `expireDate` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productId_fkey";

-- DropIndex
DROP INDEX "Product_productId_key";

-- DropIndex
DROP INDEX "User_unique_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
DROP COLUMN "expireDate",
ADD COLUMN     "expireDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "unique";

-- CreateIndex
CREATE UNIQUE INDEX "Product_authorId_key" ON "Product"("authorId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
