import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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

  async findOne(id: string) {
    return await this.groupRepository.findOne({ where: { id: id } });
  }

  async updateGroup(data: any) {
    try {
      const group = await this.groupRepository.update({ id: data.groupId, user: data.userId },
        {
          title: data.title,
          margin: data.margin
        }
      );

      await this.groupUserRepository.delete({ groupId: data.groupId });

      for (const memberId of data.memberIds) {
        await this.groupUserRepository.save(
          {
            userId: memberId,
            groupId: data.groupId
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
      throw new UnprocessableEntityException('Unable to update group!');
    }
  }

  async removeGroup(id: string) {
    const delete_group = await this.groupRepository.delete(id);
    if (delete_group) return await this.groupUserRepository.delete({ groupId: id });
    throw new NotFoundException('No data found!');
  }
}
