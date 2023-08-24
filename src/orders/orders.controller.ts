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
    async createGroup(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        const userId = req.user.id;
        //check amount based on margin based trade amt 
        // const isValidToOrder = this.orderService.checkValidations(userId, createOrderDto);
        try {
            const order = await this.orderService.create(createOrderDto, userId);
            if (order) return { message: 'Order created successfully', order };
        } catch (error) {
            return { error: error.message };
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Get('orders')
    findAllOrders(@Request() req) {
        const userId = req.user.id;
        return this.orderService.findAll(userId);
    }

}
