import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Account name is required' })
    accountname: string;
    @IsNotEmpty({ message: 'Account name is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}
