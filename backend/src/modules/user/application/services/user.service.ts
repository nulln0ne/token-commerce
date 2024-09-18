import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { ethers } from 'ethers';
  import { CreateUserDto } from '../dtos/create-user.dto';
  import { TransactionHistoryResponse } from '../interfaces/transaction-history-response.interface';
  import { UserRepository } from '../../infrastructure';
  import { UserOrmEntity } from '../../infrastructure';
  import { UserDomain } from '../../domain/user.domain';
  
  @Injectable()
  export class UserService {
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly etherscanProvider: ethers.providers.EtherscanProvider;
  
    constructor(
      private readonly userRepository: UserRepository,
      private readonly configService: ConfigService,
      private readonly userDomain: UserDomain,
    ) {
      const networkEndpoint = this.configService.get<string>('NETWORK_ENDPOINT');
      const etherscanApiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
  
      if (!networkEndpoint) {
        throw new InternalServerErrorException('Network endpoint not configured');
      }
  
      if (!etherscanApiKey) {
        throw new InternalServerErrorException('Etherscan API key not configured');
      }
  
      this.provider = new ethers.providers.JsonRpcProvider(networkEndpoint);
      this.etherscanProvider = new ethers.providers.EtherscanProvider(
        'homestead',
        etherscanApiKey,
      );
    }
  
    async createUser(createUserDto: CreateUserDto) {
      return this.userDomain.createUser(createUserDto);
    }

  
    async getAllUsers(): Promise<UserOrmEntity[]> {
      return this.userDomain.getAllUsers();
    }
  
    async findUserByWalletAddress(walletAddress: string) {
      return this.userDomain.findUserByWalletAddress(walletAddress);
    
    }

    async findUserByUserId(id: number): Promise<UserOrmEntity | null> {
      return this.userDomain.findUserByUserId(id);
    }
  
    async getUserBalance(walletAddress: string): Promise<string> {
      try {
        if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
          throw new InternalServerErrorException('Invalid wallet address format');
        }
  
        const tokenAddress = '0x2C9BB4d690CE1DF2010A0A6300303B3fdb860B2A';
  
        const erc20Abi = [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)',
        ];
  
        const tokenContract = new ethers.Contract(
          tokenAddress,
          erc20Abi,
          this.provider,
        );
  
        const [balance, decimals] = await Promise.all([
          tokenContract.balanceOf(walletAddress),
          tokenContract.decimals(),
        ]);
  
        const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
        return balanceFormatted;
      } catch (error) {
        console.error('Error getting user balance:', error);
        throw new InternalServerErrorException('Failed to get user balance');
      }
    }
  
    async getTransactionHistory(
      walletAddress: string,
    ): Promise<TransactionHistoryResponse> {
      try {
        if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
          throw new InternalServerErrorException('Invalid wallet address format');
        }
  
        const contractAddress = '0xf117e28D8C9dEB52eDb3f10cFa2eA389d9873188';
  
        const abi = [
          'event Transfer(address indexed from, address indexed to, uint256 value)',
        ];
  
        const contract = new ethers.Contract(
          contractAddress,
          abi,
          this.provider,
        );
  
        const filter = contract.filters.Transfer(null, walletAddress);
        const events = await contract.queryFilter(filter, 0, 'latest');
  
        const transactions = await Promise.all(
          events.map(async (tx) => {
            const block = await tx.getBlock();
            return {
              hash: tx.transactionHash,
              from: tx.args?.from,
              to: tx.args?.to,
              value: ethers.utils.formatUnits(tx.args?.value.toString(), 'ether'),
              timestamp: block.timestamp,
            };
          }),
        );
  
        return {
          walletAddress,
          transactions,
        };
      } catch (error) {
        console.error('Error getting transaction history:', error);
        throw new InternalServerErrorException(
          'Failed to get transaction history',
        );
      }
    }
  }
  