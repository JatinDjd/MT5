import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, IsNull, Not, Repository, getRepository } from 'typeorm';
import { Group } from '../manager/entities/groups.entity';
import { GroupUser } from '../manager/entities/groups_users.entity';
import { PaymentService } from '../payment/payment.service';
import { interval } from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(
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


  // async autoWrapPosition(data: any, userId: any) {
  //   try {
  //     const dbRecords = await this.orderRepository.find();
  //     interval(20000) // 20 seconds interval
  //       .subscribe(async () => {
  //         await this.httpService.get('https://financialmodelingprep.com/api/v3/fx?apikey=99f9ea41ce6e84dcb91e0bc5d51f818d').subscribe(response => {
  //           const feedData = response;
  //           // Process the API response
  //         });
  //       )
  //     const feedData = [
  //       {
  //         "ticker": "EUR/USD",
  //         "bid": "1.08220",
  //         "ask": "1.08220",
  //         // ... other properties
  //       },
  //       {
  //         "ticker": "USD/JPY",
  //         "bid": "146.407",
  //         "ask": "146.407",
  //         // ... other properties
  //       },
  //       {
  //         "ticker": "GBP/USD",
  //         "bid": "1.26252",
  //         "ask": "1.26252",
  //         // ... other properties
  //       }
  //     ];
  //     // Initialize an array to store matched ask values and IDs
  //     const matchedValuesWithIds = [];
  //     // Map the response to get the ask values for the matching tickers
  //     const askValues = feedData.map(item => {
  //       const dbRecord = dbRecords.find(dbItem => dbItem.openingPrice === parseFloat(item.ask));
  //       if (dbRecord) {
  //         matchedValuesWithIds.push({
  //           ticker: item.ticker,
  //           ask: item.ask,
  //           dbAsk: dbRecord.ask, // Ask value from the database
  //           dbId: dbRecord.id, // ID from the database
  //         });
  //         return {
  //           ticker: item.ticker,
  //           ask: item.ask,
  //           dbAsk: dbRecord.ask, // Ask value from the database
  //         };
  //       }
  //       return null;
  //     }).filter(item => item !== null);

  //     const order = await this.orderRepository.update(
  //       { id: data.orderId, UserId: userId },
  //       {
  //         closingPrice: data.currentClosingPrice,
  //         closingType: 'Triggered'
  //       });
  //     return order;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }

  // }


  async findAll(userid: string) {
    const orders = await this.orderRepository
      .createQueryBuilder("orders")
      .where("orders.UserId= :UserId", { UserId: userid })
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


  //   async activeOrderHistory(user) {
  //   try {
  //     const res = await this.orderRepository.find({ where: { 'user': user.userId, 'tradeStatus':'pending' } });
  //     if (res) {
  //       return res;
  //     }
  //     else {
  //       return "No Record Found"
  //     }
  //   } catch (error) {
  //     return error;
  //   }

  // }

  async pastOrderHistory(user) {
    try {
      const res = await this.orderRepository.find({ where: { 'user': user.userId, 'tradeStatus':'closed' } });
      if (res) {
        return res;
      }
      else {
        return "No Record Found"
      }
    } catch (error) {
      return error;
    }

  }



}
