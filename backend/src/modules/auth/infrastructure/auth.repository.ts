import { UserRepository } from 'src/modules/user/infrastructure/user.repository';
import { User } from 'src/modules/user/domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends UserRepository {
    constructor(
        @InjectRepository(User)
        userRepository: Repository<User>,
    ) {
        super(userRepository);
    }

    async saveUser(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
