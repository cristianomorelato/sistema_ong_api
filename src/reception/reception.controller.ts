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
import { ReceptionService } from './reception.service';
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreateReception,
  ApiSearchReceptions,
  ApiUpdateReception,
} from './decorators/reception-swagger.decorator';

@ApiTags('Reception')
@ApiBearerAuth()
@Controller('reception')
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreateReception()
  async create(@Body() dto: CreateReceptionDto) {
    return this.receptionService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiSearchReceptions()
  async findAllByCompany(
    @Req() req: Request,
    @Query('cpf') cpf?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('status') status?: string,
  ) {
    const user = req.user as JwtPayload;
    if (!['ADMIN', 'RECEPTION'].includes(user.userType)) {
      throw new ForbiddenException('Acesso negado');
    }
    return await this.receptionService.searchReceptions({
      companyId: user.company_id,
      cpf,
      name,
      phone,
      status,
    });
  }

  @Patch(':identifier')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdateReception()
  async updateByIdentifier(
    @Param('identifier') identifier: string,
    @Body() dto: UpdateReceptionDto,
  ) {
    return this.receptionService.updateByIdentifier(identifier, dto);
  }
}
