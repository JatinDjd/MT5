import { IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsInt()
    MsgCode: number;

    @IsString()
    Symbol: string;

    @IsNumber()
    Price: number;

    @IsNumber()
    StopLimitPrice: number;

    @IsNumber()
    @IsPositive()
    LotSize: number;

    @IsNumber()
    SL: number;

    @IsNumber()
    TP: number;

    @IsInt()
    OrderCategories: number;

    @IsString()
    Remarks: string;

    @IsInt()
    oBuy_Sell: number;
}
