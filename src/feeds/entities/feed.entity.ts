import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Feed {
//   @PrimaryGeneratedColumn()
//   id: number;

  @Column()
  ticker: string;

  @Column('decimal', { precision: 10, scale: 2 })
  bid: number;

  @Column('decimal', { precision: 10, scale: 2 })
  ask: number;

  @Column('decimal', { precision: 10, scale: 2 })
  open: number;

  @Column('decimal', { precision: 10, scale: 2 })
  low: number;

  @Column('decimal', { precision: 10, scale: 2 })
  high: number;

  @Column('decimal', { precision: 10, scale: 2 })
  changes: number;

  @Column({ type: 'date' })
  date: string;
}
