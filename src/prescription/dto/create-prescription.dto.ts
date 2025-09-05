import { Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PrescriptionPermissionDto {
  @ApiProperty({ example: 2 })
  productCompoundsId: number;

  @ApiProperty({ example: 3 })
  productTypeId: number;

  @ApiProperty({ example: 15, minimum: 1 })
  monthlyLimit: number;
}

export class CreatePrescriptionDto {
  @ApiProperty({ example: 1 })
  patientId: number;

  @ApiProperty({ example: 1 })
  doctorId: number;

  @ApiProperty({ example: '2025-09-02T12:00:00.000Z' })
  prescriptionDate: string;

  @ApiProperty({ example: 30, minimum: 1 })
  validityDays: number;

  @ApiProperty({
    example: 'https://meulink.com/prescricao.pdf',
    required: false,
  })
  linkPrescription?: string;

  @ApiProperty({ example: 'Diabetes', required: false })
  disease?: string;

  @ApiProperty({ example: 'Tomar em jejum', required: false })
  observations?: string;

  @ApiProperty({ example: 'ACTIVE', enum: Status, required: false })
  status?: Status;

  @ApiProperty({ type: [PrescriptionPermissionDto] })
  prescriptionPermissions: PrescriptionPermissionDto[];
}
