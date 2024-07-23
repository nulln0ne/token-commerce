import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    walletAddress?: string;
}
