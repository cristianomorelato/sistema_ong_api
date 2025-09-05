import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  ForbiddenException,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreateAdministrator,
  ApiSearchAdministrators,
  ApiUpdateAdministrator,
} from './decorators/administrators-swagger.decorator';

@ApiTags('Administrators')
@ApiBearerAuth()
@Controller('administrators')
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreateAdministrator()
  async create(@Body() dto: CreateAdministratorDto) {
    return this.administratorsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiSearchAdministrators()
  async findAllByCompany(
    @Req() req: Request,
    @Query('cpf') cpf?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('status') status?: string,
  ) {
    const user = req.user as JwtPayload;
    if (!['ADMIN', 'MASTER'].includes(user.userType)) {
      throw new ForbiddenException('Acesso negado');
    }
    return await this.administratorsService.searchAdministrators({
      companyId: user.company_id,
      cpf,
      name,
      phone,
      status,
    });
  }

  @Patch(':identifier')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdateAdministrator()
  async update(
    @Param('identifier') identifier: string,
    @Body() dto: UpdateAdministratorDto,
  ) {
    return this.administratorsService.updateByIdentifier(identifier, dto);
  }
}
