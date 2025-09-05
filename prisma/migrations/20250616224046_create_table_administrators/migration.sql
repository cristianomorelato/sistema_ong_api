-- CreateTable
CREATE TABLE "Administrators" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "phone" TEXT,
    "observations" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "addressId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Administrators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrators_identifier_key" ON "Administrators"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Administrators_cpf_key" ON "Administrators"("cpf");

-- CreateIndex
CREATE INDEX "Administrators_id_userId_companyId_idx" ON "Administrators"("id", "userId", "companyId");

-- AddForeignKey
ALTER TABLE "Administrators" ADD CONSTRAINT "Administrators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrators" ADD CONSTRAINT "Administrators_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrators" ADD CONSTRAINT "Administrators_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
