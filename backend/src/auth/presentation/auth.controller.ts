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
        return this.userService.createUser(dto);
    }

    @Post('refresh')
    async refreshTokens(@Body('userId') userId: string, @Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
