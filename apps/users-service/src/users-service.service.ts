import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUnique({ where });
  }

  async create(data: CreateUserDto) {
    return await this.prisma.user.create({ data });
  }

  async update(data: UpdateUserDto, where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.update({ data, where });
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.delete({ where });
  }
}
