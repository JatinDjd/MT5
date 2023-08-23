import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnprocessableEntityException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrdersService) { }


    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Post('new-order')
    createGroup(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        const userId = req.user.id;
        //check amount based on margin based trade amt 
        const isValidAmount = this.checkMarginValue(userId, createOrderDto.Price);
        if (isValidAmount) return this.orderService.create(createOrderDto, userId);
        throw new UnprocessableEntityException(
            'Order amount should less then available trade amount!',
        );
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Get('orders')
    findAllOrders(@Request() req) {
        const userId = req.user.id;
        return this.orderService.findAll(userId);
    }

    checkMarginValue(userId, orderAmt) {
        //check in groups based on user ID
        const marginVal = this.orderService.checkMarginValue(userId);
        //return the margin value and calculate trade amount based on that.
        // orderAmt<= marginVal*orderAmt;
        return true;
    }

}
