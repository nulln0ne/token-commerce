import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IJwtRefreshToken } from '../entities/jwt/jwt-entity.interface';
import { JwtRefreshTokenEntity } from '../entities/jwt/jwt.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';  

@Injectable()
export class JwtRepository {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}  

  private async handleRedisOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('Redis operation failed:', error);
      throw new InternalServerErrorException('Redis operation failed');
    }
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

  async findRefreshTokenById(id: number): Promise<IJwtRefreshToken | null> {
    const key = `refresh_token:${id}`;
    const refreshToken = await this.handleRedisOperation(() => this.redisClient.get(key));
    return refreshToken
      ? new JwtRefreshTokenEntity(id, 0, refreshToken, new Date(), new Date())
      : null;
  }

  async removeRefreshToken(id: number): Promise<void> {
    const key = `refresh_token:${id}`;
    await this.handleRedisOperation(() => this.redisClient.del(key));
  }
}
