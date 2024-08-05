import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtAccessToken, JwtRefreshToken } from '../domain/jwt.entity';

@Injectable()
export class RedisRepository {
    private redisClient: Redis;

    constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async saveRefreshToken(token: JwtRefreshToken): Promise<void> {
        await this.redisClient.set(`refreshToken:${token.userId}`, JSON.stringify(token), 'EX', token.ttl);
    }

    async saveAccessToken(token: JwtAccessToken): Promise<void> {
        await this.redisClient.set(`accessToken:${token.userId}`, JSON.stringify(token), 'EX', token.ttl);
    }

    async getRefreshToken(userId: string): Promise<JwtRefreshToken | null> {
        const token = await this.redisClient.get(`refreshToken:${userId}`);
        return token ? JSON.parse(token) : null;
    }

    async getAccessToken(userId: string): Promise<JwtAccessToken | null> {
        const token = await this.redisClient.get(`accessToken:${userId}`);
        return token ? JSON.parse(token) : null;
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        await this.redisClient.del(`refreshToken:${userId}`);
    }

    async deleteAccessToken(userId: string): Promise<void> {
        await this.redisClient.del(`accessToken:${userId}`);
    }
}
