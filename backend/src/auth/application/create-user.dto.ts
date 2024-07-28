import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'The wallet address of the user',
        example: '0x123456789abcdef',
    })
    @IsString()
    @IsNotEmpty()
    readonly walletAddress: string;
}
