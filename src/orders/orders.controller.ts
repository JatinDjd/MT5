import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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
        return this.orderService.create(createOrderDto, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Get('orders')
    findAllOrders(@Request() req) {
        const userId = req.user.id;
        return this.orderService.findAll(userId);
    }

}
