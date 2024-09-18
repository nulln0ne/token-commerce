import { Controller, Body, Post, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../../application/services/authentication.service';  
import { CreateUserDto } from 'src/modules/user/application/dtos/create-user.dto';
import { JwtAccessGuard } from 'src/libs/guards/jwt-access.guard'; 
import { NonceService } from '../../application/services/nonce.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthenticationService, private readonly nonceService: NonceService) {}

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
    async logout(@Body('walletAddress') id: number) {
        return this.authService.logoutUser(id);
    }

    @Post('get-nonce')
    async getNonce(@Body('walletAddress') walletAddress: string) {
        if (!walletAddress) {
            throw new UnauthorizedException('Wallet address is required');
        }
        const nonce = await this.nonceService.generateNonce(walletAddress);
        return { nonce: `${nonce}` };
    }
}
