import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { Deposit } from './entities/deposits.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { query } from 'express';

@Injectable()
export class PaymentService {



  constructor(@InjectRepository(Deposit)
  private readonly depositRepository: Repository<Deposit>,
  @InjectRepository(Order)
  private readonly orderRepository:Repository<Order>
  ) {
    //   this.razorpay = new Razorpay({
    //     key_id: process.env.KEY_ID,
    //     key_secret: process.env.KEY_SECRET,
    //   });

  }


  async createDeposit(data) {
    const deposit = await this.depositRepository.save(
      {
        amount: data.amount,
        user: data.user,
        provider: data.provider,
        transactionId: data.transactionId,
        status: data.status
      },
      { transaction: true },
    );
    return deposit;
  }


  async totalDeposits(userId: string) {
    const sumResult = await this.depositRepository
      .createQueryBuilder('deposits')
      .select('SUM(deposits.amount)', 'sum')
      .where('deposits.status = :status AND deposits.userId = :userId', { status: 'completed', userId: userId })
      .getRawOne();
    console.log("summmmm---->>", sumResult)

    return sumResult?.sum ?? 0;
  }

  async transactions() {
    return await this.depositRepository.find({where:{'status':"completed"}});
  }

  async transactionsCustomer(user,filters) {

    try {
       // const userId = user;
    const query = this.depositRepository.createQueryBuilder('transaction');
    query.where('transaction.userId = :userId', { user });

    if (filters.status) {
      query.andWhere('transaction.status = :status', { status: filters.status });
    }

    // if (filters.last3Days) {
    //   const threeDaysAgo = new Date();
    //   threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    //   query.andWhere('transaction.date >= :last3Days', { last3Days: threeDaysAgo });
    // }

    // if (filters.last7Days) {
    //   const sevenDaysAgo = new Date();
    //   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    //   query.andWhere('transaction.date >= :last7Days', { last7Days: sevenDaysAgo });
    // }

    // if (filters.last30Days) {
    //   const thirtyDaysAgo = new Date();
    //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    //   query.andWhere('transaction.date >= :last30Days', { last30Days: thirtyDaysAgo });
    // }

    // if (filters.last3Months) {
    //   const threeMonthsAgo = new Date();
    //   threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    //   query.andWhere('transaction.date >= :last3Months', { last3Months: threeMonthsAgo });
    // }

    // if (filters.customStartDate && filters.customEndDate) {
    //   query.andWhere('transaction.date BETWEEN :customStartDate AND :customEndDate', {
    //     customStartDate: filters.customStartDate,
    //     customEndDate: filters.customEndDate,
    //   });
    // }

    return await query.getMany();
    return await this.depositRepository.find({ where: { 'user': user.userId}, select:['amount',"status","provider","transactionId","updated_at"] });

    } catch (error) {
      
      throw error;

    }


   
  }

  async createPaymentOrder(upiData, user) {
    const razorpay = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    try {
      const { amount } = upiData;
      const multipliedAmount = amount * 100;
      const res = await razorpay.paymentLink.create({
        amount: multipliedAmount,
        currency: 'INR',
        callback_method: "get",
        callback_url: 'https://trade.masterinfotech.com/api/payment/dashboard',
        description: 'For XYZ purpose',
        customer: {
          name: 'Gaurav Kumar',
          email: 'gaurav.kumar@example.com',
          contact: '+919000090000',
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
        options: { checkout: { method: { netbanking: 1, card: 1, upi: 1, wallet: 0 } } },
      });
      console.log("res------>>", res);

      const data = {
        amount: res.amount,
        user: user.userId,
        provider: 'UPI',
        transactionId: res.id,
        status: 'pending',
      };

      const savedData = await this.createDeposit(data);
      console.log(savedData)
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async paymentConfirmation(webhookData) {
    try {
      console.log("Start");
      const data = await webhookData;
      console.log("Before destructuring");
      const payload = data.payload;
      const event = data.event;
      console.log("After destructuring");
      // const { event, payload } = await data;
      console.log('1st statement')
      const webhook_id = payload.payment_link.entity.id;
      console.log('2nd statement')
      const status = event === 'payment_link.paid' ? 'completed' : 'failed';
      console.log('1st statement')
      const dbUpdate = await this.depositRepository.update({ transactionId: webhook_id }, { payload, status });
      console.log('3rd statement')
      return `Number of rows affected - ${dbUpdate.affected}`;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async activeOrderHistory(user) {
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

  // async pastOrderHistory(user) {
  //   try {
  //     const res = await this.orderRepository.find({ where: { 'user': user.userId, 'tradeStatus':'closed' } });
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




}

