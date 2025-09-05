import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateProductTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  unit_measure?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
