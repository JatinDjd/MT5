// trade.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: number;


  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column({ name: 'UserId', type: 'uuid' }) //user ID is User ID of order creator/owner
  UserId: string;

  @Column()
  MsgCode: number;

  @Column()
  Symbol: string;

  @Column('decimal', { precision: 10, scale: 2 })
  Price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  StopLimitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  LotSize: number;

  @Column('decimal', { precision: 10, scale: 2 })
  SL: number;

  @Column('decimal', { precision: 10, scale: 2 })
  TakeProfit: number;

  @Column({ enum: ['Instant Execution', 'Buy Limit', 'Sell Limit', 'Buy Stop', 'Sell Stop', 'Buy Stop Limit', 'Sell Stop Limit'], default: 'Instant Execution' })
  OrderCategories: string;

  @Column({ nullable: true })
  Remarks: string;

  @Column('decimal', { precision: 10, scale: 2 })
  oBuySell: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  openingPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  closingPrice: number;

  @Column({ enum: ['Manual','Triggered'], default: 'Manual' })
  closingType: string;

  @Column({ enum: ['Pending','Cancelled','Closed'], default: 'Pending' })
  tradeStatus: string;

  @Column({ enum: ['Buy','Sell'], default: 'Buy' })
  orderType: string;
}
