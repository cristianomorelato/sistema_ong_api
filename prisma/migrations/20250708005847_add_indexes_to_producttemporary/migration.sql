-- DropIndex
DROP INDEX "ProductTemporary_id_identifier_name_status_description_idx";

-- CreateIndex
CREATE INDEX "ProductTemporary_id_identifier_name_status_description_prod_idx" ON "ProductTemporary"("id", "identifier", "name", "status", "description", "productType", "unitMeasure", "productCompound");
