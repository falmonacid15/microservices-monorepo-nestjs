import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_MS_HOST || 'localhost',
          port: parseInt(process.env.AUTH_MS_PORT as string) || 3001,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
