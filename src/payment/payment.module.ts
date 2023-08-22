import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { RazorpayModule } from 'nestjs-razorpay';

@Module({
  imports: [
    RazorpayModule.forRoot({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET
    }),
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
