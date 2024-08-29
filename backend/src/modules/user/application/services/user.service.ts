import { Injectable, Inject, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../domain';
import { v4 as uuidv4 } from 'uuid'; 
import { IUserRepository } from '../../domain';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ethers } from 'ethers';
import { TransactionHistoryResponse } from '../interfaces/transaction-history-response.interface'; 

@Injectable()
export class UserService {
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly etherscanProvider: ethers.providers.EtherscanProvider;

    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {
        this.provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/792dfbd1a9674e67bde3411fe04e4af3');
        this.etherscanProvider = new ethers.providers.EtherscanProvider('homestead', 'WY46Z8ZS4AZBEQDT6K767HRCYF2MFKNRX6');

    }


    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const existingUser = await this.userRepository.findUserByWalletAddress(createUserDto.walletAddress);

            if (existingUser) {
                throw new ConflictException('User with this wallet address already exists');
            }

            const newUser = new User(createUserDto.walletAddress);

            await this.userRepository.save(newUser);
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }
    async getAllUsers(): Promise<User[]> {
        try {
            return this.userRepository.getAllUsers();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    async findUserByWalletAddress(walletAddress: string): Promise<User | null> {
        try {
            return this.userRepository.findUserByWalletAddress(walletAddress);
        } catch (error) {
            throw new InternalServerErrorException('Failed to find user by wallet address');
        }
    }

    async findUserByUserId(userId: string): Promise<User | null> {
        try {
            return this.userRepository.findUserByUserId(userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to find user by user ID');
        }
    }
    async getUserBalance(walletAddress: string): Promise<string> {
        try {
            if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
                throw new InternalServerErrorException('Invalid wallet address format');
            }

            const balanceWei = await this.provider.getBalance(walletAddress);
            const balanceEther = ethers.utils.formatEther(balanceWei);
            return balanceEther;
        } catch (error) {
            console.error('Error getting user balance:', error);
            throw new InternalServerErrorException('Failed to get user balance');
        }
    }
    async getTransactionHistory(walletAddress: string): Promise<TransactionHistoryResponse> {
        try {
            if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
                throw new InternalServerErrorException('Invalid wallet address format');
            }

            const transactions = await this.etherscanProvider.getHistory(walletAddress);
            return {
                walletAddress,
                transactions, 
            };
        } catch (error) {
            console.error('Error getting transaction history:', error);
            throw new InternalServerErrorException('Failed to get transaction history');
        }
    }
}
