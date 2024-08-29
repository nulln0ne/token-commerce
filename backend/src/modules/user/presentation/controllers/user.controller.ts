import { JwtAccessGuard } from 'src/modules/auth/application';
import { Controller, Get, Param, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../../application';
import { TransactionHistoryResponse } from '../../application/interfaces/transaction-history-response.interface'; 

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
            const balance = await this.userService.getUserBalance(walletAddress);
            return {
                walletAddress,
                balance,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve user balance');
        }
    }
    @UseGuards(JwtAccessGuard)
    @Get('transactions/:walletAddress')
    async getTransactionHistory(
        @Param('walletAddress') walletAddress: string
    ): Promise<TransactionHistoryResponse> {
        try {
            return await this.userService.getTransactionHistory(walletAddress);
        } catch (error) {
            console.error('Error retrieving transaction history:', error);
            throw new InternalServerErrorException('Failed to retrieve transaction history');
        }
    }
}
