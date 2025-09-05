import { Injectable } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BullBoardService {
  public serverAdapter: ExpressAdapter;

  constructor(
    @InjectQueue('return-stock') private readonly returnStockQueue: Queue,
  ) {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/admin/queues');
    createBullBoard({
      queues: [new BullAdapter(this.returnStockQueue)],
      serverAdapter: this.serverAdapter,
    });
  }
}
