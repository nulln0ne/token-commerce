import { JwtAccessGuard } from 'src/modules/auth/application';
import { Controller, Get, Param, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../../application';
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAccessGuard)
    @Get()
    async getAll() {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    @UseGuards(JwtAccessGuard)
    @Get(':userId')
    async findOne(@Param('userId') userId: string) {
        try {
            return await this.userService.findUserByUserId(userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve user');
        }
    }
    @UseGuards(JwtAccessGuard)
    @Get('balance/:walletAddress')
    async getBalance(@Param('walletAddress') walletAddress: string) {
        try {
            return {
                walletAddress,
                balance: await this.userService.getUserBalance(walletAddress),
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve user balance');
        }
    }
}
