import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCompoundsDto } from './dto/create-product-compounds.dto';
import { Status } from '@prisma/client';

@Injectable()
export class ProductCompoundsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductCompoundsDto) {
    // Verifica se já existe um composto com o mesmo nome
    const existing = await this.prisma.productCompounds.findFirst({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Já existe um composto com este nome.');
    }
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new ConflictException('Nenhuma company cadastrada.');
    }
    return this.prisma.productCompounds.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status ? dto.status : Status.ACTIVE,
        company: { connect: { id: company.id } },
      },
    });
  }

  async findAll(query?: { name?: string; status?: Status; id?: number }) {
    const where: Record<string, unknown> = {};
    if (query && typeof query.name === 'string') {
      where.name = { contains: query.name, mode: 'insensitive' };
    }
    if (query && query.status) {
      where.status = query.status;
    }
    if (query && typeof query.id === 'number') {
      where.id = query.id;
    }
    return this.prisma.productCompounds.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: number, dto: Partial<CreateProductCompoundsDto>) {
    // Se for atualizar o nome, verifica se já existe outro composto com o mesmo nome
    if (dto.name) {
      const existing = await this.prisma.productCompounds.findFirst({
        where: { name: dto.name, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException('Já existe um composto com este nome.');
      }
    }
    return this.prisma.productCompounds.update({
      where: { id },
      data: dto,
    });
  }
}
