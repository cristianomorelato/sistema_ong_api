import { Module } from '@nestjs/common';
import { ProductCompoundsController } from './product-compounds.controller';
import { ProductCompoundsService } from './product-compounds.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductCompoundsController],
  providers: [ProductCompoundsService, PrismaService],
  exports: [ProductCompoundsService],
})
export class ProductCompoundsModule {}
