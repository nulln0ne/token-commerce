import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
    private redisClient: Redis;

    constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async saveRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
        await this.redisClient.set(`refreshToken:${userId}`, refreshToken, 'EX', ttl);
    }

    async saveAccessToken(userId: string, accessToken: string, ttl: number): Promise<void> {
        await this.redisClient.set(`accessToken:${userId}`, accessToken, 'EX', ttl);
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        return await this.redisClient.get(`refreshToken:${userId}`);
    }

    async getAccessToken(userId: string): Promise<string | null> {
        return await this.redisClient.get(`accessToken:${userId}`);
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        await this.redisClient.del(`refreshToken:${userId}`);
    }

    async deleteAccessToken(userId: string): Promise<void> {
        await this.redisClient.del(`accessToken:${userId}`);
    }
}
