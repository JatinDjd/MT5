import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Group } from '../manager/entities/groups.entity';
import { GroupUser } from '../manager/entities/groups_users.entity';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupUser)
    private readonly groupUserRepository: Repository<GroupUser>,
    private readonly paymentService: PaymentService

  ) { }


  async create(data: any, userId: any) {
    try {
      const isValidOrderValue = await this.validateOrderValue(userId, data);
      const isValidSL = await this.validateStopLoss(data);
      
      if (!isValidOrderValue) throw new Error("Order amount must be less than or equal to the margin amount");
      if (!isValidSL) throw new Error("Stop-loss must be greater than entry price");
      if (isValidOrderValue && isValidSL) {
        const order = await this.orderRepository.save({
          MsgCode: data.MsgCode,
          Symbol: data.Symbol,
          Price: data.Price,
          StopLimitPrice: data.StopLimitPrice,
          LotSize: data.LotSize,
          SL: data.SL,
          oBuySell: data.oBuy_Sell,
          TakeProfit: data.TP,
          UserId: userId
        });
        return order;
      }
    } catch (error) {
      throw new Error(error.message);

    }
  }

  async findAll(userid: string) {
    const orders = await this.orderRepository.find({ where: { UserId: userid } });
    return orders;
  }

  async validateStopLoss(data: any) {
    // Check if stop-loss is provided and valid
    console.log('data', data);
    if (Number(data.SL) !== undefined && Number(data.SL) >= Number(data.Price)) {
      return false
    }
    return true;
  }

  async validateOrderValue(uId: string, data: any) {
    // check order value based on margin
    const groupUser = await this.groupUserRepository.findOne({ where: { userId: uId } });
    const group = await this.groupRepository.findOne({ select: ['margin'], where: { id: groupUser.id } });
    const walletAmt = await this.paymentService.totalDeposits(uId);
    console.log('walletAmt', walletAmt)
    const margin = walletAmt * group?.margin ?? 5 //default margin for external user
    if (data.Price !== undefined && data.Price <= margin) {
      return false;
    }
    return true;
  }
}
