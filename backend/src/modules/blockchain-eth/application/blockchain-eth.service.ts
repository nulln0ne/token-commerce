import { Injectable } from '@nestjs/common';
import { BlockchainRepository } from '../infrastructure/blockchain-eth.repository';

@Injectable()
export class BlockchainEthService {
  constructor(private readonly blockchainRepository: BlockchainRepository) {}

  async getBalance(walletAddress: string): Promise<string> {
    return this.blockchainRepository.getBalance(walletAddress);
  }

  async getTransactionHistory(walletAddress: string): Promise<any> {
    return this.blockchainRepository.getTransactionHistory(walletAddress);
  }
}
