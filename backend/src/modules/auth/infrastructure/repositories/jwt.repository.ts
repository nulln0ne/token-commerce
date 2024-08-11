import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { IJwtRepository } from '../../domain';
import { IJwtAccessToken, IJwtRefreshToken } from '../../domain';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class JwtRepository implements IJwtRepository {
    private readonly redisClient: Redis;

    constructor(
        private readonly jwtService: JwtService,
        @Inject('REDIS_CLIENT') redisClient: Redis,
    ) {
        this.redisClient = redisClient;
    }

    async saveAccessToken(token: IJwtAccessToken): Promise<void> {
        try {
            await this.redisClient.set(`access_token:${token.accessToken}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save access token');
        }
    }

    async saveRefreshToken(token: IJwtRefreshToken): Promise<void> {
        try {
            await this.redisClient.set(`refresh_token:${token.refreshToken}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save refresh token');
        }
    }

    async findAccessToken(token: string): Promise<IJwtAccessToken | null> {
        try {
            const result = await this.redisClient.get(`access_token:${token}`);
            if (!result) return null;
            return JSON.parse(result) as IJwtAccessToken;
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve access token');
        }
    }

    async findRefreshToken(token: string): Promise<IJwtRefreshToken | null> {
        try {
            const result = await this.redisClient.get(`refresh_token:${token}`);
            if (!result) return null;
            return JSON.parse(result) as IJwtRefreshToken;
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve refresh token');
        }
    }

    async removeAccessToken(token: string): Promise<void> {
        try {
            await this.redisClient.del(`access_token:${token}`);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete access token');
        }
    }

    async removeRefreshToken(token: string): Promise<void> {
        try {
            await this.redisClient.del(`refresh_token:${token}`);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete refresh token');
        }
    }

    async validateToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new InternalServerErrorException('Failed to validate token');
        }
    }

    async findAccessTokensByUserId(userId: string): Promise<IJwtAccessToken[]> {
        try {
            const keys = await this.redisClient.keys(`access_token:*`);
            const tokens = await Promise.all(keys.map((key) => this.redisClient.get(key)));
            return tokens
                .map((token) => JSON.parse(token) as IJwtAccessToken)
                .filter((token) => token.userId === userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve access tokens');
        }
    }

    async findRefreshTokensByUserId(userId: string): Promise<IJwtRefreshToken[]> {
        try {
            const keys = await this.redisClient.keys(`refresh_token:*`);
            const tokens = await Promise.all(keys.map((key) => this.redisClient.get(key)));
            return tokens
                .map((token) => JSON.parse(token) as IJwtRefreshToken)
                .filter((token) => token.userId === userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve refresh tokens');
        }
    }
}
