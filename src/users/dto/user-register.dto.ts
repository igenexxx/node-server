import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsString({ message: 'No name specified' }) name: string;

  @IsEmail({}, { message: 'Invalid email' }) email: string;

  @IsString({ message: 'No password specified' }) password: string;
}
