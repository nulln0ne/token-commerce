import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfig } from 'src/config/redis.config';

@Injectable()
export class RedisRepository {
    private redisClient: Redis;
    constructor(private redisConfig: RedisConfig) {
        this.redisClient = redisConfig.createRedisClient();
    }

    async saveRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
        await this.redisClient.set(`refreshToken:${userId}`, refreshToken, 'EX', ttl);
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        return await this.redisClient.get(`refreshToken:${userId}`);
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        await this.redisClient.del(`refreshToken:${userId}`);
    }
}
