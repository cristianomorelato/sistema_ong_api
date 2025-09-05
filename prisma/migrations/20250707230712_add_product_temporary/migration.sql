-- CreateTable
CREATE TABLE "ProductTemporary" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "productType" TEXT NOT NULL,
    "unitMeasure" TEXT NOT NULL,
    "productCompound" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTemporary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTemporary_identifier_key" ON "ProductTemporary"("identifier");

-- CreateIndex
CREATE INDEX "ProductTemporary_id_identifier_name_status_description_idx" ON "ProductTemporary"("id", "identifier", "name", "status", "description");
