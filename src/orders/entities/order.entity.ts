// trade.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)   //customer reference using userId
  user: User


  @Column()
  MsgCode: number;

  @Column()
  Symbol: string;

  @Column()
  Price: number;

  @Column()
  StopLimitPrice: number;

  @Column()
  LotSize: number;

  @Column()
  SL: number;

  @Column()
  TakeProfit: number;

  @Column()
  OrderCategories: string;

  @Column()
  Remarks: string;

  @Column()
  oBuySell: number;
}
