import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';
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

    async saveRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
        try {
            await this.redisClient.set(`refreshToken:${userId}`, refreshToken, 'EX', ttl);
        } catch (error) {
            throw new InternalServerErrorException(this.errorConfig.REDIS_CONNECTION_ERROR);
        }
    }

    async saveAccessToken(userId: string, accessToken: string, ttl: number): Promise<void> {
        try {
            await this.redisClient.set(`accessToken:${userId}`, accessToken, 'EX', ttl);
        } catch (error) {
            throw new InternalServerErrorException(this.errorConfig.REDIS_CONNECTION_ERROR);
        }
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        try {
            return await this.redisClient.get(`refreshToken:${userId}`);
        } catch (error) {
            throw new InternalServerErrorException(this.errorConfig.REDIS_CONNECTION_ERROR);
        }
    }

    async getAccessToken(userId: string): Promise<string | null> {
        try {
            return await this.redisClient.get(`accessToken:${userId}`);
        } catch (error) {
            throw new InternalServerErrorException(this.errorConfig.REDIS_CONNECTION_ERROR);
        }
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        try {
            await this.redisClient.del(`refreshToken:${userId}`);
        } catch (error) {
            throw new InternalServerErrorException(this.errorConfig.REDIS_CONNECTION_ERROR);
        }
    }

    async deleteAccessToken(userId: string): Promise<void> {
        try {
            await this.redisClient.del(`accessToken:${userId}`);
        } catch (error) {
            throw new InternalServerErrorException(this.errorConfig.REDIS_CONNECTION_ERROR);
        }
    }
}
