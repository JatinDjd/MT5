import { Controller, Get, Post, Body, UseGuards, Param, Delete, Request, HttpException, HttpStatus } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Request() req,) {
    try {
      return await this.wishlistService.create(createWishlistDto, req.user.id);
    } catch (error) {
      switch (error.status) {
        case 422:
          throw new HttpException(
            {
              statusCode: 422,
              message: ['A wishlist item with this symbol already exists.'],
              data: []
            },
            HttpStatus.BAD_REQUEST,
          );

        default:
          throw new HttpException(
            {
              statusCode: 500,
              message: ['Internal server error'],
              data: []
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }


  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }



  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(id);
  }
}
