import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { HttpToRpcExceptionFilter } from './filters/http-to-rpc-exception.filter';
import { PrismaExceptionFilter } from '@app/prisma';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_MS_HOST || 'localhost',
        port: parseInt(process.env.AUTH_MS_PORT as string) || 3001,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(
    new HttpToRpcExceptionFilter(),
    new PrismaExceptionFilter(),
  );
  await app.listen();
}
bootstrap();
