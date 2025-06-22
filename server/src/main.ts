import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  
  //uploads klasorundeki dosyalari frontende serve etmek icin static olarak belirttim
  app.use('/uploads', express.static('uploads'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
