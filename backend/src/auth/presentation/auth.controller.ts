import { Controller, Body, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/application/create-user.dto';
import { AuthService } from '../application/auth.service';
import { UserService } from 'src/user/application/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('login')
    async auth(@Body() dto: CreateUserDto) {
        console.log(dto);
        let user = await this.userService.findOneByWalletAddress(dto.walletAddress);

        if (!user) {
            user = await this.userService.createUser(dto);
        }

        return this.authService.login(user.id);
    }

    @Post('refresh')
    async refreshTokens(@Body('userId') userId: string, @Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
