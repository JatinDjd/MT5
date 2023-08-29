import { Body, Controller, Get, UseGuards, Post, Request, Render, Req, Session, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { upiLinkDTO } from './dto/upiLink.dto';
import * as session from 'express-session';


@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }


  @Post('create-deposit')
  createDeposit(@Body() createDepositDto: CreateDepositDto) {
    return this.paymentService.createDeposit(createDepositDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post('payment-link')
  // @Render('upi') // Specify the payment template name (without .hbs extension)
  async initiatePayment(@Body() upiData: upiLinkDTO, @Request() req) {
    let userId = { userId: req.user.id };
    const paymentOrder = await this.paymentService.createPaymentOrder(upiData, userId);

    // return { paymentOrder };
    return paymentOrder;
  }

  
  
  @Post('payment-confirmation')
  async paymentConfirmation(@Body() webhookData: any, @Session() session:Record<string, any>) {
    console.log('webhokData', webhookData)
    const result=await this.paymentService.paymentConfirmation(webhookData);
    console.log(result);
      
      return result; // Handle other cases if needed
    

  }


  @Get('dashboard')
  @Render('upi')
  async renderDashboard(@Session() session:Record<string, any>) {
    console.log("sessionnnn", session.accessToken)
    return {token:session.accessToken}
  }

  // @Get('test')
  // async test(@Session() session:Record<string, any>){
  //   console.log(session)
  //   console.log(session.accessToken)
  //   return session.accessToken;
  // }
  
  @Get('deposit-complete')
  @Render('upi')
  async paymentComplete(@Session() session:Record<string, any>) {

  }


  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('total-deposits')
  totalDeposits(@Request() req) {
    const userId = req.user.id;
    return this.paymentService.totalDeposits(userId);
  }


  @Roles('manager')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('transactions')
  transactions(@Request() req) {
    const userId = req.user.id;
    return this.paymentService.transactions();
  }

  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('transactions-customer')
  transactionsCustomers(@Request() req) {
    const userId = req.user.id;
    console.log(userId);
    return this.paymentService.transactionsCustomer(userId);
  }

  @Get('order-history')
  async orderHistory(@Request() req) {
    let userId = { userId: req.user.id };
        console.log(req.user);
        return await this.paymentService.orderHistory(userId);

  }



}
