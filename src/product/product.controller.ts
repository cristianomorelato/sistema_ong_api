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
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiCreateProduct,
  ApiFindAllProduct,
  ApiFindProductById,
  ApiUpdateProduct,
} from './decorators/product-swagger.decorator';
import { Status } from '@prisma/client';
import { Request } from 'express';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreateProduct()
  async create(@Body() dto: CreateProductDto, @Req() req: Request) {
    const companyId = (req.user as { company_id: number }).company_id;
    return this.productService.create(dto, companyId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiFindAllProduct()
  async findAll(
    @Req() req: Request,
    @Query('name') name?: string,
    @Query('status') status?: string,
    @Query('productTypeId') productTypeId?: string,
  ) {
    const companyId = (req.user as { company_id: number }).company_id;
    const products = await this.productService.findAll({
      name,
      status: status as Status,
      companyId,
      productTypeId: productTypeId ? Number(productTypeId) : undefined,
    });
    return products;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiFindProductById()
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const companyId = (req.user as { company_id: number }).company_id;
    const product = await this.productService.findById(id, companyId);
    return product;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiUpdateProduct()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @Req() req: Request,
  ) {
    const companyId = (req.user as { company_id: number }).company_id;
    return this.productService.update(id, dto, companyId);
  }
}
