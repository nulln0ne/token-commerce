import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { INonceRepository } from '../../domain';
import { INonce } from '../../domain';
import Redis from 'ioredis';

@Injectable()
export class NonceRepository implements INonceRepository {
    private readonly redisClient: Redis;

    constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async saveNonce(nonceEntity: INonce): Promise<void> {
        try {
            await this.redisClient.set(`nonce:${nonceEntity.userId}`, JSON.stringify(nonceEntity), 'EX', 60);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save nonce');
        }
    }

    async findNonceByUserId(userId: string): Promise<INonce | null> {
        try {
            const result = await this.redisClient.get(`nonce:${userId}`);
            if (!result) return null;
            return JSON.parse(result) as INonce;
        } catch (error) {
            throw new InternalServerErrorException('Failed to find nonce');
        }
    }

    async deleteNonce(userId: string): Promise<void> {
        try {
            await this.redisClient.del(`nonce:${userId}`);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete nonce');
        }
    }
}
