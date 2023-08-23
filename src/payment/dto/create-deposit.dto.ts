import { IsArray, IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateDepositDto {

    @IsNotEmpty()
    @IsInt()
    amount: number

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(32)
    provider: string;

}