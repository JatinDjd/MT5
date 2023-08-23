import { IsArray, IsInt, IsNotEmpty, IsObject, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';


export class CreateDepositDto {

    @IsNotEmpty()
    @IsInt()
    amount: number

    @IsNotEmpty()
    @IsString()
    provider: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    payload: string;
}