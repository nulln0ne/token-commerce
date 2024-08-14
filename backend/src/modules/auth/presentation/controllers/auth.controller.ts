import { Controller, Body, Post, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application';
import { CreateUserDto } from 'src/modules/user/application';
import { JwtAccessGuard } from '../../application';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async authenticate(@Body() createUserDto: CreateUserDto, @Body('signature') signature: string) {
        return this.authService.authenticateUser(createUserDto, signature);
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }
        return this.authService.refreshTokens(refreshToken);
    }

    @UseGuards(JwtAccessGuard)
    @Post('logout')
    async logout(@Body('walletAddress') walletAddress: string) {
        return this.authService.logout(walletAddress);
    }

    @Post('get-nonce')
    async getNonce(@Body('walletAddress') walletAddress: string) {
        if (!walletAddress) {
            throw new UnauthorizedException('Wallet address is required');
        }

        const nonce = await this.authService.generateNonce(walletAddress);
        return { nonce, message: `Please sign the message: ${nonce}` };
    }
}
