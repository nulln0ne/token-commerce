import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { UserOrmMapper } from './user.mapper';
import { IUserRepository } from '../domain';
import { User } from '../domain';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepository: Repository<UserOrmEntity>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        try {
            const ormEntities = await this.ormRepository.find();
            return ormEntities.map((ormEntity) => UserOrmMapper.toDomainEntity(ormEntity));
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    async save(user: User): Promise<void> {
        try {
            const ormEntity = UserOrmMapper.toOrmEntity(user);
            await this.ormRepository.save(ormEntity);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save user');
        }
    }

    async findUserByWalletAddress(walletAddress: string): Promise<User | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { walletAddress: walletAddress.toLowerCase() },
            });
            return ormEntity ? UserOrmMapper.toDomainEntity(ormEntity) : null;
        } catch (error) {
            throw new InternalServerErrorException('Failed to find user by wallet address');
        }
    }

    async findUserByUserId(userId: string): Promise<User | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({ where: { userId: userId } });
            return ormEntity ? UserOrmMapper.toDomainEntity(ormEntity) : null;
        } catch (error) {
            throw new InternalServerErrorException('Failed to find user by user ID');
        }
    }
}
