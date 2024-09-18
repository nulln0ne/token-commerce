import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity, UserRepository } from './infrastructure';
import { UserController } from './presentation';
import { UserService } from './application';
import { AuthModule } from '../auth/auth.module';
import { UserDomain } from './domain/user.domain'; // Добавляем UserDomain

@Module({
    imports: [TypeOrmModule.forFeature([UserOrmEntity]),
    forwardRef(() => AuthModule), // Handle circular dependency
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository,UserDomain],
    exports: [UserService, UserRepository],
})
export class UserModule {}

