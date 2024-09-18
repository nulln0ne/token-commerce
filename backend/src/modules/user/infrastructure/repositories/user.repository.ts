import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepository: Repository<UserOrmEntity>,
    ) {}

    private async handleDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            console.error('Database operation failed:', error);
            throw new InternalServerErrorException('Database operation failed');
        }
    }

    async getAllUsers(): Promise<UserOrmEntity[]> {
        return this.handleDatabaseOperation(() => this.ormRepository.find());
    }

    async save(user: UserOrmEntity): Promise<void> {
        user.walletAddress = user.walletAddress.toLowerCase();
        await this.handleDatabaseOperation(() => this.ormRepository.save(user));
        }

    async findUserByWalletAddress(walletAddress: string): Promise<UserOrmEntity | null> {
        return this.handleDatabaseOperation(() =>
            this.ormRepository.findOne({ where: { walletAddress: walletAddress.toLowerCase() } }),
        );
    }

    async findUserById(id: number): Promise<UserOrmEntity | null> {
        return this.handleDatabaseOperation(() => this.ormRepository.findOne({ where: { id } }));
    }
}
