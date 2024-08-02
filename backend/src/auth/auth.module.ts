import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { RedisRepository } from './infrastructure/redis.repository';
import { ConfigModule } from 'src/config/config.module';
import { AuthRepository } from './infrastructure/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.entity';

@Module({
    imports: [UserModule, ConfigModule, TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService, JwtService, RedisRepository, AuthRepository],
})
export class AuthModule {}
