import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdateProductTypeSwaggerDto {
  @ApiPropertyOptional({
    example: 'Flor',
    description: 'Nome do tipo de produto',
  })
  name?: string;

  @ApiPropertyOptional({ example: 'gramas', description: 'Unidade de medida' })
  unit_measure?: string;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: Status,
    description: 'Status do tipo de produto',
  })
  status?: Status;
}
