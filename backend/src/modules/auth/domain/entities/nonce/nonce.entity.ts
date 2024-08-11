import { INonce } from './nonce-entity.interface';

export class NonceEntity implements INonce {
    userId: string;
    nonce: string;
    createdAt: Date;

    constructor(userId: string, nonce: string) {
        this.userId = userId;
        this.nonce = nonce;
        this.createdAt = new Date();
    }
}
