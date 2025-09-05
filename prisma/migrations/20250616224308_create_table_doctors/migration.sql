-- CreateEnum
CREATE TYPE "DocumentDoctorType" AS ENUM ('CRM', 'CRMV');

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentDoctorType" "DocumentDoctorType" NOT NULL DEFAULT 'CRM',
    "documentDoctorNumber" TEXT,
    "documentDoctorUf" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "observations" TEXT,
    "userId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "addressId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_identifier_key" ON "Doctor"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_documentDoctorNumber_key" ON "Doctor"("documentDoctorNumber");

-- CreateIndex
CREATE INDEX "Doctor_id_identifier_email_phone_userId_documentDoctorType__idx" ON "Doctor"("id", "identifier", "email", "phone", "userId", "documentDoctorType", "documentDoctorNumber", "documentDoctorUf");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
