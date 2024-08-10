import { Injectable } from '@nestjs/common';
import { User } from '../domain';
import { IUserRepository } from '../domain';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async createUser(walletAddress: string): Promise<User> {
        const newUser = new User(walletAddress);
        await this.userRepository.save(newUser);

        return newUser;
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }

    async findUserByWalletAddress(walletAddress: string): Promise<User | null> {
        return this.userRepository.findUserByWalletAddress(walletAddress);
    }

    async findUserByUserId(userId: string): Promise<User | null> {
        return this.userRepository.findUserByUserId(userId);
    }
}
