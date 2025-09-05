import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdateProductSwaggerDto {
  @ApiPropertyOptional({ example: 'Produto X', description: 'Nome do produto' })
  name?: string;

  @ApiPropertyOptional({ example: 99.99, description: 'Preço do produto' })
  price?: number;

  @ApiPropertyOptional({ example: 10, description: 'Quantidade em estoque' })
  quantity?: number;

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

  @ApiPropertyOptional({ example: 1, description: 'ID do tipo de produto' })
  productTypeId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID da empresa' })
  companyId?: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: Status,
    description: 'Status do produto',
  })
  status?: Status;

  @ApiPropertyOptional({ example: 1, description: 'ID do composto do produto' })
  productCompoundId?: number;
}
