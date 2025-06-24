import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //cors kullanildi
  app.enableCors();

  //global hata yakalama icin filtre kullanildi
  app.useGlobalFilters(new HttpExceptionFilter());

  //dto validationlari icin pipe kullanildi
  app.useGlobalPipes(new ValidationPipe());

  //security icin helmet kullanildi
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  //uploads klasorundeki dosyalari frontende serve etmek icin static olarak belirttim
  app.use('/uploads', express.static('uploads'));
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
