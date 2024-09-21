import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockchainRepository {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly tokenAddress: string = '0x2C9BB4d690CE1DF2010A0A6300303B3fdb860B2A'; // Адрес токена

  constructor(private readonly configService: ConfigService) {
    const networkEndpoint = this.configService.get<string>('NETWORK_ENDPOINT');
    if (!networkEndpoint) {
      throw new InternalServerErrorException('Network endpoint not configured');
    }
    this.provider = new ethers.providers.JsonRpcProvider(networkEndpoint);
  }

  validateWalletAddress(walletAddress: string): void {
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
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

  async getTransactionHistory(walletAddress: string): Promise<any> {
    this.validateWalletAddress(walletAddress);

    try {
      const contractAddress = '0xf117e28D8C9dEB52eDb3f10cFa2eA389d9873188';
      const abi = [
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ];

      const contract = new ethers.Contract(contractAddress, abi, this.provider);
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
      throw new InternalServerErrorException('Failed to get transaction history');
    }
  }
}
