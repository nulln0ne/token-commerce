import { UserRepository } from '../infrastructure/user.repository';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getAll(): Promise<User[]> {
        return this.userRepository.getAll();
    }

    async findOneByUserId(userId: string): Promise<User | null> {
        return this.userRepository.findOneByUserId(userId);
    }

    async findOneByWalletAddress(walletAddress: string): Promise<User | null> {
        console.log(walletAddress);
        return this.userRepository.findOneByWalletAddress(walletAddress);
    }
}
