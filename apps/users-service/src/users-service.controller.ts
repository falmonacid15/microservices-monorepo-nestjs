import { Controller, Get } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll() {
    return this.usersServiceService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_user' })
  async findOne(@Payload() where: Prisma.UserWhereUniqueInput) {
    return this.usersServiceService.findOne(where);
  }

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload() data: CreateUserDto) {
    return this.usersServiceService.create(data);
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(
    @Payload()
    payload: {
      data: UpdateUserDto;
      where: Prisma.UserWhereUniqueInput;
    },
  ) {
    return this.usersServiceService.update(payload.data, payload.where);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async remove(@Payload() where: Prisma.UserWhereUniqueInput) {
    return this.usersServiceService.remove(where);
  }
}
