import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductTemporaryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'a4b5e7f9-4a8b-6c9d-2e3f-4a5b6c7d8e9f' })
  identifier: string;

  @ApiProperty({ example: 'Cannabis Sativa Premium' })
  name: string;

  @ApiProperty({ example: 89.9 })
  price: number;

  @ApiProperty({ example: 100 })
  quantity: number;

  @ApiPropertyOptional({
    example: 'Produto de alta qualidade para uso medicinal',
  })
  description?: string;

  @ApiPropertyOptional({ example: 'https://exemplo.com/imagem.jpg' })
  image_url?: string;

  @ApiProperty({ example: 'flower' })
  productType: string;

  @ApiProperty({ example: 'gramas' })
  unitMeasure: string;

  @ApiProperty({ example: 'THC' })
  productCompound: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 1 })
  companyId: number;
}

export class CreateProductTemporarySwaggerDto {
  @ApiProperty({
    example: 'Cannabis Sativa Premium',
    description: 'Nome do produto',
  })
  name: string;

  @ApiProperty({
    example: 89.9,
    description: 'Preço do produto',
  })
  price: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Quantidade inicial em estoque (padrão: 0)',
  })
  quantity?: number;

  @ApiPropertyOptional({
    example: 'Produto de alta qualidade para uso medicinal',
    description: 'Descrição do produto',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://exemplo.com/imagem.jpg',
    description: 'URL da imagem do produto',
  })
  image_url?: string;

  @ApiProperty({
    example: 'flower',
    description: 'Tipo do produto',
  })
  productType: string;

  @ApiProperty({
    example: 'gramas',
    description: 'Unidade de medida',
  })
  unitMeasure: string;

  @ApiProperty({
    example: 'THC',
    description: 'Composto principal do produto',
  })
  productCompound: string;
}

export class FlowerGroupedResponseDto {
  @ApiProperty({ example: 'THC' })
  productCompound: string;

  @ApiProperty({
    type: [ProductTemporaryResponseDto],
    description: 'Lista de produtos agrupados por composto',
  })
  products: ProductTemporaryResponseDto[];
}

export class CheckStockSwaggerDto {
  @ApiProperty({
    example: 'a4b5e7f9-4a8b-6c9d-2e3f-4a5b6c7d8e9f',
    description: 'Identificador único do produto',
  })
  identifier: string;

  @ApiProperty({
    example: 10,
    description: 'Quantidade a verificar',
  })
  quantity: number;
}

export class AddStockSwaggerDto {
  @ApiProperty({
    example: 'a4b5e7f9-4a8b-6c9d-2e3f-4a5b6c7d8e9f',
    description: 'Identificador único do produto',
  })
  identifier: string;

  @ApiProperty({
    example: 50,
    description: 'Quantidade a adicionar ao estoque',
  })
  quantity: number;
}

export class RemoveStockSwaggerDto {
  @ApiProperty({
    example: 'a4b5e7f9-4a8b-6c9d-2e3f-4a5b6c7d8e9f',
    description: 'Identificador único do produto',
  })
  identifier: string;

  @ApiProperty({
    example: 15,
    description: 'Quantidade a remover do estoque',
  })
  quantity: number;
}

export class ProductStockItemDto {
  @ApiProperty({
    example: 'a4b5e7f9-4a8b-6c9d-2e3f-4a5b6c7d8e9f',
    description: 'Identificador único do produto',
  })
  identifier: string;

  @ApiProperty({
    example: 5,
    description: 'Quantidade a debitar',
  })
  quantity: number;
}

export class DebitStockBatchSwaggerDto {
  @ApiProperty({
    type: [ProductStockItemDto],
    description: 'Lista de produtos para debitar do estoque',
  })
  products: ProductStockItemDto[];
}

export class ReturnStockSwaggerDto {
  @ApiProperty({
    type: [ProductStockItemDto],
    description: 'Lista de produtos para retornar ao estoque',
  })
  products: ProductStockItemDto[];

  @ApiProperty({
    example: 'd2e52447abd14e8eb5bbf71269c95f70',
    description: 'ID da transação para rastreamento',
  })
  transactionId: string;
}

export class StockOperationResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    example: 'Adicionado 50 ao estoque de Cannabis Sativa Premium',
  })
  message: string;

  @ApiPropertyOptional({ example: 150 })
  totalStock?: number;
}

export class CheckStockAvailabilityDto {
  @ApiProperty({
    type: [ProductStockItemDto],
    description: 'Lista de produtos para verificar disponibilidade',
  })
  products: ProductStockItemDto[];
}

export class ProductAvailabilityDto {
  @ApiProperty({ example: 'Cannabis Sativa Premium' })
  name: string;

  @ApiProperty({ example: 'YES', enum: ['YES', 'NO'] })
  available: 'YES' | 'NO';

  @ApiProperty({ example: 50 })
  quantity: number;
}
