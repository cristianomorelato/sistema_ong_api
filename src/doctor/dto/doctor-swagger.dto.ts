import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorSwaggerDto {
  @ApiProperty({
    example: 'Dr. João Santos',
    description: 'Nome completo do médico',
  })
  name: string;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do médico (apenas números)',
  })
  cpf: string;

  @ApiPropertyOptional({
    example: 'CRM',
    description: 'Tipo do documento profissional (CRM, CRF, etc.)',
  })
  documentDoctorType?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Número do documento profissional',
  })
  documentDoctorNumber?: string;

  @ApiPropertyOptional({
    example: 'SP',
    description: 'UF do documento profissional',
  })
  documentDoctorUf?: string;

  @ApiPropertyOptional({
    example: '11987654321',
    description: 'Telefone (apenas números)',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Especialista em medicina canábica',
    description: 'Observações sobre o médico',
  })
  observations?: string;

  @ApiProperty({
    example: 1,
    description: 'ID da empresa',
  })
  companyId: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status do médico (ACTIVE/INACTIVE)',
  })
  status?: string;

  // Endereço
  @ApiProperty({
    example: 'Rua dos Médicos',
    description: 'Nome da rua',
  })
  street: string;

  @ApiProperty({
    example: '789',
    description: 'Número do endereço',
  })
  number: string;

  @ApiPropertyOptional({
    example: 'Sala 101',
    description: 'Complemento do endereço',
  })
  complement?: string;

  @ApiProperty({
    example: 'Centro Médico',
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

  // Usuário
  @ApiProperty({
    example: 'doutor@empresa.com',
    description: 'E-mail para login',
  })
  email: string;

  @ApiProperty({
    example: 'senhaSegura789',
    description: 'Senha para login',
  })
  password: string;
}

export class AddressSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Rua dos Médicos' })
  street: string;

  @ApiProperty({ example: '789' })
  number: string;

  @ApiPropertyOptional({ example: 'Sala 101' })
  complement?: string;

  @ApiProperty({ example: 'Centro Médico' })
  neighborhood: string;

  @ApiProperty({ example: 1 })
  cityId: number;

  @ApiProperty({ example: 1 })
  stateId: number;

  @ApiProperty({ example: '01234567' })
  zipCode: string;
}

export class DoctorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'doctor-uuid-789' })
  identifier: string;

  @ApiProperty({ example: 'Dr. João Santos' })
  name: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiPropertyOptional({ example: 'CRM' })
  documentDoctorType?: string;

  @ApiPropertyOptional({ example: '123456' })
  documentDoctorNumber?: string;

  @ApiPropertyOptional({ example: 'SP' })
  documentDoctorUf?: string;

  @ApiPropertyOptional({ example: '11987654321' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Especialista em medicina canábica' })
  observations?: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ type: AddressSwaggerDto })
  address: AddressSwaggerDto;
}
