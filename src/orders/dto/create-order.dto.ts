import { IsInt, IsDecimal, IsString, IsEnum } from 'class-validator';


enum OrderCategory {
    InstantExecution = 'Instant Execution',
    BuyLimit = 'Buy Limit',
    SellLimit = 'Sell Limit',
    BuyStop = 'Buy Stop',
    SellStop = 'Sell Stop',
    BuyStopLimit = 'Buy Stop Limit',
    SellStopLimit = 'Sell Stop Limit',
}

enum OrderType {
    Buy = 'Buy',
    Sell = 'Sell',
}

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


    @IsEnum(OrderCategory)
    OrderCategories: OrderCategory;

    @IsEnum(OrderType)
    OrderType: OrderType;

    @IsString()
    Remarks: string;

    @IsDecimal()
    oBuy_Sell: number;
}
