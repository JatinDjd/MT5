import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/groups.entity';
import { Repository } from 'typeorm';
import { GroupUser } from './entities/groups_users.entity';

@Injectable()
export class ManagerService {

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupUser)
    private readonly groupUserRepository: Repository<GroupUser>,

  ) { }


  async createGroup(data: any, userId: any) {
    try {
      const group = await this.groupRepository.save(
        {
          title: data.title,
          user: userId,
          margin: data.margin
        },
        { transaction: true },
      );

      for (const memberId of data.memberIds) {
        await this.groupUserRepository.save(
          {
            userId: memberId,
            groupId: group.id
          },
          { transaction: true },
        );
      }

      if (group) {
        return group;
      }
    } catch (error) {
      const err = error.message;
      console.log(error);
      throw new UnprocessableEntityException('Unable to create group!');
    }
  }

  async findAllGroups() {
    return await this.groupRepository.find({
      select: {
        id: true,
        title: true,
        margin: true
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} manager`;
  }

  updateGroup(id: number, updateManagerDto: UpdateManagerDto) {
    return `This action updates a #${id} manager`;
  }

  async removeGroup(id: string) {
    const delete_group = await this.groupRepository.delete(id);
    if (delete_group) return await this.groupUserRepository.delete({ groupId: id });
    throw new NotFoundException('No data found!');
  }
}
