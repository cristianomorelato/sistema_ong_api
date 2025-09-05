-- DropIndex
DROP INDEX "User_id_identifier_email_userType_idx";

-- CreateTable
CREATE TABLE "Reception" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "phone" TEXT,
    "observations" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "addressId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Reception_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reception_identifier_key" ON "Reception"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Reception_cpf_key" ON "Reception"("cpf");

-- CreateIndex
CREATE INDEX "Reception_id_identifier_cpf_name_phone_userId_companyId_sta_idx" ON "Reception"("id", "identifier", "cpf", "name", "phone", "userId", "companyId", "status");

-- CreateIndex
CREATE INDEX "User_id_identifier_email_idx" ON "User"("id", "identifier", "email");

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
