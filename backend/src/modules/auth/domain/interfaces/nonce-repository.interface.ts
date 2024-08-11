import { INonce } from '../entities/nonce/nonce-entity.interface';

export interface INonceRepository {
    saveNonce(nonce: INonce): Promise<void>;
    findNonceByUserId(userId: string): Promise<INonce | null>;
    deleteNonce(userId: string): Promise<void>;
}
