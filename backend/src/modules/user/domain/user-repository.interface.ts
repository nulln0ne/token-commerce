import { User } from './user.entity';

export interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    findUserByWalletAddress(walletAddress: string): Promise<User | null>;
    findUserByUserId(userId: string): Promise<User | null>;
    save(user: User): Promise<void>;
}
