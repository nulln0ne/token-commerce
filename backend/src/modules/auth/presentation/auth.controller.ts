import { Controller, Body, Post, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { UserService } from 'src/modules/user/application/user.service';
import { JwtAccessGuard } from '../application/jwt-access.guard';
import { CreateUserDto } from 'src/modules/user/application/create-user.dto';

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
    async login(@Body('walletAddress') walletAddress: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.authService.login(user.userId);
    }

    @UseGuards(JwtAccessGuard)
    @Post('logout')
    async logout(@Body('walletAddress') walletAddress: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.authService.logout(user.userId);
    }

    @UseGuards(JwtAccessGuard)
    @Post('refresh')
    async refreshTokens(@Body('walletAddress') walletAddress: string, @Body('refreshToken') refreshToken: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.authService.refreshTokens(user.userId, refreshToken);
    }
}
