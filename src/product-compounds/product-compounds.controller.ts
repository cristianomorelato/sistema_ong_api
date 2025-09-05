import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductCompoundsService } from './product-compounds.service';
import { CreateProductCompoundsDto } from './dto/create-product-compounds.dto';
import { UpdateProductCompoundsDto } from './dto/update-product-compounds.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiCreateProductCompounds } from './decorators/product-compounds-swagger.decorator';
import { ApiUpdateProductCompounds } from './decorators/product-compounds-swagger.decorator';
import { ApiFindAllProductCompounds } from './decorators/product-compounds-swagger.decorator';
import { Status } from '@prisma/client';

@ApiTags('ProductCompounds')
@ApiBearerAuth()
@Controller('product-compounds')
export class ProductCompoundsController {
  constructor(
    private readonly productCompoundsService: ProductCompoundsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreateProductCompounds()
  async create(@Body() dto: CreateProductCompoundsDto) {
    return this.productCompoundsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiFindAllProductCompounds()
  async findAll(
    @Query('name') name?: string,
    @Query('status') status?: Status,
    @Query('id') id?: number,
  ) {
    return this.productCompoundsService.findAll({
      name,
      status: status as Status,
      id: id ? Number(id) : undefined,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdateProductCompounds()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductCompoundsDto,
  ) {
    return this.productCompoundsService.update(id, dto);
  }
}
