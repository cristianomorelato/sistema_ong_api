/*
  Warnings:

  - A unique constraint covering the columns `[name,companyId]` on the table `ProductCompounds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,unit_measure,companyId]` on the table `ProductType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productCompoundId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `ProductCompounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `ProductType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productCompoundId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductCompounds" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductType" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductCompounds_name_companyId_key" ON "ProductCompounds"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_name_unit_measure_companyId_key" ON "ProductType"("name", "unit_measure", "companyId");

-- AddForeignKey
ALTER TABLE "ProductType" ADD CONSTRAINT "ProductType_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCompounds" ADD CONSTRAINT "ProductCompounds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productCompoundId_fkey" FOREIGN KEY ("productCompoundId") REFERENCES "ProductCompounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
