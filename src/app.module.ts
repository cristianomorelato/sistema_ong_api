import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { ProductTemporaryModule } from './productTemporary/productTemporary.module';
import { BullBoardModule } from './bull-board/bull-board.module';
import { ReturnStockModule } from './queues/return-stock/return-stock.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { ReceptionModule } from './reception/reception.module';
import { AdministratorsModule } from './administrators/administrators.module';
import { ProductCompoundsModule } from './product-compounds/product-compounds.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';
import { PrescriptionModule } from './prescription/prescription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PatientModule,
    DoctorModule,
    ProductTemporaryModule,
    ReturnStockModule,
    BullBoardModule,
    CityModule,
    StateModule,
    ReceptionModule,
    AdministratorsModule,
    ProductCompoundsModule,
    ProductTypeModule,
    ProductModule,
    PrescriptionModule,
  ],
})
export class AppModule {}
