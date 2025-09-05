import { Module, forwardRef } from '@nestjs/common';
import { ProductTemporaryService } from './productTemporary.service';
import { ProductTemporaryController } from './productTemporary.controller';
import { ReturnStockModule } from '../queues/return-stock/return-stock.module';

@Module({
  imports: [ReturnStockModule],
  controllers: [ProductTemporaryController],
  providers: [ProductTemporaryService],
  exports: [ProductTemporaryService],
})
export class ProductTemporaryModule {}
