import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtAccessToken, JwtRefreshToken } from '../domain/jwt.entity';
import { IErrorConfig } from 'src/config/interfaces/error.config.interface';

@Injectable()
export class RedisRepository {
    private redisClient: Redis;

    constructor(
        @Inject('REDIS_CLIENT') redisClient: Redis,
        @Inject('ERROR_CONFIG') private readonly errorConfig: IErrorConfig,
    ) {
        this.redisClient = redisClient;
    }

    async saveRefreshToken(token: JwtRefreshToken): Promise<void> {
        try {
            await this.redisClient.set(`refreshToken:${token.userId}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new Error(this.errorConfig.ERROR_SAVING_REFRESH_TOKEN);
        }
    }

    async saveAccessToken(token: JwtAccessToken): Promise<void> {
        try {
            await this.redisClient.set(`accessToken:${token.userId}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new Error(this.errorConfig.ERROR_SAVING_ACCESS_TOKEN);
        }
    }

    async getRefreshToken(userId: string): Promise<JwtRefreshToken | null> {
        try {
            const token = await this.redisClient.get(`refreshToken:${userId}`);
            return token ? JSON.parse(token) : null;
        } catch (error) {
            throw new Error(this.errorConfig.FAILED_TO_RETRIEVE_REFRESH_TOKEN);
        }
    }

    async getAccessToken(userId: string): Promise<JwtAccessToken | null> {
        try {
            const token = await this.redisClient.get(`accessToken:${userId}`);
            return token ? JSON.parse(token) : null;
        } catch (error) {
            throw new Error(this.errorConfig.FAILED_TO_RETRIEVE_ACCESS_TOKEN);
        }
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        try {
            await this.redisClient.del(`refreshToken:${userId}`);
        } catch (error) {
            throw new Error(this.errorConfig.FAILED_TO_DELETE_REFRESH_TOKEN);
        }
    }

    async deleteAccessToken(userId: string): Promise<void> {
        try {
            await this.redisClient.del(`accessToken:${userId}`);
        } catch (error) {
            throw new Error(this.errorConfig.FAILED_TO_DETELE_ACCESS_TOKEN);
        }
    }
}
