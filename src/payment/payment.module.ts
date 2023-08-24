import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { RazorpayModule } from 'nestjs-razorpay';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './entities/deposits.entity';

@Module({
  imports: [
    RazorpayModule.forRoot({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET
    }),
    TypeOrmModule.forFeature([
      Deposit
     ])
   ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
