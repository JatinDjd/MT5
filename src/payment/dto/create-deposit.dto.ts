import { IsArray, IsEnum, IsInt, IsNotEmpty, IsObject, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';


enum OrderStatus {
    Pending = 'pending',
    Completed = 'completed',
}
export class CreateDepositDto {

    @IsNotEmpty()
    @IsInt()
    amount: number

    @IsNotEmpty()
    @IsString()
    transactionId: string;

    
    @IsNotEmpty()
    @IsString()
    provider: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    payload: string;

    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;
}