import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/groups.entity';
import { GroupUser } from './entities/groups_users.entity';
import { Manager } from './entities/manager.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
     Group,
     GroupUser,
     Manager
    ])
  ],
  controllers: [ManagerController],
  providers: [ManagerService]
})
export class ManagerModule {}

