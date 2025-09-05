import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import * as bcrypt from 'bcrypt';
import { Status } from '@prisma/client';
import { isValidCpf } from '../common/validators/cpf.validator';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    const cleanCpf = this.cleanCpf(createPatientDto.cpf);
    const cleanPhone = this.cleanPhone(createPatientDto.phone);

    if (!isValidCpf(cleanCpf)) {
      throw new ConflictException('CPF inválido.');
    }

    await this.validateUniquePatient(cleanCpf, createPatientDto.email);

    const address = await this.createAddress(createPatientDto);
    const user = await this.createUser(createPatientDto);

    return this.createPatientRecord(
      createPatientDto,
      cleanCpf,
      cleanPhone,
      user.id,
      address.id,
    );
  }

  private cleanCpf(cpf: string) {
    return cpf.replace(/\D/g, '');
  }

  private cleanPhone(phone?: string) {
    return phone ? phone.replace(/\D/g, '') : undefined;
  }

  private async validateUniquePatient(cpf: string, email: string) {
    // Verifica CPF na tabela Patient
    let existingPatient: any = null;
    if (cpf) {
      existingPatient = await this.prisma.patient.findFirst({
        where: { cpf },
      });
    }
    // Verifica e-mail na tabela User
    let existingUser: any = null;
    if (email) {
      existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
    }
    if (existingPatient) {
      throw new ConflictException('Paciente já cadastrado com este CPF.');
    }
    if (existingUser) {
      throw new ConflictException('Paciente já cadastrado com este e-mail.');
    }
  }

  private async createAddress(dto: CreatePatientDto) {
    return this.prisma.address.create({
      data: {
        street: dto.street,
        number: dto.number,
        complement: dto.complement,
        neighborhood: dto.neighborhood,
        cityId: dto.cityId,
        stateId: dto.stateId,
        zipCode: dto.zipCode,
      },
    });
  }

  private async createUser(dto: CreatePatientDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        userType: 'PATIENT',
      },
    });
  }

  private async createPatientRecord(
    dto: CreatePatientDto,
    cpf: string,
    phone: string | undefined,
    userId: number,
    addressId: number,
  ) {
    return this.prisma.patient.create({
      data: {
        name: dto.name,
        cpf,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        phone,
        observations: dto.observations,
        userId,
        companyId: dto.companyId,
        doctorId: dto.doctorId,
        addressId,
        status: dto.status
          ? Status[dto.status as keyof typeof Status]
          : Status.ACTIVE,
      },
    });
  }

  async searchPatients(params: {
    companyId: number;
    cpf?: string;
    name?: string;
    phone?: string;
    email?: string;
    status?: string;
  }) {
    const { companyId, cpf, name, phone, email, status } = params;
    const cleanCpf = cpf ? cpf.replace(/\D/g, '') : undefined;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : undefined;
    const where: {
      companyId: number;
      cpf?: string;
      name?: { contains: string; mode: 'insensitive' };
      phone?: { contains: string; mode: 'insensitive' };
      email?: { contains: string; mode: 'insensitive' };
      status?: Status;
    } = { companyId };
    if (typeof cleanCpf === 'string' && cleanCpf) where.cpf = cleanCpf;
    if (typeof name === 'string' && name)
      where.name = { contains: name, mode: 'insensitive' };
    if (typeof cleanPhone === 'string' && cleanPhone)
      where.phone = { contains: cleanPhone, mode: 'insensitive' };
    if (typeof email === 'string' && email)
      where.email = { contains: email, mode: 'insensitive' };
    if (typeof status === 'string' && status)
      where.status = Status[status as keyof typeof Status];
    return (
      await this.prisma.patient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 70,
        select: {
          id: true,
          identifier: true,
          name: true,
          cpf: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          observations: true,
          status: true,
          userId: true,
          companyId: true,
          doctorId: true,
          address: {
            select: {
              id: true,
              street: true,
              number: true,
              complement: true,
              neighborhood: true,
              cityId: true,
              stateId: true,
              zipCode: true,
            },
          },
          user: { select: { email: true } },
        },
      })
    ).map((patient) => ({
      ...patient,
      email: patient.user?.email,
      user: undefined,
      addressId: undefined,
    }));
  }

  async updateByIdentifier(identifier: string, dto: UpdatePatientDto) {
    // Busca o paciente existente pelo identifier
    const patient = await this.prisma.patient.findUnique({
      where: { identifier },
      include: { user: true, address: true },
    });
    if (!patient) {
      throw new ConflictException('Paciente não encontrado.');
    }

    // Validação de CPF/email duplicado (exceto o próprio)
    if (dto.cpf || dto.email) {
      const or: any[] = [];
      if (dto.cpf && dto.cpf !== patient.cpf) or.push({ cpf: dto.cpf });
      if (dto.email && dto.email !== patient.user.email)
        or.push({ user: { email: dto.email } });
      if (or.length) {
        const exists = await this.prisma.patient.findFirst({
          where: { OR: or, NOT: { identifier } },
          include: { user: true },
        });
        if (exists) {
          throw new ConflictException(
            'Já existe paciente com este CPF ou e-mail.',
          );
        }
      }
    }

    // Atualiza usuário se necessário
    if (dto.email || dto.password) {
      await this.prisma.user.update({
        where: { id: patient.userId },
        data: {
          ...(dto.email ? { email: dto.email } : {}),
          ...(dto.password
            ? { password: await bcrypt.hash(dto.password, 10) }
            : {}),
        },
      });
    }

    // Atualiza endereço se necessário
    if (
      dto.street ||
      dto.number ||
      dto.complement ||
      dto.neighborhood ||
      dto.cityId ||
      dto.stateId ||
      dto.zipCode
    ) {
      await this.prisma.address.update({
        where: { id: patient.addressId },
        data: {
          ...(dto.street ? { street: dto.street } : {}),
          ...(dto.number ? { number: dto.number } : {}),
          ...(dto.complement ? { complement: dto.complement } : {}),
          ...(dto.neighborhood ? { neighborhood: dto.neighborhood } : {}),
          ...(dto.cityId ? { cityId: dto.cityId } : {}),
          ...(dto.stateId ? { stateId: dto.stateId } : {}),
          ...(dto.zipCode ? { zipCode: dto.zipCode } : {}),
        },
      });
    }

    // Atualiza dados do paciente
    return this.prisma.patient.update({
      where: { identifier },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.cpf ? { cpf: dto.cpf } : {}),
        ...(dto.dateOfBirth ? { dateOfBirth: new Date(dto.dateOfBirth) } : {}),
        ...(dto.gender ? { gender: dto.gender } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.observations ? { observations: dto.observations } : {}),
        ...(dto.status
          ? { status: Status[dto.status as keyof typeof Status] }
          : {}),
        ...(dto.companyId ? { companyId: dto.companyId } : {}),
        ...(dto.doctorId ? { doctorId: dto.doctorId } : {}),
      },
    });
  }
}
