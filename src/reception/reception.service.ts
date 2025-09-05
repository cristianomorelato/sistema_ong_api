import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceptionDto } from './dto/create-reception.dto';
import * as bcrypt from 'bcrypt';
import { Status } from '@prisma/client';
import { isValidCpf } from '../common/validators/cpf.validator';
import { UpdateReceptionDto } from './dto/update-reception.dto';

@Injectable()
export class ReceptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceptionDto: CreateReceptionDto) {
    const cleanCpf = this.cleanCpf(createReceptionDto.cpf);
    const cleanPhone = this.cleanPhone(createReceptionDto.phone);

    if (!isValidCpf(cleanCpf)) {
      throw new ConflictException('CPF inválido.');
    }

    await this.validateUniqueReception(cleanCpf, createReceptionDto.email);

    const address = await this.createAddress(createReceptionDto);
    const user = await this.createUser(createReceptionDto);

    return this.createReceptionRecord(
      createReceptionDto,
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

  private async validateUniqueReception(cpf: string, email: string) {
    const existingReception = await this.prisma.reception.findFirst({
      where: {
        OR: [{ cpf }, { user: { email } }],
      },
      include: { user: true },
    });
    if (existingReception) {
      throw new ConflictException(
        'Acolhimento já cadastrado com este CPF ou e-mail.',
      );
    }
  }

  private async createAddress(dto: CreateReceptionDto) {
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

  private async createUser(dto: CreateReceptionDto) {
    // Verifica se já existe usuário com o e-mail
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        userType: 'RECEPTION',
      },
    });
  }

  private async createReceptionRecord(
    dto: CreateReceptionDto,
    cpf: string,
    phone: string | undefined,
    userId: number,
    addressId: number,
  ) {
    return this.prisma.reception.create({
      data: {
        name: dto.name,
        cpf,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        phone,
        observations: dto.observations,
        userId,
        companyId: dto.companyId,
        addressId,
        status: dto.status
          ? Status[dto.status as keyof typeof Status]
          : Status.ACTIVE,
      },
    });
  }

  async searchReceptions(params: {
    companyId: number;
    cpf?: string;
    name?: string;
    phone?: string;
    status?: string;
  }) {
    const { companyId, cpf, name, phone, status } = params;
    const cleanCpf = cpf ? cpf.replace(/\D/g, '') : undefined;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : undefined;
    const where: {
      companyId: number;
      cpf?: string;
      name?: { contains: string; mode: 'insensitive' };
      phone?: { contains: string; mode: 'insensitive' };
      status?: Status;
    } = { companyId };
    if (typeof cleanCpf === 'string' && cleanCpf) where.cpf = cleanCpf;
    if (typeof name === 'string' && name)
      where.name = { contains: name, mode: 'insensitive' };
    if (typeof cleanPhone === 'string' && cleanPhone)
      where.phone = { contains: cleanPhone, mode: 'insensitive' };
    if (typeof status === 'string' && status)
      where.status = Status[status as keyof typeof Status];
    return this.prisma.reception
      .findMany({
        where,
        orderBy: { id: 'desc' },
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
      .then((receptions) =>
        receptions.map((reception) => ({
          ...reception,
          email: reception.user?.email,
          user: undefined,
          addressId: undefined,
        })),
      );
  }

  async updateByIdentifier(identifier: string, dto: UpdateReceptionDto) {
    // Busca o reception existente pelo identifier
    const reception = await this.prisma.reception.findUnique({
      where: { identifier },
      include: { user: true, address: true },
    });
    if (!reception) {
      throw new ConflictException('Acolhimento não encontrado.');
    }

    // Validação de CPF/email duplicado (exceto o próprio)
    if (dto.cpf || dto.email) {
      const or: any[] = [];
      if (dto.cpf && dto.cpf !== reception.cpf) or.push({ cpf: dto.cpf });
      if (dto.email && dto.email !== reception.user.email)
        or.push({ user: { email: dto.email } });
      if (or.length) {
        const exists = await this.prisma.reception.findFirst({
          where: { OR: or, NOT: { identifier } },
          include: { user: true },
        });
        if (exists) {
          throw new ConflictException(
            'Já existe acolhimento com este CPF ou e-mail.',
          );
        }
      }
    }

    // Atualiza usuário se necessário
    if (dto.email || dto.password) {
      await this.prisma.user.update({
        where: { id: reception.userId },
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
        where: { id: reception.addressId },
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

    // Atualiza dados do reception
    return this.prisma.reception.update({
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
      },
    });
  }
}
