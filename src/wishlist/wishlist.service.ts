import { Injectable, NotFoundException, UnprocessableEntityException, } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) { }


  async create(createWishlistDto: CreateWishlistDto, userId: any) {
    // Check if an item with the same symbol already exists
    const existingItem = await this.wishlistRepository.findOne({
      where: { symbol: createWishlistDto.symbol, user: { id: userId } },
    });

    if (existingItem) {
      throw await new UnprocessableEntityException('A wishlist item with this symbol already exists.');
    }

    const newItem = await this.wishlistRepository.create(createWishlistDto);
    newItem.user = userId;
    return await this.wishlistRepository.save(newItem);
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  async remove(id: string) {
    await this.wishlistRepository.delete(id);
  }
}
