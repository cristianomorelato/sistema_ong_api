import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdateProductCompoundsSwaggerDto {
  @ApiPropertyOptional({
    example: 'CBD',
    description: 'Nome do composto do produto',
  })
  name?: string;

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
