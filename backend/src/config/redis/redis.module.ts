import { IRedisConfig } from '../interfaces/redis.config.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisConfig from './redis.config';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
    imports: [ConfigModule.forFeature(redisConfig)],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (configService: ConfigService): Redis => {
                const config = configService.get<IRedisConfig>('redis');
                return new Redis({
                    host: config.host,
                    port: config.port,
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisConfigModule {}
