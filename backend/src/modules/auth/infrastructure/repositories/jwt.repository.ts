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
        if (token.id === undefined || token.id === null) {
            throw new InternalServerErrorException('User ID is undefined while saving access token');
        }
        const key = `access_token:${token.id}`;
        await this.handleRedisOperation(() =>
            this.redisClient.set(key, token.accessToken, 'EX', token.ttl),
        );
    }

    async saveRefreshToken(token: IJwtRefreshToken): Promise<void> {
        if (token.id === undefined || token.id === null) {
            throw new InternalServerErrorException('User ID is undefined while saving refresh token');
        }
        const key = `refresh_token:${token.id}`;
        await this.handleRedisOperation(() =>
            this.redisClient.set(key, token.refreshToken, 'EX', token.ttl),
        );
    }

    async findAccessTokenById(id: number): Promise<IJwtAccessToken | null> {
        const key = `access_token:${id}`;
        const accessToken = await this.handleRedisOperation(() => this.redisClient.get(key));
        return accessToken
            ? new JwtAccessTokenEntity(id, 0, accessToken, new Date(), new Date())
            : null;
    }

    async findRefreshTokenById(id: number): Promise<IJwtRefreshToken | null> {
        const key = `refresh_token:${id}`;
        const refreshToken = await this.handleRedisOperation(() => this.redisClient.get(key));
        return refreshToken
            ? new JwtRefreshTokenEntity(id, 0, refreshToken, new Date(), new Date())
            : null;
    }

    async removeAccessToken(id: number): Promise<void> {
        const key = `access_token:${id}`;
        await this.handleRedisOperation(() => this.redisClient.del(key));
    }

    async removeRefreshToken(id: number): Promise<void> {
        const key = `refresh_token:${id}`;
        await this.handleRedisOperation(() => this.redisClient.del(key));
    }
}
