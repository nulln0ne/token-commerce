import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { IJwtRepository } from '../../domain/interfaces/jwt-repository.interface';
import { IJwtAccessToken, IJwtRefreshToken } from '../../domain/entities/jwt/jwt-entity.interface';
import { JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain/entities/jwt/jwt.entity';
import Redis from 'ioredis';

@Injectable()
export class JwtRepository implements IJwtRepository {
    private readonly redisClient: Redis;

    constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async saveAccessToken(token: IJwtAccessToken): Promise<void> {
        const key = `access_token:${token.userId}`;
        if (!token.userId) {
            throw new InternalServerErrorException('User ID is undefined while saving access token');
        }
        try {
            await this.redisClient.set(key, token.accessToken, 'EX', token.ttl);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save access token');
        }
    }

    async saveRefreshToken(token: IJwtRefreshToken): Promise<void> {
        const key = `refresh_token:${token.userId}`;
        if (!token.userId) {
            throw new InternalServerErrorException('User ID is undefined while saving refresh token');
        }
        try {
            await this.redisClient.set(key, token.refreshToken, 'EX', token.ttl);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save refresh token');
        }
    }

    async findAccessTokenByUserId(userId: string): Promise<IJwtAccessToken | null> {
        try {
            const key = `access_token:${userId}`;
            const accessToken = await this.redisClient.get(key);
            if (!accessToken) return null;

            return new JwtAccessTokenEntity(userId, 0, accessToken, new Date(), new Date());
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve access token');
        }
    }

    async findRefreshTokenByUserId(userId: string): Promise<IJwtRefreshToken | null> {
        try {
            const key = `refresh_token:${userId}`;
            const refreshToken = await this.redisClient.get(key);
            if (!refreshToken) return null;

            return new JwtRefreshTokenEntity(userId, 0, refreshToken, new Date(), new Date());
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve refresh token');
        }
    }

    async removeAccessToken(userId: string): Promise<void> {
        try {
            const key = `access_token:${userId}`;
            await this.redisClient.del(key);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete access token');
        }
    }

    async removeRefreshToken(userId: string): Promise<void> {
        try {
            const key = `refresh_token:${userId}`;
            await this.redisClient.del(key);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete refresh token');
        }
    }
}
