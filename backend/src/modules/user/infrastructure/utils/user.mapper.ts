import { User } from '../../domain';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';

export class UserOrmMapper {
    static toDomainEntity(ormEntity: UserOrmEntity): User {
        const domainEntity = new User(ormEntity.walletAddress);
        domainEntity.userId = ormEntity.userId;
        domainEntity.createdAt = ormEntity.createdAt;

        return domainEntity;
    }

    static toOrmEntity(domainEntity: User): UserOrmEntity {
        const ormEntity = new UserOrmEntity();
        ormEntity.userId = domainEntity.userId;
        ormEntity.walletAddress = domainEntity.walletAddress;
        ormEntity.createdAt = domainEntity.createdAt;

        return ormEntity;
    }
}
