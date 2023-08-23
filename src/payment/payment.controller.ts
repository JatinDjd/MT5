import { Body, Controller, Get, UseGuards, Post, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Controller('payment')
export class PaymentController {
    constructor (private readonly paymentService:PaymentService) {}    

    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Post('create-deposit')
    createDeposit(@Body() createDepositDto: CreateDepositDto, @Request() req) {
      const userId = req.user.id;
      return this.paymentService.createDeposit(createDepositDto, userId);
    }

    @Post()
    // @Render('upi') // Specify the payment template name (without .hbs extension)
    async initiatePayment(@Body() upiData) {
        const paymentOrder = await this.paymentService.createPaymentOrder(upiData);
        // return { paymentOrder };
        return paymentOrder;
    }




}
