/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ProductCompounds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductCompounds_name_key" ON "ProductCompounds"("name");
