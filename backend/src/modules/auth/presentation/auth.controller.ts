import { CreateUserDto } from 'src/modules/user/application/create-user.dto';
import { AuthService } from '../application/auth.service';
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../application/jwt-access.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async auth(@Body() dto: CreateUserDto) {
        return this.authService.createUser(dto);
    }

    @UseGuards(JwtAccessGuard)
    @Post('logout')
    async logout(@Body('userId') userId: string) {
        return this.authService.logout(userId);
    }

    @UseGuards(JwtAccessGuard)
    @Post('refresh')
    async refreshTokens(@Body('userId') userId: string, @Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
