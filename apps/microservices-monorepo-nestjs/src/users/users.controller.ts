import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    return firstValueFrom(this.usersClient.send({ cmd: 'find_all_users' }, {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'find_one_user' }, { id }),
    );
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    return firstValueFrom(this.usersClient.send({ cmd: 'create_user' }, data));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'update_user' }, { data, where: { id } }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'delete_user' }, { id }),
    );
  }
}
