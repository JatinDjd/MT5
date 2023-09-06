import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, IsNull, Not, Repository, getRepository } from 'typeorm';
import { Group } from '../manager/entities/groups.entity';
import { GroupUser } from '../manager/entities/groups_users.entity';
import { PaymentService } from '../payment/payment.service';
import WebSocket from 'websocket';
import { BackgroundProcessingService } from '../common/background-processing/background-processing.service';

@Injectable()
export class OrdersService {

  constructor(
    private readonly backgroundProcessingService: BackgroundProcessingService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupUser)
    private readonly groupUserRepository: Repository<GroupUser>,
    private readonly paymentService: PaymentService,
    // private readonly httpService: HttpService
  ) { }


  async createBuy(data: any, userId: any) {
    try {
      const isValidOrderValue = await this.validateOrderValue(userId, data);
      const isValidSL = await this.validateStopLossBuy(data);
      const isValidTP = await this.validateTakeProfitBuy(data);

      if (!isValidOrderValue) throw new Error("You don't have sufficient balance.");
      if (!isValidSL) throw new Error("Stop-loss must be less than current price");
      if (!isValidTP) throw new Error("Take-profile must be greater than current price");
      if (isValidOrderValue && isValidSL && isValidTP) {
        const order = await this.orderRepository.save({
          FullPairName: data.FullPairName,
          PairId: data.PairId,
          Symbol: data.Symbol,   //NICKNAME
          SwapRate: data.SwapRate,
          Price: data.Price,
          StopLimitPrice: data.StopLimitPrice,
          LotSize: data.LotSize,
          SL: data.SL,
          oBuySell: data.oBuy_Sell,
          TakeProfit: data.TP,
          UserId: userId,
          openingPrice: data.OpeningPrice,
          closingPrice: data.ClosingPrice
        });
        return order;
      }
    } catch (error) {
      console.log('ERRRRROOOOORRRRR--->>>', error)
      throw new Error(error.message);

    }
  }

  async createSell(data: any, userId: any) {
    try {
      const isValidOrderValue = await this.validateOrderValue(userId, data);
      const isValidSL = await this.validateStopLossSell(data);
      const isValidTP = await this.validateTakeProfitSell(data);

      if (!isValidOrderValue) throw new Error("You don't have sufficient balance.");
      if (!isValidSL) throw new Error("Stop-loss must be greater than entry price");
      if (!isValidTP) throw new Error("Take-profit must be less than entry price");
      if (isValidOrderValue && isValidSL && isValidTP) {
        const order = await this.orderRepository.save({
          FullPairName: data.FullPairName,
          PairId: data.PairId,
          Symbol: data.Symbol,   //NICKNAME
          SwapRate: data.SwapRate,
          Price: data.Price,
          StopLimitPrice: data.StopLimitPrice,
          LotSize: data.LotSize,
          SL: data.SL,
          oBuySell: data.oBuy_Sell,
          TakeProfit: data.TP,
          UserId: userId,
          openingPrice: data.OpeningPrice,
          closingPrice: data.ClosingPrice
        });
        return order;
      }
    } catch (error) {
      throw new Error(error.message);

    }
  }


  async wrapPosition(data: any, userId: any) {
    try {
      const order = await this.orderRepository.update(
        { id: data.orderId, UserId: userId },
        {
          closingPrice: data.currentClosingPrice,
          closingType: 'Manual'
        });
      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  }





  async findAll(userid: string) {
    const orders = await this.orderRepository
      .createQueryBuilder("orders")
      .where("orders.UserId= :UserId", { UserId: userid })
      .andWhere("orders.tradeStatus = :tradeStatus")
      .getMany();

    return orders;
  }

  async orderTypes() {
    return [{ 'name': 'Instant Execution', 'id': 1 }
      , { 'name': 'Buy Limit', 'id': 2 }
      , { 'name': 'Sell Limit', 'id': 3 }
      , { 'name': 'Buy Stop', 'id': 4 }
      , { 'name': 'Sell Stop', 'id': 5 }
      , { 'name': 'Buy Stop Limit', 'id': 6 }
      , { 'name': 'Sell Stop Limit', 'id': 7 }]
  }


  async findManagerOrders(userid) {
    // const managerGroups = await this.groupRepository.find({
    //   where: { userId: userid }, // Use 'userId' instead of 'user'
    //   select: ['id']
    // });
    // const users = await this.groupUserRepository.find({ where: { groupId: In(managerGroups) }, select: ['userId'] });
    // const orders = await this.orderRepository.find({ where: { UserId: In(users) } });
    // return orders;
    return [];
  }

  async findActiveOrders(userid: string) {
    try {
      const orders = await this.orderRepository
        .createQueryBuilder("orders")
        .where("orders.UserId= :UserId", { UserId: userid })
        .andWhere("orders.tradeStatus = :tradeStatus", { tradeStatus: "Pending" })
        .getMany();
      return orders;
    } catch (error) {
      console.log(error)
      return error.message;
    }

  }

  async validateStopLossBuy(data: any) {
    // Check if stop-loss is less than or equal to the current price and valid
    if (Number(data.SL) !== undefined && Number(data.SL) <= Number(data.currentInitialPrice)) {
      return false
    }
    return true;
  }

  async validateTakeProfitBuy(data: any) {
    // Check if take-profit is greater than or equal to the current price and valid
    if (Number(data.SL) !== undefined && Number(data.TP) >= Number(data.currentInitialPrice)) {
      return false
    }
    return true;
  }


  async validateStopLossSell(data: any) {
    // Check if stop-loss is less than or equal to the current price and valid
    if (Number(data.SL) !== undefined && Number(data.SL) > Number(data.currentInitialPrice)) {
      return false
    }
    return true;
  }

  async validateTakeProfitSell(data: any) {
    // Check if take-profit is greater than or equal to the current price and valid
    if (Number(data.SL) !== undefined && Number(data.TP) < Number(data.currentInitialPrice)) {
      return false
    }
    return true;
  }

  async validateOrderValue(uId: string, data: any) {
    // check order value based on margin
    const groupUser = await this.groupUserRepository.findOne({ where: { userId: uId } });
    if (groupUser) {
      var group = await this.groupRepository.findOne({ select: ['margin'], where: { id: groupUser.id } });
    }
    const walletAmt = await this.paymentService.totalDeposits(uId);
    if (!walletAmt) return false;
    const margin = walletAmt * group?.margin ?? 5 //default margin for external user
    if ((data.OpeningPrice ?? data.ClosingPrice) <= margin) {
      return false;
    }
    return true;
  }


  async autoWrapPosition() {
    try {
      const client = new WebSocket.client();
      client.on('connect', (connection) => {
        console.log('Connected to WebSocket server');

        // Define an async function to perform the database query
        const handleWebSocketMessage = async (message) => {
          if (message.type === 'utf8') {
            // Handle WebSocket messages here
            try {
              const orderSL = await this.orderRepository.find();
              const feedData = JSON.parse(message.utf8Data).data;
              feedData.forEach(async (item) => {
                const recordFound = orderSL.find((dbItem) => dbItem.openingPrice === item.askprice);

                if (recordFound) {
                  // Call the process to update in DB async
                  console.log(`Found record with id: ${recordFound.id}`);
                  const updateData = { id: recordFound.id, cmp: item.currentmarketprice };
                  await this.backgroundProcessingService.processUpdateTask(updateData);
                }
              });
            } catch (error) {
              console.error('Error while performing the database query:', error);
            }
          }
        };

        connection.on('message', handleWebSocketMessage);

        connection.on('close', (reasonCode, description) => {
          console.log(`WebSocket connection closed: ${reasonCode} - ${description}`);
        });
      });

      client.connect('ws://192.168.0.118/Quotes');
    } catch (error) {
      throw new Error(error.message);
    }

  }



}
