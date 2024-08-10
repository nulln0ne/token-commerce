import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserOrmEntity]), AuthModule],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
    ],
    exports: [UserService, 'IUserRepository'],
})
export class UserModule {}
