/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly user:Repository<User>
    ) {

    }

    async findAll(): Promise<User[]> {
        return this.user.find();
      }
    
      async findOne(id): Promise<User> {
        return this.user.findOne( { where: { id } })
      }
    
      async create(user: User): Promise<User> {
        return this.user.save(user);
      }
    
      async update(id, user: User): Promise<User> {
        await this.user.update(id, user);
        return this.user.findOne({ where: { id } });
      }
    
      async remove(id): Promise<void> {
        await this.user.delete(id);
      }

}
