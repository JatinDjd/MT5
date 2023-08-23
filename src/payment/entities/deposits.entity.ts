/* eslint-disable prettier/prettier */
import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, ManyToMany } from 'typeorm';

@Entity({ name: 'deposits' })

export class Deposit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'provider' })
    provider: string;

    @Column({ name: 'transaction_id' })
    transactionId: string;

    @Column({ name: 'amount' })
    amount: number;

    @Column('json')
    payload: Record<string, any>;

    @ManyToOne(() => User, (user) => user.groups)   //customer reference using userId
    user: User


    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}