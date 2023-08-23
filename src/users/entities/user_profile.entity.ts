// trade.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.profiles)   //customer reference using userId
    user: User


    @Column()
    company: string;

    @Column()
    phone: string;

    @Column()
    country: string;

    @Column()
    zipCode: number;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    address: string;
}
