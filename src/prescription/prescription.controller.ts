import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescriptionResponseDto } from './dto/prescription-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Status } from '@prisma/client';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreatePrescription,
  ApiUpdatePrescription,
  ApiGetPrescriptions,
} from './decorators/prescription-swagger.decorator';
import { AuthenticatedRequest } from '../auth/authenticated-request.interface';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatePrescription()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    const user = req.user;
    if (!user?.company_id)
      throw new BadRequestException('company_id não encontrado no token');
    return this.prescriptionService.create(dto, user.company_id);
  }

  @Patch(':identifier')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdatePrescription()
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('identifier') identifier: string,
    @Body() dto: UpdatePrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    const user = req.user;
    if (!user?.company_id)
      throw new BadRequestException('company_id não encontrado no token');
    return this.prescriptionService.updateByIdentifier(
      identifier,
      dto,
      user.company_id,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiGetPrescriptions()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('patientId') patientId: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: Status,
    @Query('disease') disease?: string,
  ): Promise<PrescriptionResponseDto[]> {
    const user = req.user;
    if (!user?.company_id)
      throw new BadRequestException('company_id não encontrado no token');
    if (!patientId) throw new BadRequestException('patientId é obrigatório');
    const params: {
      patientId: number;
      companyId: number;
      doctorId?: number;
      status?: Status;
      disease?: string;
    } = {
      patientId: Number(patientId),
      companyId: user.company_id,
    };
    if (doctorId) params.doctorId = Number(doctorId);
    if (status) params.status = status;
    if (disease) params.disease = disease;
    return this.prescriptionService.findAll(params);
  }
}
