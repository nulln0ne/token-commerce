import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { INonce } from '../../domain/entities/nonce/nonce-entity.interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class NonceRepository  {
    constructor(@InjectRedis() private readonly redisClient: Redis) {}  

    private async handleRedisOperation<T>(operation: () => Promise<T>): Promise<T | null> {
        try {
            return await operation();
        } catch (error) {
            console.error('Redis operation failed:', error);
            throw new InternalServerErrorException('Redis operation failed');
        }
    }

    async saveNonce(nonceEntity: INonce): Promise<void> {
        const key = `nonce:${nonceEntity.walletAddress}`;
        await this.handleRedisOperation(() => this.redisClient.set(key, nonceEntity.nonce, 'EX', 60));
    }

    async findNonceByWalletAddress(walletAddress: string): Promise<INonce | null> {
        const key = `nonce:${walletAddress}`;
        const nonce = await this.handleRedisOperation(() => this.redisClient.get(key));
        return nonce ? { walletAddress, nonce, createdAt: new Date() } : null;
    }

    async removeNonce(walletAddress: string): Promise<void> {
        const key = `nonce:${walletAddress}`;
        await this.handleRedisOperation(() => this.redisClient.del(key));
    }
}
