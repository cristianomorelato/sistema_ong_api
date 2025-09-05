import { ApiProperty } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID único da cidade',
  })
  id: number;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Nome da cidade',
  })
  name: string;

  @ApiProperty({
    example: 1,
    description: 'ID do estado ao qual a cidade pertence',
  })
  stateId: number;
}
