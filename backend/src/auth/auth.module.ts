import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/application/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisRepository } from './infrastructure/redis.repository';
import { ConfigModule } from 'src/config/config.module';

@Module({
    imports: [UserModule, ConfigModule],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtService, RedisRepository],
})
export class AuthModule {}
