import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductTemporaryService {
  constructor(private readonly prisma: PrismaService) {}

  async findFlowersGroupedByCompound(companyId: number) {
    const products = await this.prisma.productTemporary.findMany({
      where: {
        quantity: { gt: 0 },
        productType: 'flower',
        companyId: companyId,
      },
      orderBy: { productCompound: 'asc' },
    });

    const grouped: Record<string, typeof products> = {};
    for (const product of products) {
      if (!grouped[product.productCompound]) {
        grouped[product.productCompound] = [];
      }
      grouped[product.productCompound].push(product);
    }
    return grouped;
  }

  async debitStock(identifier: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.productTemporary.findUnique({
      where: { identifier },
    });
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    if (product.quantity < quantity) {
      throw new Error('Estoque insuficiente');
    }
    await this.prisma.productTemporary.update({
      where: { identifier },
      data: { quantity: { decrement: Number(quantity) } },
    });
    return true;
  }

  async hasStock(identifier: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.productTemporary.findUnique({
      where: { identifier },
    });
    if (!product) return false;
    return product.quantity >= quantity;
  }

  async addStock(
    identifier: string,
    quantity: number,
  ): Promise<{ success: boolean; message: string; totalStock?: number }> {
    if (
      !identifier ||
      typeof identifier !== 'string' ||
      identifier.trim() === ''
    ) {
      return { success: false, message: 'Identificador do produto inválido.' };
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      return { success: false, message: 'Quantidade inválida.' };
    }

    const product = await this.prisma.productTemporary.findUnique({
      where: { identifier },
    });
    if (!product) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    await this.prisma.productTemporary.update({
      where: { identifier },
      data: { quantity: { increment: Number(quantity) } },
    });

    const updatedProduct = await this.prisma.productTemporary.findUnique({
      where: { identifier },
    });

    if (!updatedProduct) {
      throw new Error('Erro ao buscar produto atualizado');
    }

    return {
      success: true,
      message: `Adicionado ${quantity} ao estoque de ${product.name}`,
      totalStock: updatedProduct.quantity,
    };
  }

  async debitStockBatch(
    products: { identifier: string; quantity: number }[] | string,
  ): Promise<{ scheduled: true }> {
    let parsedProducts: { identifier: string; quantity: number }[] = [];

    if (typeof products === 'string') {
      try {
        parsedProducts = JSON.parse(products);
      } catch {
        throw new Error('Formato JSON inválido para produtos');
      }
    } else if (Array.isArray(products)) {
      parsedProducts = products;
    } else {
      throw new Error('Payload inválido: esperado um array de produtos');
    }

    const invalidProducts = parsedProducts.filter(
      (product) =>
        !product.identifier ||
        typeof product.identifier !== 'string' ||
        product.identifier.trim() === '' ||
        typeof product.quantity !== 'number' ||
        product.quantity <= 0,
    );

    if (invalidProducts.length > 0) {
      throw new Error(`Produtos inválidos: ${JSON.stringify(invalidProducts)}`);
    }

    for (const product of parsedProducts) {
      await this.debitStock(product.identifier, product.quantity);
    }

    return { scheduled: true };
  }

  async incrementStock(identifier: string, quantity: number): Promise<void> {
    await this.prisma.productTemporary.update({
      where: { identifier },
      data: { quantity: { increment: quantity } },
    });
  }

  async removeStock(
    identifier: string,
    quantity: number,
  ): Promise<{ success: boolean; message: string; totalStock?: number }> {
    if (
      !identifier ||
      typeof identifier !== 'string' ||
      identifier.trim() === ''
    ) {
      return { success: false, message: 'Identificador do produto inválido.' };
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      return { success: false, message: 'Quantidade inválida.' };
    }

    const product = await this.prisma.productTemporary.findUnique({
      where: { identifier },
    });
    if (!product) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    if (product.quantity < quantity) {
      return {
        success: false,
        message: `Estoque insuficiente. Disponível: ${product.quantity}, solicitado: ${quantity}`,
      };
    }

    await this.prisma.productTemporary.update({
      where: { identifier },
      data: { quantity: { decrement: Number(quantity) } },
    });

    const updatedProduct = await this.prisma.productTemporary.findUnique({
      where: { identifier },
    });

    if (!updatedProduct) {
      throw new Error('Erro ao buscar produto atualizado');
    }

    return {
      success: true,
      message: `Removido ${quantity} do estoque de ${product.name}`,
      totalStock: updatedProduct.quantity,
    };
  }

  async findAll(companyId: number) {
    return this.prisma.productTemporary.findMany({
      where: {
        companyId: companyId,
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateProductDto, companyId: number) {
    return this.prisma.productTemporary.create({
      data: {
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity ?? 0,
        description: dto.description,
        image_url: dto.image_url,
        productType: dto.productType,
        unitMeasure: dto.unitMeasure,
        productCompound: dto.productCompound,
        companyId: companyId,
      },
    });
  }
}
