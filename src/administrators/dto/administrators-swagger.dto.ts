import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdministratorSwaggerDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do administrador',
  })
  name: string;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do administrador (apenas números)',
  })
  cpf: string;

  @ApiProperty({
    example: '1985-05-15',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  dateOfBirth: string;

  @ApiPropertyOptional({
    example: 'Masculino',
    description: 'Gênero do administrador',
  })
  gender?: string;

  @ApiPropertyOptional({
    example: '11999999999',
    description: 'Telefone (apenas números)',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Administrador principal da filial',
    description: 'Observações sobre o administrador',
  })
  observations?: string;

  @ApiProperty({
    example: 1,
    description: 'ID da empresa',
  })
  companyId: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status do administrador (ACTIVE/INACTIVE)',
  })
  status?: string;

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Nome da rua',
  })
  street: string;

  @ApiProperty({
    example: '123',
    description: 'Número do endereço',
  })
  number: string;

  @ApiPropertyOptional({
    example: 'Apto 45',
    description: 'Complemento do endereço',
  })
  complement?: string;

  @ApiProperty({
    example: 'Centro',
    description: 'Bairro',
  })
  neighborhood: string;

  @ApiProperty({
    example: 1,
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

  @ApiProperty({
    example: 'admin@empresa.com',
    description: 'E-mail para login',
  })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha para login',
  })
  password: string;
}

export class AddressSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Rua das Flores' })
  street: string;

  @ApiProperty({ example: '123' })
  number: string;

  @ApiPropertyOptional({ example: 'Apto 45' })
  complement?: string;

  @ApiProperty({ example: 'Centro' })
  neighborhood: string;

  @ApiProperty({ example: 1 })
  cityId: number;

  @ApiProperty({ example: 1 })
  stateId: number;

  @ApiProperty({ example: '01234567' })
  zipCode: string;
}

export class AdministratorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin-uuid-123' })
  identifier: string;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiProperty({ example: '1985-05-15T00:00:00.000Z' })
  dateOfBirth: string;

  @ApiPropertyOptional({ example: 'Masculino' })
  gender?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Administrador principal' })
  observations?: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ type: AddressSwaggerDto })
  address: AddressSwaggerDto;

  @ApiProperty({ example: 'admin@empresa.com' })
  email: string;
}
