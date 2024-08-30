import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { UserOrmMapper } from '../utils/user.mapper';
import { UserDomain } from '../../domain';
import { User } from '../../domain';

@Injectable()
export class UserRepository implements UserDomain {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepository: Repository<UserOrmEntity>,
    ) {}

    private async handleDatabaseOperation<T>(operation: () => Promise<T>): Promise<T | null> {
        try {
            return await operation();
        } catch (error) {
            console.error('Database operation failed:', error);
            throw new InternalServerErrorException('Database operation failed');
        }
    }

    async getAllUsers(): Promise<User[]> {
        const ormEntities = await this.handleDatabaseOperation(() => this.ormRepository.find());
        return ormEntities.map(UserOrmMapper.toDomainEntity);
    }

    async save(user: User): Promise<void> {
        const ormEntity = UserOrmMapper.toOrmEntity(user);
        await this.handleDatabaseOperation(() => this.ormRepository.save(ormEntity));
    }

    async findUserByWalletAddress(walletAddress: string): Promise<User | null> {
        const ormEntity = await this.handleDatabaseOperation(() =>
            this.ormRepository.findOne({ where: { walletAddress: walletAddress.toLowerCase() } }),
        );
        return ormEntity ? UserOrmMapper.toDomainEntity(ormEntity) : null;
    }

    async findUserByUserId(userId: string): Promise<User | null> {
        const ormEntity = await this.handleDatabaseOperation(() => this.ormRepository.findOne({ where: { userId } }));
        return ormEntity ? UserOrmMapper.toDomainEntity(ormEntity) : null;
    }
}
