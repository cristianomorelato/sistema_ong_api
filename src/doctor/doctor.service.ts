import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import * as bcrypt from 'bcrypt';
import { Status, DocumentDoctorType } from '@prisma/client';
import { isValidCpf } from '../common/validators/cpf.validator';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const cleanCpf = this.cleanCpf(createDoctorDto.cpf);
    const cleanPhone = this.cleanPhone(createDoctorDto.phone);

    if (!isValidCpf(cleanCpf)) {
      throw new ConflictException('CPF inválido.');
    }

    await this.validateUniqueDoctor(
      cleanCpf,
      createDoctorDto.email,
      createDoctorDto.documentDoctorNumber,
    );

    const address = await this.createAddress(createDoctorDto);
    const user = await this.createUser(createDoctorDto);

    return this.createDoctorRecord(
      createDoctorDto,
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

  private async validateUniqueDoctor(
    cpf: string,
    email: string,
    documentDoctorNumber?: string,
  ) {
    // Verifica CPF e documento na tabela Doctor
    let existingDoctor: any = null;
    if (cpf && documentDoctorNumber) {
      existingDoctor = await this.prisma.doctor.findFirst({
        where: {
          OR: [{ cpf }, { documentDoctorNumber }],
        },
      });
    } else if (cpf) {
      existingDoctor = await this.prisma.doctor.findFirst({
        where: { cpf },
      });
    } else if (documentDoctorNumber) {
      existingDoctor = await this.prisma.doctor.findFirst({
        where: { documentDoctorNumber },
      });
    }
    // Verifica e-mail na tabela User
    let existingUser: any = null;
    if (email) {
      existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
    }
    if (existingDoctor) {
      throw new ConflictException(
        'Médico já cadastrado com este CPF ou documento.',
      );
    }
    if (existingUser) {
      throw new ConflictException('Médico já cadastrado com este e-mail.');
    }
  }

  private async createAddress(dto: CreateDoctorDto) {
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

  private async createUser(dto: CreateDoctorDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        userType: 'DOCTOR',
      },
    });
  }

  private async createDoctorRecord(
    dto: CreateDoctorDto,
    cpf: string,
    phone: string | undefined,
    userId: number,
    addressId: number,
  ) {
    return this.prisma.doctor.create({
      data: {
        name: dto.name,
        cpf: cpf,
        documentDoctorType: dto.documentDoctorType
          ? DocumentDoctorType[
              dto.documentDoctorType as keyof typeof DocumentDoctorType
            ]
          : DocumentDoctorType.CRM,
        documentDoctorNumber: dto.documentDoctorNumber,
        documentDoctorUf: dto.documentDoctorUf,
        phone,
        observations: dto.observations,
        userId: userId,
        companyId: dto.companyId,
        addressId: addressId,
        status: dto.status
          ? Status[dto.status as keyof typeof Status]
          : Status.ACTIVE,
      } as import('@prisma/client').Prisma.DoctorUncheckedCreateInput,
    });
  }

  async searchDoctors(params: {
    companyId: number;
    cpf?: string;
    name?: string;
    phone?: string;
    email?: string;
    documentDoctorNumber?: string;
    status?: string;
    identifier?: string;
  }) {
    const {
      companyId,
      cpf,
      name,
      phone,
      email,
      documentDoctorNumber,
      status,
      identifier,
    } = params;
    const cleanCpf =
      typeof cpf === 'string' ? cpf.replace(/\D/g, '') : undefined;
    const cleanPhone =
      typeof phone === 'string' ? phone.replace(/\D/g, '') : undefined;
    const where: Prisma.DoctorWhereInput = { companyId };
    // Corrige acesso inseguro ao parâmetro identifier
    if (typeof identifier === 'string' && identifier.trim() !== '') {
      where.identifier = identifier;
    }
    if (cleanCpf && cleanCpf.length === 11) where.cpf = cleanCpf;
    if (typeof name === 'string' && name)
      where.name = { contains: name, mode: 'insensitive' };
    if (cleanPhone && cleanPhone.length >= 8)
      where.phone = { contains: cleanPhone, mode: 'insensitive' };
    if (typeof documentDoctorNumber === 'string' && documentDoctorNumber)
      where.documentDoctorNumber = {
        contains: documentDoctorNumber,
        mode: 'insensitive',
      };
    if (typeof status === 'string' && status)
      where.status = Status[status as keyof typeof Status];

    // Busca pelo e-mail do usuário relacionado
    const userWhere: Prisma.DoctorWhereInput = email
      ? { user: { email: { contains: email, mode: 'insensitive' } } }
      : {};

    return (
      await this.prisma.doctor.findMany({
        where: { ...where, ...userWhere },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          identifier: true,
          name: true,
          cpf: true,
          documentDoctorType: true,
          documentDoctorNumber: true,
          documentDoctorUf: true,
          phone: true,
          observations: true,
          status: true,
          userId: true,
          companyId: true,
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
    ).map((doctor) => ({
      ...doctor,
      email: doctor.user.email,
      user: undefined,
      addressId: undefined,
    }));
  }

  async updateByIdentifier(identifier: string, dto: UpdateDoctorDto) {
    // Busca o médico existente pelo identifier
    const doctor = await this.prisma.doctor.findUnique({
      where: { identifier },
      include: { user: true, address: true },
    });
    if (!doctor) {
      throw new ConflictException('Médico não encontrado.');
    }

    // Validação de CPF, documento e e-mail duplicados (exceto o próprio)
    if (dto.cpf || dto.email || dto.documentDoctorNumber) {
      const or: Prisma.DoctorWhereInput[] = [];
      if (dto.cpf && dto.cpf !== doctor.cpf) or.push({ cpf: dto.cpf });
      if (
        dto.documentDoctorNumber &&
        dto.documentDoctorNumber !== doctor.documentDoctorNumber
      )
        or.push({ documentDoctorNumber: dto.documentDoctorNumber });
      if (or.length) {
        const exists = await this.prisma.doctor.findFirst({
          where: { OR: or, NOT: { identifier } },
        });
        if (exists) {
          throw new ConflictException(
            'Já existe médico com este CPF ou documento.',
          );
        }
      }
      if (dto.email && dto.email !== doctor.user.email) {
        const userExists = await this.prisma.user.findUnique({
          where: { email: dto.email },
        });
        if (userExists) {
          throw new ConflictException('Já existe médico com este e-mail.');
        }
      }
    }

    // Atualiza usuário se necessário
    if (dto.email || dto.password) {
      await this.prisma.user.update({
        where: { id: doctor.userId },
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
        where: { id: doctor.addressId },
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

    // Atualiza dados do médico
    return this.prisma.doctor.update({
      where: { identifier },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.cpf ? { cpf: dto.cpf } : {}),
        ...(dto.documentDoctorType
          ? {
              documentDoctorType:
                DocumentDoctorType[
                  dto.documentDoctorType as keyof typeof DocumentDoctorType
                ],
            }
          : {}),
        ...(dto.documentDoctorNumber
          ? { documentDoctorNumber: dto.documentDoctorNumber }
          : {}),
        ...(dto.documentDoctorUf
          ? { documentDoctorUf: dto.documentDoctorUf }
          : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.observations ? { observations: dto.observations } : {}),
        ...(dto.status
          ? { status: Status[dto.status as keyof typeof Status] }
          : {}),
      },
    });
  }
}
