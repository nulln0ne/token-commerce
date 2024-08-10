import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserRepository, UserService],
})
export class UserModule {}
