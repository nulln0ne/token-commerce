  import {Injectable,} from '@nestjs/common';
  import { CreateUserDto } from '../dtos/create-user.dto';
  import { TransactionHistoryResponse } from 'src/modules/blockchain-eth';
  import { UserOrmEntity } from '../../infrastructure';
  import { UserDomain } from '../../domain/user.domain';
  import { BlockchainEthService } from 'src/modules/blockchain-eth/application/blockchain-eth.service';
  
  @Injectable()
  export class UserService {
    constructor(
      private readonly blockchainEthService: BlockchainEthService, 
      private readonly userDomain: UserDomain,
    ) {}
  
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
      return this.blockchainEthService.getBalance(walletAddress);
    }
  
    async getTransactionHistory(walletAddress: string): Promise<TransactionHistoryResponse> {
      return this.blockchainEthService.getTransactionHistory(walletAddress);
    }
  }
  