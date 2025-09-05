import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReceptionSwaggerDto {
  @ApiProperty({
    example: 'Maria Silva',
    description: 'Nome completo do recepcionista',
  })
  name: string;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do recepcionista (apenas números)',
  })
  cpf: string;

  @ApiProperty({
    example: '1990-03-20',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  dateOfBirth: string;

  @ApiPropertyOptional({
    example: 'Feminino',
    description: 'Gênero do recepcionista',
  })
  gender?: string;

  @ApiPropertyOptional({
    example: '11988887777',
    description: 'Telefone (apenas números)',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Recepcionista responsável pelo turno da manhã',
    description: 'Observações sobre o recepcionista',
  })
  observations?: string;

  @ApiProperty({
    example: 1,
    description: 'ID da empresa',
  })
  companyId: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status do recepcionista (ACTIVE/INACTIVE)',
  })
  status?: string;

  // Endereço
  @ApiProperty({
    example: 'Rua das Palmeiras',
    description: 'Nome da rua',
  })
  street: string;

  @ApiProperty({
    example: '456',
    description: 'Número do endereço',
  })
  number: string;

  @ApiPropertyOptional({
    example: 'Casa 2',
    description: 'Complemento do endereço',
  })
  complement?: string;

  @ApiProperty({
    example: 'Jardim América',
    description: 'Bairro',
  })
  neighborhood: string;

  @ApiProperty({
    example: 2,
    description: 'ID da cidade',
  })
  cityId: number;

  @ApiProperty({
    example: 1,
    description: 'ID do estado',
  })
  stateId: number;

  @ApiProperty({
    example: '01234567',
    description: 'CEP (apenas números)',
  })
  zipCode: string;

  // Usuário
  @ApiProperty({
    example: 'recepcao@empresa.com',
    description: 'E-mail para login',
  })
  email: string;

  @ApiProperty({
    example: 'senhaSegura456',
    description: 'Senha para login',
  })
  password: string;
}

export class AddressSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Rua das Palmeiras' })
  street: string;

  @ApiProperty({ example: '456' })
  number: string;

  @ApiPropertyOptional({ example: 'Casa 2' })
  complement?: string;

  @ApiProperty({ example: 'Jardim América' })
  neighborhood: string;

  @ApiProperty({ example: 2 })
  cityId: number;

  @ApiProperty({ example: 1 })
  stateId: number;

  @ApiProperty({ example: '01234567' })
  zipCode: string;
}

export class ReceptionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'reception-uuid-456' })
  identifier: string;

  @ApiProperty({ example: 'Maria Silva' })
  name: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiProperty({ example: '1990-03-20T00:00:00.000Z' })
  dateOfBirth: string;

  @ApiPropertyOptional({ example: 'Feminino' })
  gender?: string;

  @ApiPropertyOptional({ example: '11988887777' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Recepcionista responsável pelo turno da manhã',
  })
  observations?: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ type: AddressSwaggerDto })
  address: AddressSwaggerDto;

  @ApiProperty({ example: 'recepcao@empresa.com' })
  email: string;
}
