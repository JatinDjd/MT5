/* eslint-disable prettier/prettier */
import { Controller,Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';
import { UsersService } from '../../services/users/users.service';
import { UserIdDto } from '../../dto/userId.dto';
import { UserEditDto } from '../../dto/userEdit.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly userService:UsersService ) {}


    @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() userDto: UserDto): Promise<User> {
    const user: Partial<User> = {
      ...userDto,
      isActive: true,
      isVerified: false,
    };
    return this.userService.create(user as User);
  }

  @Put(':id')
  async update(@Param('id') id:string, @Body() userDto: UserEditDto): Promise<User> {
    const user: Partial<User> = {
      ...userDto,
      isActive: true,
      isVerified: false,
    };
    return this.userService.update(id, user as User);
  }


  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }




}
