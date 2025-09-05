import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientSwaggerDto {
  @ApiProperty({
    example: 'Carlos Silva',
    description: 'Nome completo do paciente',
  })
  name: string;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do paciente (apenas números)',
  })
  cpf: string;

  @ApiProperty({
    example: '1985-12-10',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  dateOfBirth: string;

  @ApiPropertyOptional({
    example: 'Masculino',
    description: 'Gênero do paciente',
  })
  gender?: string;

  @ApiPropertyOptional({
    example: '11977889900',
    description: 'Telefone (apenas números)',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Paciente com histórico de ansiedade',
    description: 'Observações médicas sobre o paciente',
  })
  observations?: string;

  @ApiProperty({
    example: 1,
    description: 'ID da empresa',
  })
  companyId: number;

  @ApiProperty({
    example: 1,
    description: 'ID do médico responsável',
  })
  doctorId: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status do paciente (ACTIVE/INACTIVE)',
  })
  status?: string;

  // Endereço
  @ApiProperty({
    example: 'Rua das Acácias',
    description: 'Nome da rua',
  })
  street: string;

  @ApiProperty({
    example: '321',
    description: 'Número do endereço',
  })
  number: string;

  @ApiPropertyOptional({
    example: 'Bloco B Apt 302',
    description: 'Complemento do endereço',
  })
  complement?: string;

  @ApiProperty({
    example: 'Vila Nova',
    description: 'Bairro',
  })
  neighborhood: string;

  @ApiProperty({
    example: 3,
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
    example: 'paciente@email.com',
    description: 'E-mail para login',
  })
  email: string;

  @ApiProperty({
    example: 'senhaSegura321',
    description: 'Senha para login',
  })
  password: string;
}

export class AddressSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Rua das Acácias' })
  street: string;

  @ApiProperty({ example: '321' })
  number: string;

  @ApiPropertyOptional({ example: 'Bloco B Apt 302' })
  complement?: string;

  @ApiProperty({ example: 'Vila Nova' })
  neighborhood: string;

  @ApiProperty({ example: 3 })
  cityId: number;

  @ApiProperty({ example: 1 })
  stateId: number;

  @ApiProperty({ example: '01234567' })
  zipCode: string;
}

export class PatientResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'patient-uuid-321' })
  identifier: string;

  @ApiProperty({ example: 'Carlos Silva' })
  name: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiProperty({ example: '1985-12-10T00:00:00.000Z' })
  dateOfBirth: string;

  @ApiPropertyOptional({ example: 'Masculino' })
  gender?: string;

  @ApiPropertyOptional({ example: '11977889900' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Paciente com histórico de ansiedade' })
  observations?: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 1 })
  doctorId: number;

  @ApiProperty({ type: AddressSwaggerDto })
  address: AddressSwaggerDto;

  @ApiProperty({ example: 'paciente@email.com' })
  email: string;
}
