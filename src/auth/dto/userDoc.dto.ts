import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DocType {

    @IsNotEmpty()
    @ApiProperty({enum:['Passport (main page)','Permanent Account Number (PAN) card (front)',"Driver's License (front and back)","Aadhaar card(front and back)","Voter Id card (front and back)"]})
    document_type:string;

}