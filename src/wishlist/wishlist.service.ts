import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) { }


  create(createWishlistDto: CreateWishlistDto) {
    const newItem = this.wishlistRepository.create(createWishlistDto);
    return this.wishlistRepository.save(newItem);
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  async remove(id: string) {
    await this.wishlistRepository.delete(id);
  }
}
