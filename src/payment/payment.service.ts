import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { Deposit } from './entities/deposits.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {


  constructor(@InjectRepository(Deposit)
  private readonly depositRepository: Repository<Deposit>,) {
    //   this.razorpay = new Razorpay({
    //     key_id: process.env.KEY_ID,
    //     key_secret: process.env.KEY_SECRET,
    //   });

  }



  async createPaymentOrder(upiData) {

    var razorpay = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET
    })


        try {

            const res=await razorpay.paymentLink.create({
                amount: upiData.amount,
                currency: "INR",
                description: "For XYZ purpose",
                customer: {
                  name: "Gaurav Kumar",
                  email: "gaurav.kumar@example.com",
                  contact: "+919000090000"
                },
                notify: {
                  sms: true,
                  email: true
                },
                reminder_enable: true,
                options: {
                  checkout: {
                    method: {
                      netbanking: 0,
                      card: 0,
                      upi: 1,
                      wallet: 0
                    }
                  }
                }
              })
    
              return res;
            
        } catch (error) {

            throw error;
            
        }


  };

  async createDeposit(data) {
    const deposit = await this.depositRepository.save(
      {
        amount: data.title,
        user: data.userId,
        provider: data.provider,
        transactionId: data.transactionId
      },
      { transaction: true },
    );
    return deposit;
  }


}
