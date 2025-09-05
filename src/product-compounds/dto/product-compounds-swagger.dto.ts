import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateProductCompoundsSwaggerDto {
  @ApiProperty({ example: 'CBD', description: 'Nome do composto do produto' })
  name: string;

  @ApiPropertyOptional({
    example: 'Composto derivado do cânhamo',
    description: 'Descrição do composto',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: Status,
    description: 'Status do composto',
  })
  status?: Status;
}

export class ProductCompoundsResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'CBD' })
  name: string;

  @ApiPropertyOptional({ example: 'Composto derivado do cânhamo' })
  description?: string;

  @ApiProperty({ example: 'ACTIVE', enum: Status })
  status: Status;
}
