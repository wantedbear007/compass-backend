/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barCodeID` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expireDate` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE product_productid_seq;
ALTER TABLE "Product" ADD COLUMN     "barCodeID" TEXT NOT NULL,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "expireDate" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT 'https://i.pinimg.com/736x/32/47/eb/3247eba14cadb3a7475b8e7edd2e0755.jpg',
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL DEFAULT 'SouthEast Asia',
ALTER COLUMN "productId" SET DEFAULT nextval('product_productid_seq');
ALTER SEQUENCE product_productid_seq OWNED BY "Product"."productId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile" SET DEFAULT 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg';

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");
