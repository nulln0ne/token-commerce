import { Controller, Body, Post, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application';
import { UserService } from 'src/modules/user/application';
import { JwtAccessGuard } from '../../application';
import { CreateUserDto } from 'src/modules/user/application';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('login')
    async login(@Body('walletAddress') walletAddress: string, @Body('signature') signature: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const isVerified = await this.authService.verifySignature(user.userId, signature, walletAddress);
        if (!isVerified) {
            throw new UnauthorizedException('Signature verification failed');
        }
        return this.authService.loginUser(user.userId);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.createUser(createUserDto);
        return this.authService.loginUser(user.userId);
    }

    @UseGuards(JwtAccessGuard)
    @Post('logout')
    async logout(@Body('walletAddress') walletAddress: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.authService.logoutUser(user.userId);
    }

    @Post('get-nonce')
    async getNonce(@Body('walletAddress') walletAddress: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const nonce = await this.authService.generateNonce(user.userId);
        const message = `Please sign the message: ${nonce}`;

        return { nonce, message };
    }

    @Post('verify-signature')
    async verifySignature(@Body('walletAddress') walletAddress: string, @Body('signature') signature: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isVerified = await this.authService.verifySignature(user.userId, signature, walletAddress);

        if (!isVerified) {
            throw new UnauthorizedException('Signature verification failed');
        }

        return { authenticated: true };
    }
}
