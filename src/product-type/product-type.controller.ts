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
import { ProductTypeService } from './product-type.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreateProductType,
  ApiUpdateProductType,
  ApiFindAllProductType,
} from './decorators/product-type-swagger.decorator';
import { Status } from '@prisma/client';

@ApiTags('ProductType')
@ApiBearerAuth()
@Controller('product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreateProductType()
  async create(@Body() dto: CreateProductTypeDto) {
    return this.productTypeService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiFindAllProductType()
  async findAll(
    @Query('name') name?: string,
    @Query('status') status?: Status,
    @Query('id') id?: number,
  ) {
    return this.productTypeService.findAll({
      name,
      status: status as Status,
      id: id ? Number(id) : undefined,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdateProductType()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductTypeDto,
  ) {
    return this.productTypeService.update(id, dto);
  }
}
