import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { Deposit } from './entities/deposits.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentService {


  constructor(@InjectRepository(Deposit)
  private readonly depositRepository: Repository<Deposit>,) {
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
        status:data.status
      },
      { transaction: true },
    );
    return deposit;
  }



  async createPaymentOrder(upiData, user) {

    var razorpay = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET
    })


        try {
          
            const res= await razorpay.paymentLink.create({
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
                      netbanking: 1,
                      card: 1,
                      upi: 1,
                      wallet: 0
                    }
                  }
                }
              });
              console.log('res',res);
              const data={
                amount:res.amount,
                user:user.userId,
                provider:"UPI",
                transactionId:res.id,
                status:"pending",
              
              }

              const savedData=await this.createDeposit(data);
              console.log('saved-data-------------------', savedData)
              if (savedData) {
                return res.short_url;
              }
              else {
                return "can't save to db"
              }

              
            
        } catch (error) {
              console.log(error)
            throw error;
            
        }
  };


  async paymentConfirmation(webhookData) {

    try {

      const data = await webhookData.event.body;
    // console.log(data.event);
    const webhook_id=data.payload.payment_link.entity.id;
    const payload = data.payload;

    const status = data.event === "payment_link.paid" ? 'completed' : 'failed';

    const dbUpdate = await this.depositRepository.update({ transactionId: webhook_id }, { payload, status });
  
    return `Number of rows affected - ${dbUpdate.affected}` ;

      
    } catch (error) {

      throw error;
      
    }

    

  }




}
