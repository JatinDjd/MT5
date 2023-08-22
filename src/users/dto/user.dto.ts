import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  zipCode: number;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  address: string;


}