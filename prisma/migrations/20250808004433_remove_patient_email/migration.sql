/*
  Warnings:

  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Patient_id_identifier_cpf_name_phone_email_status_userId_co_idx";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "email";

-- CreateIndex
CREATE INDEX "Patient_id_identifier_cpf_name_phone_status_userId_companyI_idx" ON "Patient"("id", "identifier", "cpf", "name", "phone", "status", "userId", "companyId", "doctorId");
