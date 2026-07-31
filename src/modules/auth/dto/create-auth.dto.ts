import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
    
    @IsStrongPassword()
    password!: string;

    @IsNotEmpty()
    @IsString()
    name!: string;
}
