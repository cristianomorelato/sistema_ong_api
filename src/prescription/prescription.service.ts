import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescriptionResponseDto } from './dto/prescription-response.dto';
import { Status } from '@prisma/client';
import { Prisma, Prescription, PrescriptionPermission } from '@prisma/client';

@Injectable()
export class PrescriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async validatePatientAndDoctor(
    patientId: number,
    doctorId: number,
    companyId: number,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');
    if (patient.companyId !== companyId)
      throw new ForbiddenException(
        'Paciente não pertence à empresa do usuário',
      );
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) throw new NotFoundException('Médico não encontrado');
    if (doctor.companyId !== companyId)
      throw new ForbiddenException('Médico não pertence à empresa do usuário');
  }

  async create(
    dto: CreatePrescriptionDto,
    companyId: number,
  ): Promise<PrescriptionResponseDto> {
    await this.validatePatientAndDoctor(dto.patientId, dto.doctorId, companyId);
    if (dto.validityDays <= 0)
      throw new BadRequestException('validityDays deve ser maior que 0');
    dto.prescriptionPermissions.forEach((perm) => {
      if (perm.monthlyLimit <= 0)
        throw new BadRequestException('monthlyLimit deve ser maior que 0');
    });
    const data: Prisma.PrescriptionCreateInput = {
      patient: { connect: { id: dto.patientId } },
      doctor: { connect: { id: dto.doctorId } },
      prescriptionDate: new Date(dto.prescriptionDate),
      validityDays: dto.validityDays,
      linkPrescription: dto.linkPrescription,
      disease: dto.disease,
      observations: dto.observations,
      status: dto.status ?? Status.ACTIVE,
      prescriptionPermissions: {
        create: dto.prescriptionPermissions.map((perm) => ({
          productCompounds: { connect: { id: perm.productCompoundsId } },
          productType: { connect: { id: perm.productTypeId } },
          monthlyLimit: perm.monthlyLimit,
        })),
      },
    };
    const prescription = await this.prisma.prescription.create({
      data,
      include: { prescriptionPermissions: true },
    });
    return this.toResponseDto(prescription);
  }

  async updateByIdentifier(
    identifier: string,
    dto: UpdatePrescriptionDto,
    companyId: number,
  ): Promise<PrescriptionResponseDto> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { identifier },
      include: { prescriptionPermissions: true },
    });
    if (!prescription) throw new NotFoundException('Prescrição não encontrada');
    await this.validatePatientAndDoctor(dto.patientId, dto.doctorId, companyId);
    if (dto.validityDays <= 0)
      throw new BadRequestException('validityDays deve ser maior que 0');
    dto.prescriptionPermissions.forEach((perm) => {
      if (perm.monthlyLimit <= 0)
        throw new BadRequestException('monthlyLimit deve ser maior que 0');
    });
    await this.prisma.$transaction([
      this.prisma.prescription.update({
        where: { identifier },
        data: {
          patient: { connect: { id: dto.patientId } },
          doctor: { connect: { id: dto.doctorId } },
          prescriptionDate: new Date(dto.prescriptionDate),
          validityDays: dto.validityDays,
          linkPrescription: dto.linkPrescription,
          disease: dto.disease,
          observations: dto.observations,
          status: dto.status ?? Status.ACTIVE,
        },
      }),
      this.prisma.prescriptionPermission.deleteMany({
        where: { prescriptionId: prescription.id },
      }),
      ...dto.prescriptionPermissions.map((perm) =>
        this.prisma.prescriptionPermission.create({
          data: {
            prescription: { connect: { id: prescription.id } },
            productCompounds: { connect: { id: perm.productCompoundsId } },
            productType: { connect: { id: perm.productTypeId } },
            monthlyLimit: perm.monthlyLimit,
          },
        }),
      ),
    ]);
    const updatedPrescription = await this.prisma.prescription.findUnique({
      where: { identifier },
      include: { prescriptionPermissions: true },
    });
    if (!updatedPrescription)
      throw new NotFoundException('Prescrição não encontrada após atualização');
    return this.toResponseDto(updatedPrescription);
  }

  async findAll(params: {
    patientId: number;
    doctorId?: number;
    status?: Status;
    disease?: string;
    companyId: number;
  }): Promise<PrescriptionResponseDto[]> {
    const { patientId, doctorId, status, disease, companyId } = params;
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');
    if (patient.companyId !== companyId)
      throw new ForbiddenException(
        'Paciente não pertence à empresa do usuário',
      );
    const where: Prisma.PrescriptionWhereInput = {
      patientId,
      doctorId,
      status,
      disease: disease ? { contains: disease, mode: 'insensitive' } : undefined,
    };
    const prescriptions = await this.prisma.prescription.findMany({
      where,
      include: { prescriptionPermissions: true },
      orderBy: { prescriptionDate: 'desc' },
    });
    return prescriptions.map((p) => this.toResponseDto(p));
  }

  toResponseDto(
    prescription: Prescription & {
      prescriptionPermissions: PrescriptionPermission[];
    },
  ): PrescriptionResponseDto {
    return {
      id: prescription.id,
      identifier: prescription.identifier,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      prescriptionDate: prescription.prescriptionDate.toISOString(),
      validityDays: prescription.validityDays,
      uploadedAt: prescription.uploadedAt.toISOString(),
      linkPrescription: prescription.linkPrescription ?? undefined,
      disease: prescription.disease ?? undefined,
      observations: prescription.observations ?? undefined,
      status: prescription.status,
      createdAt: prescription.createdAt.toISOString(),
      updatedAt: prescription.updatedAt.toISOString(),
      prescriptionPermissions: (prescription.prescriptionPermissions || []).map(
        (perm) => ({
          id: perm.id,
          productCompoundsId: perm.productCompoundsId,
          productTypeId: perm.productTypeId,
          monthlyLimit: perm.monthlyLimit,
          allowed: perm.allowed,
          createdAt: perm.createdAt.toISOString(),
          updatedAt: perm.updatedAt.toISOString(),
        }),
      ),
    };
  }
}
