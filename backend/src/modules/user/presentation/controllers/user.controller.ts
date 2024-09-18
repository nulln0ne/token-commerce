import { JwtAccessGuard } from 'src/modules/auth/application';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../../application';
import { TransactionHistoryResponse } from 'src/modules/blockchain-eth/infrastructure/transaction-history-response.interface';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAccessGuard)
    @Get()
    async getAll() {
        return this.userService.getAllUsers();
    }

    @UseGuards(JwtAccessGuard)
    @Get(':userId')
    async findOne(@Param('userId') id: number) {
        return this.userService.findUserByUserId(id);
    }

    @UseGuards(JwtAccessGuard)
    @Get('balance/:walletAddress')
    async getBalance(@Param('walletAddress') walletAddress: string) {
        const balance = await this.userService.getUserBalance(walletAddress);
        return {walletAddress,balance,};
    }

    @UseGuards(JwtAccessGuard)
    @Get('transactions/:walletAddress')
    async getTransactionHistory(@Param('walletAddress') walletAddress: string): Promise<TransactionHistoryResponse> {
        return this.userService.getTransactionHistory(walletAddress);
    }
}
