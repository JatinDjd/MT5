/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';
import { UsersService } from '../../services/users/users.service';
import { UserEditDto } from '../../dto/userEdit.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile } from '../../entities/user_profile.entity';


@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }


    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Post()
    async create(@Body() userDto: UserDto) {
        const user = {
            ...userDto,
            isActive: true,
            isVerified: false,
        };
        const createdUser = this.userService.create(user);
        return createdUser;
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Put(':id')
    async update(@Param('id') id: string, @Body() userDto: UserEditDto): Promise<User> {
        const user: Partial<User> = {
            ...userDto,
            isActive: true,
            isVerified: false,
        };
        return this.userService.update(id, user as User);
    }


    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(id);
    }
}
