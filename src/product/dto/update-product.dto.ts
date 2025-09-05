import { IsString, IsOptional, IsNumber, IsInt, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsInt()
  @IsOptional()
  productTypeId?: number;

  @IsInt()
  @IsOptional()
  productCompoundId?: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
