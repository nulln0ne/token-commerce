import { Module, forwardRef } from '@nestjs/common';

import { AuthController } from './presentation/auth.controller';
import { AuthRepository } from './infrastructure/auth.repository';
import { AuthService } from './application/auth.service';
import { ConfigModule } from 'src/config/config.module';
import { JwtConfigModule } from 'src/config/jwt/jwt.module';
import { JwtService } from '@nestjs/jwt';
import { RedisConfigModule } from 'src/config/redis/redis.module';
import { RedisRepository } from './infrastructure/redis.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/domain/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { ErrorConfigModule } from 'src/config/error/error.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        ConfigModule,
        TypeOrmModule.forFeature([User]),
        RedisConfigModule,
        JwtConfigModule,
        ErrorConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, RedisRepository, AuthRepository],
    exports: [AuthService, JwtService, RedisRepository, AuthRepository],
})
export class AuthModule {}
