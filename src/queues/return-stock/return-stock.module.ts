import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReturnStockProcessor } from './return-stock.processor';
import { ReturnStockService } from './return-stock.service';
import { ProductTemporaryModule } from '../../productTemporary/productTemporary.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'return-stock' }),
    forwardRef(() => ProductTemporaryModule),
  ],
  providers: [ReturnStockProcessor, ReturnStockService],
  exports: [ReturnStockService, BullModule],
})
export class ReturnStockModule {}
