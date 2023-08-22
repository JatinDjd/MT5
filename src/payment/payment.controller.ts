import { Body, Controller, Get, Render, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {


    constructor (private readonly paymentService:PaymentService) {}    


    @Post()
    // @Render('upi') // Specify the payment template name (without .hbs extension)
    async initiatePayment(@Body() upiData) {
        const paymentOrder = await this.paymentService.createPaymentOrder(upiData);
        // return { paymentOrder };
        return paymentOrder;
    }




}
