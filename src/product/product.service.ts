import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Status } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, companyId: number) {
    // Validação: nome único por companyId
    const existing = await this.prisma.product.findFirst({
      where: { name: dto.name, companyId },
    });
    if (existing) {
      throw new ConflictException(
        'Já existe um produto com este nome nesta empresa.',
      );
    }
    return this.prisma.product.create({ data: { ...dto, companyId } });
  }

  async findAll(query: {
    name?: string;
    status?: Status;
    companyId: number;
    productTypeId?: number;
  }) {
    const { name, status, companyId, productTypeId } = query;
    return this.prisma.product.findMany({
      where: {
        companyId,
        ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
        ...(status ? { status } : {}),
        ...(productTypeId ? { productTypeId } : {}),
      },
      orderBy: { name: 'asc' },
      include: {
        productType: {
          select: {
            id: true,
            name: true,
            unit_measure: true,
            status: true,
          },
        },
        productCompound: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
          },
        },
      },
    });
  }

  async findById(id: number, companyId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, companyId },
      include: {
        productType: {
          select: {
            id: true,
            name: true,
            unit_measure: true,
            status: true,
          },
        },
        productCompound: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Produto não encontrado.');
    return product;
  }

  async update(id: number, dto: UpdateProductDto, companyId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, companyId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado.');
    // Validação: nome único por companyId (exceto o próprio)
    if (dto.name) {
      const existing = await this.prisma.product.findFirst({
        where: { name: dto.name, companyId, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException(
          'Já existe um produto com este nome nesta empresa.',
        );
      }
    }
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async delete(id: number, companyId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, companyId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado.');
    return this.prisma.product.delete({ where: { id } });
  }
}
