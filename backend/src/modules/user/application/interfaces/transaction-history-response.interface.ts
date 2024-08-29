import { ethers } from 'ethers';

export interface TransactionHistoryResponse {
    walletAddress: string;
    transactions: ethers.providers.TransactionResponse[];
}
