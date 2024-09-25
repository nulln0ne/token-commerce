import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ethers } from 'ethers';
import { blockchainConfig } from '../blockchain-eth.config';
import { TransactionRepository } from './transaction.repository';
import { UserRepository } from 'src/modules/user/infrastructure';
import { TransactionOrmEntity } from '../orm-entities/transactions.orm-entity';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';

@Injectable()
export class BlockchainRepository {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly tokenAddress: string;
  private readonly contractAddress: string;

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
  ) {
    const networkEndpoint = blockchainConfig.networkEndpoint;
    if (!networkEndpoint) {
      throw new InternalServerErrorException('Network endpoint not configured');
    }
    this.provider = new ethers.providers.JsonRpcProvider(networkEndpoint);
    this.tokenAddress = blockchainConfig.tokenAddress;
    this.contractAddress = blockchainConfig.contractAddress;
  }

  validateWalletAddress(walletAddress: string): void {
    if (!ethers.utils.isAddress(walletAddress)) {
      throw new InternalServerErrorException('Invalid wallet address format');
    }
  }

  async getBalance(walletAddress: string): Promise<string> {
    this.validateWalletAddress(walletAddress);
    try {
      const erc20Abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ];

      const tokenContract = new ethers.Contract(this.tokenAddress, erc20Abi, this.provider);
      const [balance, decimals] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.decimals(),
      ]);

      const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
      return balanceFormatted;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new InternalServerErrorException('Failed to get balance');
    }
  }

  async getTransactionHistory(walletAddress: string): Promise<{ 
    walletAddress: string; 
    transactions: TransactionResponseDto[]; 
  }> {
    this.validateWalletAddress(walletAddress);
  
    try {
      const user = await this.transactionRepository.findUserTransactions(walletAddress);
  
      if (!user || user.transactions.length === 0) {
        return {
          walletAddress,
          transactions: [],
        };
      }
  
      const sortedTransactions = user.transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
      const transactionsDto: TransactionResponseDto[] = sortedTransactions.map(transaction => ({
        hash: transaction.hash,
        amountSent: transaction.amountSent,
        amountReceived: transaction.amountReceived,
        fees: transaction.fees,
        status: transaction.status,
        timestamp: transaction.timestamp,
      }));
  
      return {
        walletAddress,
        transactions: transactionsDto,
      };
    } catch (error) {
      console.error('Error getting transaction history from DB:', error);
      throw new InternalServerErrorException('Failed to get transaction history from the database');
    }
  }
  
  listenForTransfers(): void {
    try {
      const abi = [
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ];
  
      const contract = new ethers.Contract(this.contractAddress, abi, this.provider);
  
      contract.on('Transfer', async (from, to, value, event) => {
        try {
          const block = await event.getBlock();
          const transactionHash = event.transactionHash;
          const transactionReceipt = await this.provider.getTransactionReceipt(transactionHash);
          const transaction = await this.provider.getTransaction(transactionHash);
  
          const fees = ethers.utils.formatUnits(transactionReceipt.gasUsed.mul(transaction.gasPrice), 'ether');
  
          const status = transactionReceipt.status === 1 ? 'Success' : 'Failed';
  
          const user = await this.userRepository.findUserByWalletAddress(from) ||
                       await this.userRepository.findUserByWalletAddress(to);
  
          if (user) {
            const transactionData = new TransactionOrmEntity();
            transactionData.hash = transactionHash;
            transactionData.from = from;
            transactionData.to = to;
            transactionData.amountSent = ethers.utils.formatUnits(value.toString(), 'ether');
            transactionData.amountReceived = ethers.utils.formatUnits(value.toString(), 'ether');
            transactionData.fees = fees;
            transactionData.status = status;
            transactionData.timestamp = new Date(block.timestamp * 1000); 
            transactionData.user = user;
  
            await this.transactionRepository.saveTransaction(transactionData);
  
            console.log('Transaction saved:', transactionData);
          } else {
            console.log('Transaction is not related to any users:', transactionHash);
          }
        } catch (error) {
          console.error('Error processing transfer event:', error);
        }
      });
    } catch (error) {
      console.error('Error listening for transfer events:', error);
      throw new InternalServerErrorException('Failed to listen for transfer events');
    }
  }
  
}
