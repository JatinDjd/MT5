import { Body, Controller, Get, UseGuards, Post, Request, Render } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { upiLinkDTO } from './dto/upiLink.dto';

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
  async initiatePayment(@Body() upiData:upiLinkDTO, @Request() req) {
    let userId = { userId: req.user.id };
    const paymentOrder = await this.paymentService.createPaymentOrder(upiData,userId);
    
    // return { paymentOrder };
    return paymentOrder;
  }

  @Post('payment-confirmation')
  async paymentConfirmation(@Body() webhookData: any) {
    // console.log('webhokData', webhookData)
    const result=await this.paymentService.paymentConfirmation(webhookData);
    return result;
  }

  @Get('dashboard')
  @Render('upi')
  async renderDashboard() {

    return {}
  }

  




}
