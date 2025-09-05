import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreatePatientDto {
  // Dados do usuário
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // Dados do endereço
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsInt()
  cityId: number;

  @IsInt()
  stateId: number;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  // Dados do paciente
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsInt()
  companyId: number;

  @IsInt()
  doctorId: number;

  @IsOptional()
  @IsString()
  status?: string;
}
