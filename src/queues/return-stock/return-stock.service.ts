import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ProductTemporaryService } from '../../productTemporary/productTemporary.service';
import axios from 'axios';

@Injectable()
export class ReturnStockService {
  constructor(
    @InjectQueue('return-stock') private readonly returnStockQueue: Queue,
    private readonly productTemporaryService: ProductTemporaryService,
  ) {}

  async scheduleReturnStockJob(
    products: { identifier: string; quantity: number }[],
    transactionId: string,
  ) {
    // Agenda um único job com todos os produtos e transactionId
    return this.returnStockQueue.add(
      'return',
      { products, transactionId },
      { delay: 7 * 60 * 1000 },
    );
  }

  async processReturnStock(
    products: { identifier: string; quantity: number }[],
    transactionId: string,
  ): Promise<{ success: boolean; message: string }> {
    let success = true;
    let message = '';
    for (const product of products) {
      const url = `${process.env.BASICPAY_URL}${transactionId}`;
      const headers = {
        'x-api-key': process.env.BASICPAY_API_KEY,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axios.get(url, { headers });
        if (
          response.data &&
          typeof response.data === 'object' &&
          'status' in response.data &&
          (response.data as { status?: string }).status === 'canceled'
        ) {
          await this.productTemporaryService.incrementStock(
            product.identifier,
            Number(product.quantity),
          );
          message += `Returned ${product.quantity} to stock for ${product.identifier}.\n`;
        } else {
          success = false;
          message += `Stock was not updated for ${product.identifier}.\n`;
        }
      } catch (err) {
        success = false;
        message += `Error for ${product.identifier}: Stock was not updated.\n`;
      }
    }
    return {
      success,
      message,
    };
  }
}
