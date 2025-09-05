import { PartialType } from '@nestjs/swagger';
import { CreateDoctorSwaggerDto } from './doctor-swagger.dto';

export class UpdateDoctorSwaggerDto extends PartialType(
  CreateDoctorSwaggerDto,
) {}
