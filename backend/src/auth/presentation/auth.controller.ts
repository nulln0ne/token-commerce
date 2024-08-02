import { Controller, Body, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/application/create-user.dto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async auth(@Body() dto: CreateUserDto) {
        return this.authService.createUser(dto);
    }

    @Post('refresh')
    async refreshTokens(@Body('userId') userId: string, @Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
