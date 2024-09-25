import { IsString,IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsString()
  signature: string;

  @IsNotEmpty()
  @IsString()
  walletAddress: string;
}
