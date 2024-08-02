import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { DatabaseConfig } from './config/db.config';
import { JwtConfig } from './config/jwt.config';
import { RedisConfig } from './config/redis.config';

@Module({
    imports: [
        NestConfigModule.forRoot({
            envFilePath: [
                '/home/uladzislau/code/token-commerce/backend/src/config/.db.env',
                '/home/uladzislau/code/token-commerce/backend/src/config/.jwt.env',
                '/home/uladzislau/code/token-commerce/backend/src/config/.redis.env',
            ],
            isGlobal: true,
        }),
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [DatabaseConfig],
            useFactory: (dbConfig: DatabaseConfig) => dbConfig.getTypeOrmConfig(),
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [JwtConfig],
            useFactory: (jwtConfig: JwtConfig) => jwtConfig.getJwtAccessConfig(),
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            inject: [RedisConfig],
            useFactory: (redisConfig: RedisConfig) => redisConfig.createRedisClient(),
        },
    ],
})
export class AppModule {}
