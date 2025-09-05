import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsInt()
  productTypeId: number;

  @IsInt()
  productCompoundId: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
