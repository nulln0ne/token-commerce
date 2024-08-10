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
        try {
            await this.redisClient.set(`refreshToken:${token.userId}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new Error('Error saving refresh token');
        }
    }

    async saveAccessToken(token: JwtAccessToken): Promise<void> {
        try {
            await this.redisClient.set(`accessToken:${token.userId}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new Error('Error saving access token');
        }
    }

    async getRefreshToken(userId: string): Promise<JwtRefreshToken | null> {
        try {
            const token = await this.redisClient.get(`refreshToken:${userId}`);
            return token ? JSON.parse(token) : null;
        } catch (error) {
            throw new Error('Failed to retrieve refresh token');
        }
    }

    async getAccessToken(userId: string): Promise<JwtAccessToken | null> {
        try {
            const token = await this.redisClient.get(`accessToken:${userId}`);
            return token ? JSON.parse(token) : null;
        } catch (error) {
            throw new Error('Failed to retrieve access token');
        }
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        try {
            await this.redisClient.del(`refreshToken:${userId}`);
        } catch (error) {
            throw new Error('Failed to delete refresh token');
        }
    }

    async deleteAccessToken(userId: string): Promise<void> {
        try {
            await this.redisClient.del(`accessToken:${userId}`);
        } catch (error) {
            throw new Error('Failed to delete access token');
        }
    }
}
