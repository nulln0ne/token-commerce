import { Injectable, Inject, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../domain';
import { IUserRepository } from '../../domain';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const existingUser = await this.userRepository.findUserByWalletAddress(createUserDto.walletAddress);

            if (existingUser) {
                throw new ConflictException('User with this wallet address already exists');
            }

            const newUser = new User(createUserDto.walletAddress);
            await this.userRepository.save(newUser);
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            return this.userRepository.getAllUsers();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    async findUserByWalletAddress(walletAddress: string): Promise<User | null> {
        try {
            return this.userRepository.findUserByWalletAddress(walletAddress);
        } catch (error) {
            throw new InternalServerErrorException('Failed to find user by wallet address');
        }
    }

    async findUserByUserId(userId: string): Promise<User | null> {
        try {
            return this.userRepository.findUserByUserId(userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to find user by user ID');
        }
    }
}
