import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { IRedisConfig } from '../interfaces/redis.config.interface';

@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (configService: ConfigService): Redis => {
                const config = configService.get<IRedisConfig>('redis');
                console.log('Redis Configuration:', config); // Debugging line
                if (!config) {
                    throw new Error('Redis configuration is not defined');
                }
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
