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
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreateDoctor,
  ApiSearchDoctors,
  ApiUpdateDoctor,
} from './decorators/doctor-swagger.decorator';

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreateDoctor()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiSearchDoctors()
  async findAllByCompany(
    @Req() req: Request,
    @Query('cpf') cpf?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('email') email?: string,
    @Query('documentDoctorNumber') documentDoctorNumber?: string,
    @Query('status') status?: string,
    @Query('identifier') identifier?: string,
  ) {
    const user = req.user as JwtPayload;
    if (!['ADMIN', 'RECEPTION'].includes(user.userType)) {
      throw new ForbiddenException('Acesso negado');
    }
    return await this.doctorService.searchDoctors({
      companyId: user.company_id,
      cpf,
      name,
      phone,
      email,
      documentDoctorNumber,
      status,
      identifier,
    });
  }

  @Patch(':identifier')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdateDoctor()
  async update(
    @Param('identifier') identifier: string,
    @Body() dto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateByIdentifier(identifier, dto);
  }
}
