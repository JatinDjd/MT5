import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class OrdersGateway  implements OnModuleInit {
  @WebSocketServer()
  server: Server
  constructor(private readonly orderService: OrdersService) { }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id)
      console.log('connected')
    })
  }


  @SubscribeMessage('createOrder')
  async create(@MessageBody() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    this.server.emit('createOrder', order);
    // return feed;
  }

  @SubscribeMessage('findAllOrders')
  async findAll(@ConnectedSocket() socket: Socket) {
    const orders = await this.orderService.findAll();
    this.server.emit('findAllOrders', orders);
    // return feeds
  }

}
