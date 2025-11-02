import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { PrismaErrorInterceptor } from '@app/prisma';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    { transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
  );

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new PrismaErrorInterceptor());

  await app.listen();
}
bootstrap();
