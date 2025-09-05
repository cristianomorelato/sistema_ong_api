import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateDoctorDto {
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

  // Dados do médico
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  documentDoctorType?: string;

  @IsString()
  @IsOptional()
  documentDoctorNumber?: string;

  @IsString()
  @IsOptional()
  documentDoctorUf?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsInt()
  companyId: number;

  @IsInt()
  addressId?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;
}
