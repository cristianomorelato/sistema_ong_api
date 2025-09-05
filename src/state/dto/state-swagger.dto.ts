import { ApiProperty } from '@nestjs/swagger';

export class StateResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID único do estado',
  })
  id: number;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Nome do estado',
  })
  name: string;

  @ApiProperty({
    example: 'SP',
    description: 'Sigla do estado (UF)',
  })
  uf: string;
}
