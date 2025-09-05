import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReturnStockService } from './return-stock.service';

@Processor('return-stock')
export class ReturnStockProcessor {
  constructor(private readonly returnStockService: ReturnStockService) {}

  @Process('return')
  async handleReturnStock(job: Job) {
    let { products, transactionId } = job.data;

    if (typeof products === 'string') {
      try {
        products = JSON.parse(products);
      } catch {
        products = [];
      }
    }

    return await this.returnStockService.processReturnStock(
      products,
      transactionId,
    );
  }
}
