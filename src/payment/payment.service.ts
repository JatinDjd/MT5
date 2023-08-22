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




}
