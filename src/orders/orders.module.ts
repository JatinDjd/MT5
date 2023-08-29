import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './orders.controller';
import { Group } from '../manager/entities/groups.entity';
import { GroupUser } from '../manager/entities/groups_users.entity';
import { PaymentService } from '../payment/payment.service';
import { Deposit } from '../payment/entities/deposits.entity';


@Module({
  providers: [OrdersGateway, OrdersService, PaymentService],
  controllers: [OrderController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      Order,Group,GroupUser,Deposit
    ])
  ]
})
export class OrdersModule { }
