import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdatePatientSwaggerDto {
  @ApiPropertyOptional({
    example: 'Carlos Silva',
    description: 'Nome completo do paciente',
  })
  name?: string;

  @ApiPropertyOptional({
    example: '12345678901',
    description: 'CPF do paciente (apenas números)',
  })
  cpf?: string;

  @ApiPropertyOptional({
    example: '1985-12-10',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  dateOfBirth?: string;

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

  @ApiPropertyOptional({ example: 1, description: 'ID da empresa' })
  companyId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID do médico responsável' })
  doctorId?: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status do paciente (ACTIVE/INACTIVE)',
  })
  status?: Status;

  // Endereço
  @ApiPropertyOptional({
    example: 'Rua das Acácias',
    description: 'Nome da rua',
  })
  street?: string;

  @ApiPropertyOptional({ example: '321', description: 'Número do endereço' })
  number?: string;

  @ApiPropertyOptional({
    example: 'Bloco B Apt 302',
    description: 'Complemento do endereço',
  })
  complement?: string;

  @ApiPropertyOptional({ example: 'Vila Nova', description: 'Bairro' })
  neighborhood?: string;

  @ApiPropertyOptional({ example: 3, description: 'ID da cidade' })
  cityId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID do estado' })
  stateId?: number;

  @ApiPropertyOptional({
    example: '01234567',
    description: 'CEP (apenas números)',
  })
  zipCode?: string;

  // Usuário
  @ApiPropertyOptional({
    example: 'paciente@email.com',
    description: 'E-mail para login',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'senhaSegura321',
    description: 'Senha para login',
  })
  password?: string;
}
