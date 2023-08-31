import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, Unique } from "typeorm";

@Entity({ name:'user_profile' })

export class CompleteProfile {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @Column({name:'user_id'})
    userId: string;

    @Column({name:'address'})
    address:string;

    @Column({name:'city'})
    city:string;

    @Column({name:'state'})
    state:string;
  
    @Column({name:'Country'})
    country:string;
  
    @Column({name:'Date Of Birth'})
    DOB: string;

    @Column({name:'Gender'})
    gender: string;  
  
    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
    
    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
  
  }