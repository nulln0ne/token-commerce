import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getAll(): Promise<User[]> {
        return this.userRepository.getAll();
    }

    async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOneById(id);
    }

    async findOneByWalletAddress(walletAddress: string): Promise<User | null> {
        console.log(walletAddress);
        return this.userRepository.findOneByWalletAddress(walletAddress);
    }
}
