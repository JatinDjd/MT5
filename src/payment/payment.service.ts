import { Injectable } from '@nestjs/common';
import { InjectRazorpay } from 'nestjs-razorpay';
import  Razorpay from 'razorpay';

@Injectable()
export class PaymentService {

    // private readonly razorpay: Razorpay;

    constructor() 
    {
    //   this.razorpay = new Razorpay({
    //     key_id: process.env.KEY_ID,
    //     key_secret: process.env.KEY_SECRET,
    //   });
    }



    async createPaymentOrder(upiData) {

        var razorpay=new Razorpay({
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




}
