import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  await app.listen();
}
bootstrap();
