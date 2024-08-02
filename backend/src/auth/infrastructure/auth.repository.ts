import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/infrastructure/user.repository';
import { User } from 'src/user/domain/user.entity';
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
