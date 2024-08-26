import { v4 as uuidv4 } from 'uuid';
import { IUser } from './user-entity.interface';

export class User implements IUser {
    public userId: string;
    public walletAddress: string;
    public createdAt: Date;

    constructor(walletAddress: string) {
        this.userId = uuidv4(); 
        this.walletAddress = walletAddress.toLowerCase();
    }
}
