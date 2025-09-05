import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Post,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductTemporaryService } from './productTemporary.service';
import { CheckStockDto } from './dto/check-stock.dto';
import { AddStockDto } from './dto/add-stock.dto';
import { RemoveStockDto } from './dto/remove-stock.dto';
import { DebitStockBatchDto } from './dto/debit-stock-batch.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ReturnStockService } from '../queues/return-stock/return-stock.service';
import { Request } from 'express';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiGetFlowersGrouped,
  ApiGetAllProducts,
  ApiCreateProduct,
  ApiDebitStock,
  ApiCheckStock,
  ApiReturnStock,
  ApiAddStock,
  ApiRemoveStock,
} from './decorators/product-temporary-swagger.decorator';

@ApiTags('ProductsTemporary')
@ApiBearerAuth()
@Controller('products-temporary')
export class ProductTemporaryController {
  constructor(
    private readonly productTemporaryService: ProductTemporaryService,
    private readonly returnStockService: ReturnStockService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('flowers')
  @ApiGetFlowersGrouped()
  async getFlowersGroupedByCompound(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.productTemporaryService.findFlowersGroupedByCompound(
      user.company_id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiGetAllProducts()
  async findAll(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.productTemporaryService.findAll(user.company_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('debit-stock')
  @ApiDebitStock()
  async debitStock(
    @Body() body: DebitStockBatchDto,
  ): Promise<{ scheduled: true }> {
    return this.productTemporaryService.debitStockBatch(body.products);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('check-stock')
  @ApiCheckStock()
  async checkStock(@Body() dto: CheckStockDto): Promise<boolean> {
    return this.productTemporaryService.hasStock(dto.identifier, dto.quantity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('return-stock')
  @ApiReturnStock()
  async scheduleReturnStockJob(
    @Body()
    body: {
      products: any;
      transactionId: string;
    },
  ) {
    let products = body.products;
    if (typeof products === 'string') {
      try {
        products = JSON.parse(products);
      } catch {
        products = [];
      }
    }

    await this.returnStockService.scheduleReturnStockJob(
      products,
      body.transactionId,
    );
    return { scheduled: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('add-stock')
  @ApiAddStock()
  async addStock(
    @Body() dto: AddStockDto,
  ): Promise<{ success: boolean; message: string; totalStock?: number }> {
    return this.productTemporaryService.addStock(dto.identifier, dto.quantity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('remove-stock')
  @ApiRemoveStock()
  async removeStock(
    @Body() dto: RemoveStockDto,
  ): Promise<{ success: boolean; message: string; totalStock?: number }> {
    return this.productTemporaryService.removeStock(
      dto.identifier,
      dto.quantity,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('new')
  @ApiCreateProduct()
  async create(@Body() dto: CreateProductDto, @Req() req: Request) {
    const user = req.user as JwtPayload;

    if (!user.company_id) {
      throw new Error('Company ID não encontrado no token JWT');
    }

    return this.productTemporaryService.create(dto, user.company_id);
  }
}
