import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateProductTypeSwaggerDto {
  @ApiProperty({ example: 'Flor', description: 'Nome do tipo de produto' })
  name: string;

  @ApiProperty({ example: 'gramas', description: 'Unidade de medida' })
  unit_measure: string;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: Status,
    description: 'Status do tipo de produto',
  })
  status?: Status;
}

export class ProductTypeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Flor' })
  name: string;

  @ApiProperty({ example: 'gramas' })
  unit_measure: string;

  @ApiProperty({ example: 'ACTIVE', enum: Status })
  status: Status;
}
