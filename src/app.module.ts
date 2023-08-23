/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './mail/mail.module';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { ManagerModule } from './manager/manager.module';
import { Group } from './manager/entities/groups.entity';
import { GroupUser } from './manager/entities/groups_users.entity';
import { Manager } from './manager/entities/manager.entity';
import { FeedsModule } from './feeds/feeds.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { UserProfile } from './users/entities/user_profile.entity';
import { PaymentModule } from './payment/payment.module';
import { Deposit } from './payment/entities/deposits.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, RefreshToken, Group, GroupUser, Manager, Order, UserProfile,Order, Deposit],
        synchronize: true,   //make true if want to run migration 
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UsersModule,
    AuthModule,
    MailModule,
    ManagerModule,
    FeedsModule,
    OrdersModule,
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
