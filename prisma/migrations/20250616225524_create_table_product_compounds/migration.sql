-- CreateTable
CREATE TABLE "ProductCompounds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ProductCompounds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductCompounds_id_name_description_status_idx" ON "ProductCompounds"("id", "name", "description", "status");
