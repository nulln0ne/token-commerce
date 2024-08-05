import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './presentation/user.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserService } from './application/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Module } from '@nestjs/common';
import { ErrorConfigModule } from 'src/config/error/error.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule, ErrorConfigModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserRepository, UserService],
})
export class UserModule {}
