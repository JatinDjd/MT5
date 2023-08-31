import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class completeProfileDto {
    
    @IsNotEmpty()
    // @IsDateString()
    @ApiProperty({format: 'dd-mm-yyy', example: '15-03-2023'})
    DOB:string;

    @IsNotEmpty()
    @ApiProperty({example:'(apartment) house, street'})
    address:string;

    @IsNotEmpty()
    @ApiProperty({example:'mohali'})
    city:string;

    @IsNotEmpty()
    @ApiProperty({example:'punjab'})
    state:string;

    @IsNotEmpty()
    @ApiProperty({example:'India'})
    country:string;

    @IsNotEmpty()
    @ApiProperty({enum:['Male', 'Female', 'Not Sure']})
    gender:string;

}