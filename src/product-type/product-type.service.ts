import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { Status } from '@prisma/client';

@Injectable()
export class ProductTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductTypeDto) {
    // Verifica se já existe um tipo com o mesmo nome e unidade
    const existing = await this.prisma.productType.findFirst({
      where: { name: dto.name, unit_measure: dto.unit_measure },
    });
    if (existing) {
      throw new ConflictException(
        'Já existe um tipo de produto com este nome e unidade.',
      );
    }
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new ConflictException('Nenhuma company cadastrada.');
    }
    return this.prisma.productType.create({
      data: {
        name: dto.name,
        unit_measure: dto.unit_measure,
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
    return this.prisma.productType.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: number, dto: Partial<UpdateProductTypeDto>) {
    // Se for atualizar o nome ou unidade, verifica se já existe outro tipo igual
    if (dto.name || dto.unit_measure) {
      const existing = await this.prisma.productType.findFirst({
        where: {
          name: dto.name,
          unit_measure: dto.unit_measure,
          id: { not: id },
        },
      });
      if (existing) {
        throw new ConflictException(
          'Já existe um tipo de produto com este nome e unidade.',
        );
      }
    }
    return this.prisma.productType.update({
      where: { id },
      data: dto,
    });
  }
}
