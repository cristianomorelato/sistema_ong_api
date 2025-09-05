import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PrescriptionController],
  providers: [PrescriptionService, PrismaService],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
