import { User } from "./entities/user.entity";

export interface UserDomain {
    getAllUsers(): Promise<User[]>;
    findUserByWalletAddress(walletAddress: string): Promise<User | null>;
    findUserByUserId(userId: string): Promise<User | null>;
    save(user: User): Promise<void>;
}
