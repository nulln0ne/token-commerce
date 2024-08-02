import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisConfig {
    constructor(private configService: ConfigService) {}

    public getRedisOptions(): RedisOptions {
        return {
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
            // password: this.configService.get<string>('REDIS_PASSWORD'),
        };
    }

    public createRedisClient(): Redis {
        return new Redis(this.getRedisOptions());
    }
}
