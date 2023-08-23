import { IsInt, IsDecimal, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsInt()
    MsgCode: number;

    @IsString()
    Symbol: string;

    @IsDecimal()
    Price: number;

    @IsDecimal()
    StopLimitPrice: number;

    @IsDecimal()
    LotSize: number;

    @IsDecimal()
    SL: number;

    
    @IsDecimal()
    TP: number;

    @IsInt()
    OrderCategories: number;

    @IsString()
    Remarks: string;

    @IsDecimal()
    oBuy_Sell: number;
}
