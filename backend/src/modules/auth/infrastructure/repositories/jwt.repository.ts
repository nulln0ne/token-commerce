import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { IJwtRepository } from '../../domain/interfaces/jwt-repository.interface';
import { IJwtAccessToken, IJwtRefreshToken } from '../../domain/entities/jwt/jwt-entity.interface';
import { JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain/entities/jwt/jwt.entity';
import Redis from 'ioredis';

@Injectable()
export class JwtRepository implements IJwtRepository {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    private async handleRedisOperation<T>(operation: () => Promise<T>): Promise<T | null> {
        try {
            return await operation();
        } catch (error) {
            console.error('Redis operation failed:', error);
            throw new InternalServerErrorException('Redis operation failed');
        }
    }

    async saveAccessToken(token: IJwtAccessToken): Promise<void> {
        const key = `access_token:${token.userId}`;
        if (!token.userId) {
            throw new InternalServerErrorException('User ID is undefined while saving access token');
        }
        await this.handleRedisOperation(() => this.redisClient.set(key, token.accessToken, 'EX', token.ttl));
    }

    async saveRefreshToken(token: IJwtRefreshToken): Promise<void> {
        const key = `refresh_token:${token.userId}`;
        if (!token.userId) {
            throw new InternalServerErrorException('User ID is undefined while saving refresh token');
        }
        await this.handleRedisOperation(() => this.redisClient.set(key, token.refreshToken, 'EX', token.ttl));
    }

    async findAccessTokenByUserId(userId: string): Promise<IJwtAccessToken | null> {
        const key = `access_token:${userId}`;
        const accessToken = await this.handleRedisOperation(() => this.redisClient.get(key));
        return accessToken ? new JwtAccessTokenEntity(userId, 0, accessToken, new Date(), new Date()) : null;
    }

    async findRefreshTokenByUserId(userId: string): Promise<IJwtRefreshToken | null> {
        const key = `refresh_token:${userId}`;
        const refreshToken = await this.handleRedisOperation(() => this.redisClient.get(key));
        return refreshToken ? new JwtRefreshTokenEntity(userId, 0, refreshToken, new Date(), new Date()) : null;
    }

    async removeAccessToken(userId: string): Promise<void> {
        const key = `access_token:${userId}`;
        await this.handleRedisOperation(() => this.redisClient.del(key));
    }

    async removeRefreshToken(userId: string): Promise<void> {
        const key = `refresh_token:${userId}`;
        await this.handleRedisOperation(() => this.redisClient.del(key));
    }
}
