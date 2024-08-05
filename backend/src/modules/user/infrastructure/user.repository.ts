import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';

export class UserRepository {
    protected readonly userRepository: Repository<User>;
    constructor(
        @InjectRepository(User)
        userRepository: Repository<User>,
    ) {
        this.userRepository = userRepository;
    }

    async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneByWalletAddress(walletAddress: string): Promise<User | null> {
        console.log('Repository searching for walletAddress:', walletAddress);
        return this.userRepository.findOne({ where: { walletAddress: walletAddress.toLowerCase() } });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: id.toLowerCase() } });
    }
}
