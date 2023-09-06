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

    @Column({enum:['Admin', 'Agriculture', 'Accountancy', 'Admin / Secretarial', 'Catering / Hospitality', 'Marketing / PR', 'Education', 'Engineering', 'Financial Services', 'Healthcare', 'IT', 'Legal', 'Manufacturing', 'Military', 'Property / Construction', 'Retail / Sales', 'Telecommunications', 'Transport / Logistics', 'Others']})
    occupation:string;

    @Column({enum:['Employed (Full time)','Self-employed','Employed (Part time)','Unemployed','Student','Retired']})
    employment_status:string;

    @Column({enum:['Yes, I have less than 1 year of trading experience','Yes, I have 1+ years of trading experience','Yes, I have 2+ years of trading experience','Yes, I have 4+ years of trading experience','No, I have no trading experience']})
    previous_trading_experience:string;

    @Column({enum:['Investment' ,'Hedging' ,'Speculation']})
    purpose:string;

    @Column({enum:['$100,000 - $200,000','$50,000 - $100,000','$20,000 - $50,000','More than $200,000','$0 - $20,000']})
    annual_income:string;

    @Column({enum:['$100,000 - $200,000','$50,000 - $100,000','$20,000 - $50,000','More than $200,000','$0 - $20,000']})
    total_wealth:string;

    @Column({enum:['Savings','Employment / business proceeds','Rent','Inheritance','Borrowed funds / loan','Pension']})
    income_source:string;
  
    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
    
    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
  
  }