import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnprocessableEntityException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WrapPositionDto } from './dto/wrap-position.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrdersService) { }


    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Post('new-order')
    async createGroup(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        const userId = req.user.id;
        try {
            switch (createOrderDto.OrderType) {
                case 'Buy':
                    var order = await this.orderService.createBuy(createOrderDto, userId);
                    break;
                default:
                    var order = await this.orderService.createSell(createOrderDto, userId);
                    break;
            }
            if (order) return { message: 'Order created successfully', order };
        } catch (error) {
            return { error: error.message };
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Post('wrap-position')
    async wrapPosition(@Body() wrapPositionDto: WrapPositionDto, @Request() req) {
        const userId = req.user.id;
        try {
            const order = await this.orderService.wrapPosition(wrapPositionDto, userId);
            if (order) return { message: 'Order closed successfully', order };
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

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @Get('active-orders')
    findActiveOrders(@Request() req) {
        const userId = req.user.id;
        return this.orderService.findActiveOrders(userId);
    }




}
