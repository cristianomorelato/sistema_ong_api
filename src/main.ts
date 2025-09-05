import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BullBoardService } from './bull-board/bull-board.service';
import { bullBoardAuthMiddleware } from './bull-board/bull-board-auth.middleware';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://dash-estoque-dash.ixf6ql.easypanel.host',
      'https://produtos.abecmed.com.br',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.use((cookieParser as unknown as () => void)());

  const config = new DocumentBuilder()
    .setTitle('API - Portal de Associados')
    .setDescription(
      'Documentação da API do portal administrativo e associados para ONGs',
    )
    .setVersion('1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const bullBoardService = app.get(BullBoardService);
  app.use(
    '/admin/queues',
    bullBoardAuthMiddleware,
    bullBoardService.serverAdapter.getRouter(),
  );

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
