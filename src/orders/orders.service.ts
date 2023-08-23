import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Group } from '../manager/entities/groups.entity';
import { GroupUser } from '../manager/entities/groups_users.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupUser)
    private readonly groupUserRepository: Repository<GroupUser>,

  ) { }


  create(createOrderDto: CreateOrderDto, userId: any) {
    try {
      const order = this.orderRepository.save({
        MsgCode: createOrderDto.MsgCode,
        Symbol: createOrderDto.Symbol,
        Price: createOrderDto.Price,
        StopLimitPrice: createOrderDto.StopLimitPrice,
        LotSize: createOrderDto.LotSize,
        SL: createOrderDto.SL,
        oBuySell: createOrderDto.oBuy_Sell,
        TakeProfit: createOrderDto.TP,
        UserId: userId
      });
      return order;
    } catch (error) {
      throw new error(error.message);
    }
  }

  async findAll(userid: string) {
    const orders = await this.orderRepository.find({ where: { UserId: userid } });
    return orders;
  }

  async checkMarginValue(id: string) {
    const group = await this.groupUserRepository.findOne({ where: { userId: id } });
    const marginValue = await this.groupRepository.findOne({ select: ['margin'], where: { id: group.id } });
    return marginValue;
  }
}
