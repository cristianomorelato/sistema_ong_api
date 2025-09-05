import { PartialType } from '@nestjs/swagger';
import { CreateAdministratorSwaggerDto } from './administrators-swagger.dto';

export class UpdateAdministratorSwaggerDto extends PartialType(
  CreateAdministratorSwaggerDto,
) {}
