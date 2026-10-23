import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async register(data: RegisterDto) {
    return firstValueFrom(this.authClient.send({ cmd: 'auth_register' }, data));
  }

  async login(data: LoginDto) {
    return firstValueFrom(this.authClient.send({ cmd: 'auth_login' }, data));
  }
}
