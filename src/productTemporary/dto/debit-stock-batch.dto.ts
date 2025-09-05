export class DebitStockBatchDto {
  products: { identifier: string; quantity: number }[] | string;
  transactionId?: string;
}
