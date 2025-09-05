import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import * as bcrypt from 'bcrypt';
import { Status } from '@prisma/client';
import { isValidCpf } from '../common/validators/cpf.validator';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdministratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    const cleanCpf = this.cleanCpf(createAdministratorDto.cpf);
    const cleanPhone = this.cleanPhone(createAdministratorDto.phone);

    if (!isValidCpf(cleanCpf)) {
      throw new ConflictException('CPF inválido.');
    }

    await this.validateUniqueAdministrator(
      cleanCpf,
      createAdministratorDto.email,
    );

    const address = await this.createAddress(createAdministratorDto);
    const user = await this.createUser(createAdministratorDto);

    return this.createAdministratorRecord(
      createAdministratorDto,
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

  private async validateUniqueAdministrator(cpf: string, email: string) {
    const existingAdministrator = await this.prisma.administrators.findFirst({
      where: {
        OR: [{ cpf }, { user: { email } }],
      },
      include: { user: true },
    });
    if (existingAdministrator) {
      throw new ConflictException(
        'Administrador já cadastrado com este CPF ou e-mail.',
      );
    }
  }

  private async createAddress(dto: CreateAdministratorDto) {
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

  private async createUser(dto: CreateAdministratorDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        userType: 'ADMIN',
      },
    });
  }

  private async createAdministratorRecord(
    dto: CreateAdministratorDto,
    cpf: string,
    phone: string | undefined,
    userId: number,
    addressId: number,
  ) {
    return this.prisma.administrators.create({
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

  async searchAdministrators(params: {
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
    return this.prisma.administrators
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
      .then((admins) =>
        admins.map((admin) => ({
          ...admin,
          email: admin.user?.email,
          user: undefined,
          addressId: undefined,
        })),
      );
  }

  async updateByIdentifier(identifier: string, dto: UpdateAdministratorDto) {
    // Busca o administrador existente pelo identifier
    const admin = await this.prisma.administrators.findUnique({
      where: { identifier },
      include: { user: true, address: true },
    });
    if (!admin) {
      throw new ConflictException('Administrador não encontrado.');
    }

    // Validação de CPF/email duplicado (exceto o próprio)
    if (dto.cpf || dto.email) {
      const or: Prisma.AdministratorsWhereInput[] = [];
      if (dto.cpf && dto.cpf !== admin.cpf) or.push({ cpf: dto.cpf });
      if (dto.email && dto.email !== admin.user.email)
        or.push({ user: { email: dto.email } });
      if (or.length) {
        const exists = await this.prisma.administrators.findFirst({
          where: { OR: or, NOT: { identifier } },
          include: { user: true },
        });
        if (exists) {
          throw new ConflictException(
            'Já existe administrador com este CPF ou e-mail.',
          );
        }
      }
    }

    // Validação de e-mail duplicado em User (fora do contexto de administradores)
    if (dto.email && dto.email !== admin.user.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: admin.userId } },
      });
      if (existingUser) {
        throw new ConflictException('Já existe usuário com este e-mail.');
      }
    }

    // Atualiza usuário se necessário
    if (dto.email || dto.password) {
      await this.prisma.user.update({
        where: { id: admin.userId },
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
        where: { id: admin.addressId },
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

    // Atualiza dados do administrador
    return this.prisma.administrators.update({
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
      },
    });
  }
}
