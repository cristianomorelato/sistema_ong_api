import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateProductCompoundsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
