import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IJwtRepository } from '../domain/jwt-repository.interface';
import { JwtAccessToken, JwtRefreshToken } from '../domain/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class JwtRepository implements IJwtRepository {
    private readonly redisClient: Redis;

    constructor(private readonly jwtService: JwtService) {
        try {
            this.redisClient = new Redis({
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT, 10),
                password: process.env.REDIS_PASSWORD,
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to initialize Redis client');
        }
    }

    async saveAccessToken(token: JwtAccessToken): Promise<void> {
        try {
            await this.redisClient.set(`access_token:${token.accessToken}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save access token');
        }
    }

    async saveRefreshToken(token: JwtRefreshToken): Promise<void> {
        try {
            await this.redisClient.set(`refresh_token:${token.refreshToken}`, JSON.stringify(token), 'EX', token.ttl);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save refresh token');
        }
    }

    async findAccessToken(token: string): Promise<JwtAccessToken | null> {
        try {
            const result = await this.redisClient.get(`access_token:${token}`);
            if (!result) return null;
            return JSON.parse(result) as JwtAccessToken;
        } catch (error) {
            throw new InternalServerErrorException('Failed to find access token');
        }
    }

    async findRefreshToken(token: string): Promise<JwtRefreshToken | null> {
        try {
            const result = await this.redisClient.get(`refresh_token:${token}`);
            if (!result) return null;
            return JSON.parse(result) as JwtRefreshToken;
        } catch (error) {
            throw new InternalServerErrorException('Failed to find refresh token');
        }
    }

    async deleteAccessToken(token: string): Promise<void> {
        try {
            await this.redisClient.del(`access_token:${token}`);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete access token');
        }
    }

    async deleteRefreshToken(token: string): Promise<void> {
        try {
            await this.redisClient.del(`refresh_token:${token}`);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete refresh token');
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new InternalServerErrorException('Failed to verify token');
        }
    }

    async findAccessTokensByUserId(userId: string): Promise<JwtAccessToken[]> {
        try {
            const keys = await this.redisClient.keys(`access_token:*`);
            const tokens = await Promise.all(keys.map((key) => this.redisClient.get(key)));
            return tokens
                .map((token) => JSON.parse(token) as JwtAccessToken)
                .filter((token) => token.userId === userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to find access tokens');
        }
    }

    async findRefreshTokensByUserId(userId: string): Promise<JwtRefreshToken[]> {
        try {
            const keys = await this.redisClient.keys(`refresh_token:*`);
            const tokens = await Promise.all(keys.map((key) => this.redisClient.get(key)));
            return tokens
                .map((token) => JSON.parse(token) as JwtRefreshToken)
                .filter((token) => token.userId === userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to find refresh tokens');
        }
    }
}
