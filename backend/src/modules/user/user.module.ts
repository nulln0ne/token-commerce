import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity, UserRepository } from './infrastructure';
import { UserController } from './presentation';
import { UserService } from './application';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserOrmEntity]), AuthModule],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: 'UserDomain',
            useClass: UserRepository,
        },
    ],
    exports: [UserService, 'UserDomain'],
})
export class UserModule {}
