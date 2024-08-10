import { Injectable } from '@nestjs/common';
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

    async save(user: User): Promise<void> {
        const ormEntity = UserOrmMapper.toOrmEntity(user);
        await this.ormRepository.save(ormEntity);
    }

    async findAllUsers(): Promise<User[]> {
        const ormEntities = await this.ormRepository.find();
        return ormEntities.map((ormEntity) => UserOrmMapper.toDomainEntity(ormEntity));
    }

    async findUserByWalletAddress(walletAddress: string): Promise<User | null> {
        const ormEntity = await this.ormRepository.findOne({ where: { walletAddress: walletAddress.toLowerCase() } });
        return ormEntity ? UserOrmMapper.toDomainEntity(ormEntity) : null;
    }

    async findUserByUserId(userId: string): Promise<User | null> {
        const ormEntity = await this.ormRepository.findOne({ where: { id: userId } });
        return ormEntity ? UserOrmMapper.toDomainEntity(ormEntity) : null;
    }
}
