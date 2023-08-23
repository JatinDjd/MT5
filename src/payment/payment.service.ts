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


    await razorpay.paymentLink.create({
      upi_link: false,
      amount: upiData.amount,
      currency: "INR",
      accept_partial: false,
      first_min_partial_amount: 100,
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
      // notes: {
      //   policy_name: "Jeevan Bima"
      // }
    });

  };

  async createDeposit(data, id) {
    const deposit = await this.depositRepository.save(
      {
        amount: data.title,
        user: id,
        provider: data.provider
      },
      { transaction: true },
    );

  }


}
