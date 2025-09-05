import { Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PrescriptionPermissionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  productCompoundsId: number;

  @ApiProperty({ example: 3 })
  productTypeId: number;

  @ApiProperty({ example: 15 })
  monthlyLimit: number;

  @ApiProperty({ example: true })
  allowed: boolean;

  @ApiProperty({ example: '2025-09-02T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-09-02T12:00:00.000Z' })
  updatedAt: string;
}

export class PrescriptionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'abc123' })
  identifier: string;

  @ApiProperty({ example: 1 })
  patientId: number;

  @ApiProperty({ example: 1 })
  doctorId: number;

  @ApiProperty({ example: '2025-09-02T12:00:00.000Z' })
  prescriptionDate: string;

  @ApiProperty({ example: 30 })
  validityDays: number;

  @ApiProperty({ example: '2025-09-02T12:00:00.000Z' })
  uploadedAt: string;

  @ApiProperty({
    example: 'https://meulink.com/prescricao.pdf',
    required: false,
  })
  linkPrescription?: string;

  @ApiProperty({ example: 'Diabetes', required: false })
  disease?: string;

  @ApiProperty({ example: 'Tomar em jejum', required: false })
  observations?: string;

  @ApiProperty({ enum: Status, example: 'ACTIVE' })
  status: Status;

  @ApiProperty({ example: '2025-09-02T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-09-02T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ type: [PrescriptionPermissionResponseDto] })
  prescriptionPermissions: PrescriptionPermissionResponseDto[];
}
