export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
}

export interface TransactionHistoryResponse {
    walletAddress: string;
    transactions: Transaction[];
}
