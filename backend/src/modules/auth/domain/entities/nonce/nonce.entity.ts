import { INonce } from './nonce-entity.interface';

export class NonceEntity implements INonce {
    walletAddress: string;
    nonce: string;
    createdAt: Date;

    constructor(walletAddress: string, nonce: string) {
        this.walletAddress = walletAddress;
        this.nonce = nonce;
        this.createdAt = new Date();
    }
}
