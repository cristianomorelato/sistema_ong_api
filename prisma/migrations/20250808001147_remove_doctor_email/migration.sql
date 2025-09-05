/*
  Warnings:

  - You are about to drop the column `email` on the `Doctor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Doctor_id_identifier_email_phone_userId_documentDoctorType__idx";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "email";

-- CreateIndex
CREATE INDEX "Doctor_id_identifier_phone_userId_documentDoctorType_docume_idx" ON "Doctor"("id", "identifier", "phone", "userId", "documentDoctorType", "documentDoctorNumber", "documentDoctorUf");
