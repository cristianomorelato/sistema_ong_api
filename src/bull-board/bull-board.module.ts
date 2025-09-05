import { Global, Module } from '@nestjs/common';
import { BullBoardService } from './bull-board.service';
import { ReturnStockModule } from '../queues/return-stock/return-stock.module';

@Global()
@Module({
  imports: [ReturnStockModule],
  providers: [BullBoardService],
  exports: [BullBoardService],
})
export class BullBoardModule {}
