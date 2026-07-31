import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new GlobalExceptionFilter());
  // app.useGlobalInterceptors(new GlobalInterceptor());

  // 1- Global Pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })); 


  // 2- Global Middlewares
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });
  // 3- Global Guards
  // 4- Global Interceptors
  // 5- Global Filters


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
