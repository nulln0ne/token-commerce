import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';

export class UserRepository extends Repository<User> {
    async findOneByWalletAddress(walletAddress: string): Promise<User | null> {
        console.log('Repository searching for walletAddress:', walletAddress);
        return this.findOne({ where: { walletAddress: walletAddress.toLowerCase() } });
    }

    async getAll(): Promise<User[]> {
        return this.find();
    }

    async findOneById(id: string): Promise<User | null> {
        return this.findOne({ where: { id: id.toLowerCase() } });
    }

    async saveUser(user: User): Promise<User> {
        return this.save(user);
    }
}
