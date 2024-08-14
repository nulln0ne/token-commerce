import { INonce } from '../entities/nonce/nonce-entity.interface';

export interface INonceRepository {
    saveNonce(nonce: INonce): Promise<void>;
    findNonceByWalletAddress(walletAddress: string): Promise<INonce | null>;
    deleteNonce(walletAddress: string): Promise<void>;
}
