import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  //global hata yakalama icin filtre kullanildi
  app.useGlobalFilters(new HttpExceptionFilter());

  //uploads klasorundeki dosyalari frontende serve etmek icin static olarak belirttim
  app.use('/uploads', express.static('uploads'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
