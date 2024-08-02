import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    async findOneByWalletAddress(walletAddress: string): Promise<User | null> {
        console.log('Repository searching for walletAddress:', walletAddress);
        return this.userRepository.findOne({ where: { walletAddress: walletAddress.toLowerCase() } });
    }

    async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: id.toLowerCase() } });
    }

    async saveUser(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
