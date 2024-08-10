import { CreateUserDto } from 'src/modules/user/application/';
import { AuthService } from '../application/auth.service';
import { UserService } from 'src/modules/user/application';
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../application/jwt-access.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        const user = await this.userService.createUser(dto);
        return this.authService.login(user.userId);
    }

    @Post('login')
    async login(@Body('userId') userId: string) {
        return this.authService.login(userId);
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
