-- CreateTable
CREATE TABLE "PrescriptionPermission" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "productCompoundsId" INTEGER NOT NULL,
    "productTypeId" INTEGER NOT NULL,
    "monthlyLimit" INTEGER NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrescriptionPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrescriptionPermission_id_prescriptionId_productCompoundsId_idx" ON "PrescriptionPermission"("id", "prescriptionId", "productCompoundsId", "productTypeId", "allowed", "monthlyLimit");

-- AddForeignKey
ALTER TABLE "PrescriptionPermission" ADD CONSTRAINT "PrescriptionPermission_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionPermission" ADD CONSTRAINT "PrescriptionPermission_productCompoundsId_fkey" FOREIGN KEY ("productCompoundsId") REFERENCES "ProductCompounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionPermission" ADD CONSTRAINT "PrescriptionPermission_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
