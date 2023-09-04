import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Wishlist } from './entities/wishlist.entity';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      Wishlist
    ])
  ]
})
export class WishlistModule {}
