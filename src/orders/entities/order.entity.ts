// trade.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
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

  @Column({ nullable: true })
  OrderCategories: string;

  @Column({ nullable: true })
  Remarks: string;

  @Column('decimal', { precision: 10, scale: 2 })
  oBuySell: number;
}
