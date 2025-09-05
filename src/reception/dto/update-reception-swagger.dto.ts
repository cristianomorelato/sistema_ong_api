import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdateReceptionSwaggerDto {
  @ApiPropertyOptional({
    example: 'Maria Oliveira',
    description: 'Nome completo do acolhido',
  })
  name?: string;

  @ApiPropertyOptional({
    example: '12345678901',
    description: 'CPF do acolhido (apenas números)',
  })
  cpf?: string;

  @ApiPropertyOptional({
    example: '1990-05-20',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    example: 'Feminino',
    description: 'Gênero do acolhido',
  })
  gender?: string;

  @ApiPropertyOptional({
    example: '11999998888',
    description: 'Telefone (apenas números)',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Observações importantes',
    description: 'Observações sobre o acolhido',
  })
  observations?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID da empresa' })
  companyId?: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status do acolhido (ACTIVE/INACTIVE)',
  })
  status?: Status;

  // Endereço
  @ApiPropertyOptional({
    example: 'Rua das Flores',
    description: 'Nome da rua',
  })
  street?: string;

  @ApiPropertyOptional({ example: '100', description: 'Número do endereço' })
  number?: string;

  @ApiPropertyOptional({
    example: 'Apto 12',
    description: 'Complemento do endereço',
  })
  complement?: string;

  @ApiPropertyOptional({ example: 'Centro', description: 'Bairro' })
  neighborhood?: string;

  @ApiPropertyOptional({ example: 123, description: 'ID da cidade' })
  cityId?: number;

  @ApiPropertyOptional({ example: 26, description: 'ID do estado' })
  stateId?: number;

  @ApiPropertyOptional({
    example: '02205001',
    description: 'CEP (apenas números)',
  })
  zipCode?: string;

  // Usuário
  @ApiPropertyOptional({
    example: 'acolhido@email.com',
    description: 'E-mail para login',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'novaSenha123',
    description: 'Senha para login',
  })
  password?: string;
}
