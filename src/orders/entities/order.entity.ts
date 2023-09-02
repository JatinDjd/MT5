// trade.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

enum OrderCategory {
  InstantExecution = 0,
  BuyLimit = 1,
  SellLimit = 2,
  BuyStop = 3,
  SellStop = 4,
  BuyStopLimit = 5,
  SellStopLimit = 6,
}
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: number;


  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column({ name: 'UserId', type: 'uuid' }) //user ID is User ID of order creator/owner
  UserId: string;

  @Column({ default: 0 })
  Deviation: number;

  @Column({ nullable: true })
  expiration: number;

  @Column({ nullable: true })
  FullPairName: string;

  @Column({ nullable: true })
  PairId: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  SwapRate: number;

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

  @Column({ enum: OrderCategory, default: 'Instant Execution' })
  OrderCategories: string;

  @Column({ nullable: true })
  Remarks: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  openingPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  closingPrice: number;

  @Column({ enum: ['Manual', 'Triggered'], default: 'Manual' })
  closingType: string;

  @Column({ enum: ['Pending', 'Cancelled', 'Closed'], default: 'Pending' })
  tradeStatus: string;

  @Column({ enum: ['Buy', 'Sell'], default: 'Buy' })
  orderType: string;
}
