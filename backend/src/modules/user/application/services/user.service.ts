import { Injectable, Inject, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../domain';
import { ConfigService } from '@nestjs/config';
import { UserDomain } from '../../domain/user.domain';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ethers } from 'ethers';
import { TransactionHistoryResponse } from '../interfaces/transaction-history-response.interface';

@Injectable()
export class UserService {
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly etherscanProvider: ethers.providers.EtherscanProvider;

    constructor(
        @Inject('UserDomain')
        private readonly userRepository: UserDomain,
        private readonly configService: ConfigService,
    ) {
        const networkEndpoint = this.configService.get<string>('NETWORK_ENDPOINT');
        const etherscanApiKey = this.configService.get<string>('ETHERSCAN_API_KEY');

        if (!networkEndpoint) {
            throw new InternalServerErrorException('Infura endpoint not configured');
        }

        if (!etherscanApiKey) {
            throw new InternalServerErrorException('Etherscan API key not configured');
        }

        this.provider = new ethers.providers.JsonRpcProvider(networkEndpoint);
        this.etherscanProvider = new ethers.providers.EtherscanProvider('homestead', etherscanApiKey);
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
    
            const tokenAddress = '0x2C9BB4d690CE1DF2010A0A6300303B3fdb860B2A';
    
            const erc20Abi = [
                "function balanceOf(address owner) view returns (uint256)",
                "function decimals() view returns (uint8)"
            ];
    
            const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
    
            const balance = await tokenContract.balanceOf(walletAddress);
            const decimals = await tokenContract.decimals();
    
            const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
            return balanceFormatted;
    
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
