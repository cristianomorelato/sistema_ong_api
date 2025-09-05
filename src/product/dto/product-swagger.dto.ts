import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateProductSwaggerDto {
  @ApiProperty({ example: 'Produto X', description: 'Nome do produto' })
  name: string;

  @ApiProperty({ example: 99.99, description: 'Preço do produto' })
  price: number;

  @ApiProperty({ example: 10, description: 'Quantidade em estoque' })
  quantity: number;

  @ApiPropertyOptional({
    example: 'Descrição do produto',
    description: 'Descrição',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://exemplo.com/imagem.jpg',
    description: 'URL da imagem',
  })
  image_url?: string;

  @ApiProperty({ example: 1, description: 'ID do tipo de produto' })
  productTypeId: number;

  @ApiProperty({ example: 1, description: 'ID da empresa' })
  companyId: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: Status,
    description: 'Status do produto',
  })
  status?: Status;

  @ApiProperty({ example: 1, description: 'ID do composto do produto' })
  productCompoundId: number;
}

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Produto X' })
  name: string;

  @ApiProperty({ example: 99.99 })
  price: number;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiPropertyOptional({ example: 'Descrição do produto' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://exemplo.com/imagem.jpg' })
  image_url?: string;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 'ACTIVE', enum: Status })
  status: Status;

  @ApiProperty({
    example: { id: 1, name: 'Flor', unit_measure: 'g' },
    description: 'Objeto do tipo de produto',
  })
  productType: any;

  @ApiProperty({
    example: { id: 1, name: 'THC' },
    description: 'Objeto do composto do produto',
  })
  productCompound: any;
}
