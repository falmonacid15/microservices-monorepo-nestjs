import { Controller } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern({ cmd: 'auth_register' })
  async register(@Payload() data: RegisterDto) {
    return this.authServiceService.register(data);
  }

  @MessagePattern({ cmd: 'auth_login' })
  async login(@Payload() data: LoginDto) {
    return this.authServiceService.login(data);
  }
}
