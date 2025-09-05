import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  ForbiddenException,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreatePatient,
  ApiSearchPatients,
  ApiUpdatePatient,
} from './decorators/patient-swagger.decorator';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatePatient()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiSearchPatients()
  async findAllByCompany(
    @Req() req: Request,
    @Query('cpf') cpf?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('email') email?: string,
    @Query('status') status?: string,
  ) {
    const user = req.user as JwtPayload;
    if (!['ADMIN', 'RECEPTION'].includes(user.userType)) {
      throw new ForbiddenException('Acesso negado');
    }
    return await this.patientService.searchPatients({
      companyId: user.company_id,
      cpf,
      name,
      phone,
      email,
      status,
    });
  }

  @Patch(':identifier')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdatePatient()
  async updateByIdentifier(
    @Param('identifier') identifier: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientService.updateByIdentifier(identifier, dto);
  }
}
