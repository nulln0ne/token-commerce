import { IUser } from './user-entity.interface';

export class User implements IUser {
    public userId: string;
    public walletAddress: string;
    public createdAt: Date;

    constructor(walletAddress: string) {
        this.walletAddress = walletAddress.toLowerCase();
    }
}
