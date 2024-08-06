import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmConfigModule } from './database/typeorm.module';
import { RedisConfigModule } from './redis/redis.module';
import { JwtConfigModule } from './jwt/jwt.module';
import { ErrorConfigModule } from './error/error.module';
import { Module } from '@nestjs/common';
import redisConfig from './redis/redis.config';
import jwtConfig from './jwt/jwt.config';
import errorConfig from './error/error.config';
import { config } from 'dotenv';

config();

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './.env',
            load: [redisConfig, jwtConfig, errorConfig],
        }),
        TypeOrmConfigModule,
        JwtConfigModule,
        RedisConfigModule,
        ErrorConfigModule,
    ],
})
export class ConfigModule {}
